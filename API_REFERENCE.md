# 📚 CSE API Reference

This document details all CSE API endpoints used by the MCP server.

## Base URL

```
https://www.cse.lk/api
```

## Request Headers

```javascript
{
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Origin': 'https://www.cse.lk',
  'Referer': 'https://www.cse.lk/',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json, text/plain, */*'
}
```

---

## Endpoints

### 1. `tradeSummary`

**Category**: Infrastructure & Mapping  
**Method**: POST  
**Params**: None  
**MCP Tool**: `scan_market`

**Description**: Returns a list of ALL listed companies with current trading data.

**Response Structure**:

```json
{
  "reqTradeSummery": [
    {
      "id": 138,
      "symbol": "JKH.N0000",
      "name": "John Keels Holdings",
      "price": 425.5,
      "change": 5.25,
      "volume": 120000
    }
    // ... more stocks
  ]
}
```

**Important Notes**:

- Response property is "Summery" (note the typo) not "Summary"
- Master key endpoint - must cache this for symbol→ID mapping
- Use `id` to call other endpoints that require `stockId`
- Returns ~280-300 listed companies

---

### 2. `allSectors`

**Category**: Infrastructure & Mapping  
**Method**: POST  
**Params**: None  
**MCP Tool**: `get_sectors`

**Description**: Returns performance data for all market sectors.

**Response Structure**:

```json
[
  {
    "sector": "Banking",
    "name": "Banking",
    "change": 2.15,
    "turnover": 50000000
  },
  {
    "sector": "Diversified",
    "change": -1.05,
    "turnover": 25000000
  }
  // ... more sectors
]
```

**Sectors Found**:

- Banking
- Diversified Holdings
- Food & Beverages
- Chemicals & Pharmaceuticals
- Motors & Tyres
- Plantations
- Technology & Telecom
- Hotels & Travels
- Construction & Engineering
- Manufacturing & Textiles
- And others...

---

### 3. `marketStatus`

**Category**: Market Overview  
**Method**: POST  
**Params**: None  
**MCP Tool**: `get_market_status`

**Description**: Indicates whether the market is currently open or closed.

**Response Structure**:

```json
{
  "status": "CLOSED",
  "message": "Market is closed"
}
```

**Status Values**:

- `"OPEN"` - Trading is active
- `"CLOSED"` - Market is closed
- `"SUSPENDED"` - Trading halted

---

### 4. `dailyMarketSummery`

**Category**: Market Overview  
**Method**: POST  
**Params**: None  
**MCP Tool**: `get_market_summary`

**Description**: Daily market metrics including valuation ratios and flow data.

**Response Structure**:

```json
{
  "marketPE": "15.75",
  "marketPB": "1.25",
  "netForeignFlow": "50000000",
  "totalTurnover": "250000000",
  "totalVolume": "5000000"
}
```

**Metrics Explained**:

- `marketPE`: Price-to-Earnings ratio of entire market
- `marketPB`: Price-to-Book ratio
- `netForeignFlow`: Net foreign investor flow (LKR)
- `totalTurnover`: Total trading value
- `totalVolume`: Total shares traded

**Note**: Property name has typo "Summery" not "Summary"

---

### 5. `topGainers`

**Category**: Market Overview  
**Method**: POST  
**Params**: None  
**MCP Tool**: `get_top_gainers`

**Description**: List of stocks with highest % gain for the day.

**Response Structure**:

```json
[
  {
    "id": 100,
    "symbol": "COMB.N0000",
    "name": "Commercial Bank of Ceylon",
    "price": 355.0,
    "change": 12.5,
    "volume": 500000
  }
  // ... more stocks (up to 20)
]
```

**Response Order**: Sorted by % change descending

---

### 6. `orderBook`

**Category**: Stock-Specific  
**Method**: POST  
**Params**: `stockId=<ID>`  
**Example**: `orderBook` with body `stockId=138`  
**MCP Tool**: `get_order_book`

**Description**: Get market depth (bid/ask levels) for a stock.

**Response Structure**:

```json
{
  "totalBids": 5,
  "totalAsks": 5,
  "bids": [
    {
      "price": 425.0,
      "volume": 1000
    },
    {
      "price": 424.5,
      "volume": 2000
    }
  ],
  "asks": [
    {
      "price": 426.0,
      "volume": 1500
    },
    {
      "price": 426.5,
      "volume": 800
    }
  ]
}
```

**How to Interpret**:

- `bids`: Buy orders (best price first)
- `asks`: Sell orders (best price first)
- If sum of bid volumes >> sum of ask volumes = bullish pressure
- Vice versa = bearish pressure

**Required**: Must know stock's internal `id` first

---

### 7. `todaySharePrice`

**Category**: Stock-Specific  
**Method**: POST  
**Params**: `symbol=<SYMBOL>`  
**Example**: `todaySharePrice` with body `symbol=JKH.N0000`  
**MCP Tool**: `get_stock_snapshot`

**Description**: Real-time price data for a single stock.

**Response Structure**:

```json
{
  "open": "420.00",
  "high": "428.50",
  "low": "418.00",
  "last": "425.50",
  "volume": "125000",
  "crossingVolume": "0",
  "change": "5.25",
  "changePercent": "1.25"
}
```

**Metrics Explained**:

- `open`: Opening price today
- `high`/`low`: Daily high/low
- `last`: Most recent trade price
- `volume`: Total shares traded
- `crossingVolume`: Block trades (if any)
- `change`: Price change in LKR
- `changePercent`: Percentage change

**Note**: Prices and volumes are formatted strings (have commas) - must sanitize!

---

### 8. `companyChartDataByStock`

**Category**: Stock-Specific  
**Method**: POST  
**Params**: `stockId=<ID>&period=<PERIOD>`  
**Example**: `companyChartDataByStock` with body `stockId=138&period=5`  
**MCP Tool**: `get_chart_data`

**Description**: Historical OHLCV (candlestick) data for charting.

**Response Structure**:

```json
[
  {
    "date": "2026-01-15",
    "open": "420.00",
    "high": "428.50",
    "low": "418.00",
    "close": "425.50",
    "volume": "125000"
  }
  // ... more candles
]
```

**Period Options**:

- `"1"` = Intraday (15-min candles)
- `"2"` = Weekly candles
- `"3"` = Monthly candles
- `"5"` = Daily candles (most common)

**Default**: Daily (5)

**Response Order**: Oldest first, newest last

---

### 9. `detailedTrades`

**Category**: Deep Research  
**Method**: POST  
**Params**: Optional `symbol=<SYMBOL>`  
**MCP Tool**: `get_detailed_trades`

**Description**: Tick-by-tick trade data (every individual transaction).

**Response Structure**:

```json
[
  {
    "symbol": "JKH.N0000",
    "price": "425.50",
    "volume": "100",
    "time": "15:30:45",
    "buyer": "ABC Investment",
    "seller": "XYZ Traders"
  }
  // ... more trades (most recent first)
]
```

**No Symbol Parameter**: Returns trades from ALL stocks

**Use Cases**:

- Identify institutional buying/selling
- Track large block trades
- Analyze trading patterns
- Detect unusual activity

---

### 10. `companyProfile`

**Category**: Deep Research  
**Method**: POST  
**Params**: `symbol=<SYMBOL>`  
**Example**: `companyProfile` with body `symbol=JKH.N0000`  
**MCP Tool**: `get_company_profile`

**Description**: Company information including management structure.

**Response Structure**:

```json
{
  "symbol": "JKH.N0000",
  "name": "John Keels Holdings PLC",
  "businessDescription": "Diversified holding company...",
  "directors": [
    {
      "name": "John A. Page",
      "position": "Chairman"
    },
    {
      "name": "Paul A. Gould",
      "position": "Chief Executive Officer"
    }
  ],
  "secretaries": [
    {
      "name": "Susan P. Blake",
      "position": "Company Secretary"
    }
  ],
  "registrars": [
    {
      "name": "CSE Registry",
      "address": "Colombo, Sri Lanka"
    }
  ]
}
```

**Includes**:

- Company description
- Board of directors
- Company secretaries
- Registrars contact info

---

### 11. `financials`

**Category**: Deep Research  
**Method**: POST  
**Params**: `symbol=<SYMBOL>`  
**Example**: `financials` with body `symbol=JKH.N0000`  
**MCP Tool**: `get_financial_reports`

**Description**: Links to quarterly and annual financial reports.

**Response Structure**:

```json
{
  "infoQuarterlyData": [
    {
      "fileText": "Q1 2025 Results",
      "path": "reports/jkh-q1-2025.pdf",
      "uploadDate": "2025-01-30"
    },
    {
      "fileText": "Q4 2024 Results",
      "path": "reports/jkh-q4-2024.pdf",
      "uploadDate": "2024-10-31"
    }
  ],
  "infoAnnualData": [
    {
      "fileText": "Annual Report 2024",
      "path": "reports/jkh-annual-2024.pdf",
      "uploadDate": "2024-12-15"
    }
  ]
}
```

**Full URL**: `https://cdn.cse.lk/{path}`

**Document Types**:

- Quarterly financial statements
- Annual reports
- Corporate governance reports
- All in PDF format

---

### 12. `getNonComplianceAnnouncements`

**Category**: Deep Research  
**Method**: POST  
**Params**: None  
**MCP Tool**: `get_noncompliance_list`

**Description**: Companies under CSE watch list or enforcement action.

**Response Structure**:

```json
{
  "nonComplianceAnnouncements": [
    {
      "id": 1,
      "company": "PROBLEM_CORP.N0000",
      "issue": "Failure to file financial statements",
      "dateIssued": "2025-01-10",
      "status": "ACTIVE"
    },
    {
      "id": 2,
      "company": "RISKY_CORP.N0000",
      "issue": "Accounting irregularities",
      "dateIssued": "2024-12-15",
      "status": "UNDER_REVIEW"
    }
  ]
}
```

**Use This For**:

- Due diligence screening
- Risk assessment
- Avoiding problematic investments
- Understanding CSE enforcement

---

## 🔄 Data Types & Conversions

### Numbers

**Issue**: API returns numbers as strings with commas  
**Example**: `"425.50"` or `"1,250,000"`  
**Solution**: Parse and remove commas

```javascript
parseFloat("425.50".replace(/,/g, "")); // → 425.50
parseFloat("1,250,000".replace(/,/g, "")); // → 1250000
```

### Dates

**Format**: `YYYY-MM-DD` (ISO 8601)  
**Example**: `"2026-01-16"`

### Times

**Format**: `HH:MM:SS` (24-hour)  
**Example**: `"15:30:45"`

### Volumes

**Unit**: Number of shares  
**Example**: `"125000"` = 125,000 shares

---

## ⚠️ API Quirks & Gotchas

1. **Symbol vs ID**

   - Endpoints vary between requiring symbol (e.g., JKH.N0000) or ID (e.g., 138)
   - Always use `tradeSummary` first to build mapping

2. **String Numbers**

   - Price/volume fields are strings with commas
   - Must parse before calculations

3. **Typos in Response**

   - `dailyMarketSummery` (missing 's')
   - `reqTradeSummery` (should be "Summary")
   - Property names inconsistent across endpoints

4. **Missing Data**

   - Some fields may be null/empty
   - Always check before using

5. **Rate Limiting**

   - No published limits, but be respectful
   - Use caching (30s default)

6. **Market Hours**
   - Check `marketStatus` before queries
   - After hours: limited or no data

---

## 🚀 Workflow Examples

### Get Price of a Stock

```
1. Call tradeSummary
2. Find symbol "JKH.N0000" in response
3. Get its ID: 138
4. Call todaySharePrice with symbol=JKH.N0000
5. Parse response, sanitize prices
```

### Get Order Book

```
1. Call tradeSummary (if not cached)
2. Get stockId from symbol
3. Call orderBook with stockId=138
4. Parse bids/asks
5. Analyze market pressure
```

### Get Historical Data

```
1. Call tradeSummary (if not cached)
2. Get stockId from symbol
3. Call companyChartDataByStock with stockId=138&period=5
4. Parse OHLCV data
5. Use for charting
```

---

## 📊 Caching Strategy

**30-second cache** for:

- `tradeSummary` (symbol map)
- `allSectors`
- `dailyMarketSummery`
- `topGainers`

**No cache** for:

- `orderBook` (updates frequently)
- `todaySharePrice` (real-time)
- `detailedTrades` (tick data)
- `companyChartDataByStock` (historical, stable)

---

## 🔒 Security Notes

- API is public (no authentication needed)
- All endpoints use HTTPS
- Rate limiting enforced by CSE
- Respect CSE's Terms of Service
- Don't abuse with excessive requests

---

**Last Updated**: January 16, 2026  
**CSE API Version**: Based on https://www.cse.lk/  
**Status**: Operational ✅
