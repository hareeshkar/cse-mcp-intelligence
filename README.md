# CSE MCP Intelligence

**Institutional-grade MCP server for the Colombo Stock Exchange.** Features real-time market data, order flow pressure analysis, and AI-powered forensic fundamental screening.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
![MCP](https://img.shields.io/badge/MCP-0.7+-blue)

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/hareeshkar/cse-mcp-intelligence.git
cd cse-mcp-intelligence

# Install dependencies
npm install

# Build
npm run build

# Run with Claude
npm start
```

## 📋 What is MCP?

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) enables Claude and other AI models to access external data sources and APIs in real-time. Instead of relying on static training data, Claude can now fetch live market information from the CSE API.

## ✨ Features

- **Real-time Market Data** - Current stock prices, market status, and daily summaries
- **Sector Analysis** - Track performance across all market sectors with detailed metrics
- **Stock Intelligence** - Company profiles, financial reports, and compliance information
- **Order Flow Analysis** - Market depth, trading pressure indicators, and volume analysis
- **Historical Data** - Candlestick charts and detailed trade history for technical analysis
- **Smart Caching** - 30-second cache to optimize API usage and reduce latency

## 🔧 Installation

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Claude Desktop** (for integration)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hareeshkar/cse-mcp-intelligence.git
   cd cse-mcp-intelligence
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the TypeScript source:**
   ```bash
   npm run build
   ```

## ⚙️ Claude Desktop Configuration

## ⚙️ Claude Desktop Configuration

### macOS/Linux

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "cse": {
      "command": "node",
      "args": ["/full/path/to/cse-mcp-intelligence/build/index.js"]
    }
  }
}
```

### Windows

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "cse": {
      "command": "node",
      "args": ["C:\\full\\path\\to\\cse-mcp-intelligence\\build\\index.js"]
    }
  }
}
```

**⚠️ Important:** Replace the path with your actual project location.

### Restart Claude Desktop

After updating the config, **completely close and reopen Claude Desktop** for the changes to take effect.

## 🛠 Available Tools

### Market Overview

#### `scan_market`
Get all stocks trading on the Colombo Stock Exchange with filtering capabilities.

**Parameters:**
- `maxPrice` (number, optional) - Filter for penny stocks below this price in LKR
- `minVolume` (number, optional) - Only show stocks with volume above threshold (filters illiquid stocks)

**Returns:** Array of stocks with symbol, name, current price, change %, and volume

**Use Cases:**
- Penny stock hunting: `scan_market { maxPrice: 50 }`
- Active stocks only: `scan_market { minVolume: 100000 }`

#### `get_sectors`
Performance data for all CSE market sectors.

**Returns:** Sector names with change %, turnover, market capitalization

**Use Cases:**
- Sector rotation analysis
- Finding the strongest/weakest sectors
- Portfolio diversification checks

#### `get_market_status`
Real-time market status - check if trading is active.

**Returns:** Open/Closed status, current timestamp, trading hours

#### `get_market_summary`
Comprehensive daily market overview with macro indicators.

**Returns:** P/E ratio, P/B ratio, foreign investor flow, total turnover, market mood

### Stock Performance

#### `get_top_gainers`
Stocks with highest percentage gains today.

**Parameters:**
- `limit` (number, optional, default: 10) - How many top performers to show

**Returns:** Top performers with price action and volume data

#### `get_top_losers`
Stocks with highest percentage losses today.

**Parameters:**
- `limit` (number, optional, default: 10) - How many bottom performers to show

**Returns:** Oversold stocks useful for contrarian or risk assessment

### Stock Analysis

#### `get_stock_detail`
Complete detailed information about a specific stock.

**Parameters:**
- `symbol` (required) - Stock symbol (e.g., "SLTL", "ASPI", "LAUGF")

**Returns:** Company profile, current price, P/E ratio, dividends, 52-week high/low, trading stats

**Use Cases:**
- Fundamental analysis
- Company profile research
- Valuation metrics

#### `get_stock_trades`
Recent trade history for order flow analysis.

**Parameters:**
- `symbol` (required) - Stock symbol
- `limit` (optional, default: 20) - Number of recent trades

**Returns:** Timestamps, executed prices, volumes, trade direction (buy/sell)

**Use Cases:**
- Order flow forensics
- Volume profile analysis
- Institutional buying/selling detection

#### `get_order_book`
Live market depth with order flow pressure analysis.

**Parameters:**
- `symbol` (required) - Stock symbol

**Returns:** 
- Bid/ask levels with volumes
- Pressure index (-1 = extreme bearish, +1 = extreme bullish)
- Bid-ask spread percentage
- Market depth profile

**Use Cases:**
- Pre-trade liquidity analysis
- Support/resistance levels
- Institutional accumulation/distribution detection

### Technical Analysis

#### `get_candlesticks`
OHLC (Open, High, Low, Close) data for technical analysis.

**Parameters:**
- `symbol` (required) - Stock symbol
- `period` (optional, default: "1d") - Time period ("1d", "1w", "1m")

**Returns:** Candlestick data with open, high, low, close prices and volume

**Use Cases:**
- Technical pattern recognition
- Trend analysis
- Support/resistance identification
- Volume profile

## 💡 Real-World Usage Examples

### Penny Stock Screening
```
Query: "Find all penny stocks under Rs. 50 with high trading volume"
Tool: scan_market { maxPrice: 50, minVolume: 500000 }
→ Get list of actively traded penny stocks for swing trading
```

### Sector Rotation Strategy
```
Query: "Which sectors are outperforming today? Show me the leaders."
Tool: get_sectors
→ Identify hot sectors and potential rotation candidates
```

### Pre-Trade Liquidity Check
```
Query: "Can I buy 10,000 shares of SLTL without moving the price too much?"
Tool: get_order_book { symbol: "SLTL" }
→ Check bid-ask spread, depth, and available liquidity
```

### Order Flow Forensics
```
Query: "Show me the last 50 trades on ASPI - is it institutional buying or selling?"
Tool: get_stock_trades { symbol: "ASPI", limit: 50 }
→ Analyze trade timing and sizes to identify smart money activity
```

### Technical Setup Confirmation
```
Query: "Show SLTL candlesticks and confirm the resistance breakout"
Tool: get_candlesticks { symbol: "SLTL", period: "1d" }
→ Get OHLC data for pattern recognition and trend analysis
```

### Market Stress Test
```
Query: "What percentage of stocks are down today? Any panic selling?"
Tool: get_top_losers { limit: 20 }
→ Identify oversold conditions and panic-driven opportunities
```

## 🏗️ Technical Architecture

### Core Components

#### **1. CSE API Client** ([src/cse-client.ts](src/cse-client.ts))
- **Purpose**: Direct wrapper around the Colombo Stock Exchange REST API
- **Features**:
  - Smart caching (30-second TTL) to reduce API load and improve responsiveness
  - Symbol mapping (Display Name ↔ API Symbol translation)
  - CDN URL fixing for company reports and documents
  - Error resilience with graceful fallbacks
  - Automatic retry logic with exponential backoff
  
- **Key Methods**:
  - `getAllStocks()` - Market scan
  - `getStockDetail(symbol)` - Detailed fundamental data
  - `getOrderBook(symbol)` - Real-time market depth
  - `getTradeHistory(symbol, limit)` - Order flow analysis
  - `getCandlesticks(symbol, period)` - Technical data

#### **2. Tool Definitions & Handlers** ([src/tools.ts](src/tools.ts))
- **Purpose**: Define all MCP tools available to Claude with proper schemas
- **Includes**:
  - Tool name, description, parameter schema
  - Input validation using JSON Schema
  - Type definitions for type safety
  
- **8+ Tools**:
  - `scan_market` - Market scanning with filters
  - `get_sectors` - Sector performance
  - `get_market_status` - Trading status
  - `get_market_summary` - Macro indicators
  - `get_top_gainers` / `get_top_losers` - Performance leaders/laggards
  - `get_stock_detail` - Fundamental analysis
  - `get_stock_trades` - Trade history/order flow
  - `get_order_book` - Market depth
  - `get_candlesticks` - Technical analysis

#### **3. MCP Server** ([src/index.ts](src/index.ts))
- **Purpose**: Entry point that bridges CSE API and Claude
- **Responsibilities**:
  - Listens to Claude's tool requests via stdio
  - Routes requests to appropriate CSE client methods
  - Handles request/response serialization
  - Error handling and user-friendly error messages
  - Request parameter validation

### Data Flow

```
Claude Desktop
    ↓
[MCP Server] ← Claude makes tool request (JSON-RPC)
    ↓
[Tool Router] ← Validates parameters
    ↓
[CSE Client] ← Fetches data from API
    ↓
Colombo Stock Exchange API
    ↓
[Cache Layer] ← 30-second cache for same requests
    ↓
[Response Formatter] ← Cleans and structures data
    ↓
Claude ← Gets structured market data for analysis
```

### Caching Strategy

The system implements **smart caching** to optimize performance:
- **TTL**: 30 seconds (market data doesn't change faster)
- **Cache Key**: Tool name + parameters hash
- **Benefits**: 
  - Reduces API calls during multi-tool analysis
  - Faster Claude response times
  - Respects CSE rate limits
  - Can handle 1,000+ requests/minute internally

### Error Handling & Fallbacks

- **API Timeouts** → Cached data (if available) or graceful error
- **Invalid Symbol** → Fuzzy matching suggestions
- **Market Closed** → Return last known data with status
- **Network Errors** → Retry up to 3 times with exponential backoff
- **Rate Limiting** → Queue and delay requests intelligently

### CSE API Integration Points

The server connects to these CSE API endpoints:
- `/v1/stocks` - All stocks with live prices
- `/v1/stocks/{id}` - Stock detail & fundamentals
- `/v1/stocks/{id}/orderbook` - Market depth
- `/v1/stocks/{id}/trades` - Trade history  
- `/v1/sectors` - Sector performance
- `/v1/market` - Overall market status

## 📝 Scripts

```bash
npm run build    # Compile TypeScript to JavaScript
npm start        # Run the MCP server
npm run dev      # Run in development mode with hot reload
```

## 🐛 Troubleshooting

### Claude doesn't recognize the server
- Verify the path in `claude_desktop_config.json` is correct and absolute
- Make sure you've run `npm run build`
- Restart Claude Desktop completely (not just minimize)

### API Connection Issues
- Check that you have internet connectivity
- Verify the CSE API is accessible: `curl https://api.cse.lk/api/v1/market`
- Check rate limiting if getting 429 errors

### Build Errors
- Delete `build/` and `node_modules/` folders
- Run `npm install` and `npm run build` again
- Ensure Node.js 18+ is installed

## 📖 Documentation

- [API Reference](API_REFERENCE.md) - Detailed tool specifications
- [Implementation Guide](IMPLEMENTATION_SUMMARY.md) - Technical architecture
- [Changelog](CHANGELOG.md) - Version history
- [Graceful Fallbacks](GRACEFUL_FALLBACKS.md) - Error handling strategies

## 🤝 Contributing

This project is open to contributions! Areas for enhancement:
- Additional technical indicators
- Portfolio tracking features
- Alert systems
- WebSocket support for real-time updates

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

**Hareesh Karravi** - [@hareeshkar](https://github.com/hareeshkar)

## 🔗 Links

- [Colombo Stock Exchange](https://www.cse.lk)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude AI](https://claude.ai)

---

**Questions?** Open an issue on GitHub or check the documentation files.

4. **get_market_summary** - Daily market overview
   - Returns: P/E ratio, P/B ratio, foreign flow, total turnover

### Stock-Specific Data

5. **get_stock_snapshot** - Real-time price data

   - Input: Stock symbol
   - Returns: Open, high, low, last price, volume, change %

6. **get_top_gainers** - Top performing stocks

   - Optional: Limit (default 10)
   - Returns: Symbol, price, % change

7. **get_order_book** - Market depth for a stock

   - Input: Stock symbol
   - Returns: Bids/asks, volumes, market pressure

8. **get_chart_data** - Historical OHLCV data
   - Input: Symbol, period (1=Intraday, 2=Weekly, 3=Monthly, 5=Daily)
   - Returns: Open, high, low, close, volume with dates

### Deep Research

9. **get_detailed_trades** - Tick-by-tick trade data

   - Optional: Filter by symbol
   - Returns: Price, volume, time, buyer/seller

10. **get_company_profile** - Company information

    - Input: Stock symbol
    - Returns: Directors, secretaries, registrars, company details

11. **get_financial_reports** - Company reports

    - Input: Stock symbol
    - Returns: Links to quarterly and annual reports (PDFs)

12. **get_noncompliance_list** - At-risk companies
    - Returns: Companies on watch list or under enforcement action
    - ⚠️ Use for due diligence - avoid investing in these companies

## Usage Examples

### In Claude Desktop

Ask questions naturally:

```
"What are the top 5 gainers on CSE today?"
```

```
"Show me the current price and order book for JKH.N0000"
```

```
"Which stocks are trading under 10 LKR?"
```

```
"Get the financial reports for DIALOG.N0000"
```

```
"What's the market P/E ratio and which sectors are performing best?"
```

```
"List all companies currently on the non-compliance watch list"
```

## Development

### Local Testing

Run the development server:

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
cse-mcp-server/
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── cse-client.ts     # CSE API wrapper (12 atomic tools)
│   └── tools.ts          # Tool definitions for Claude
├── build/                # Compiled JavaScript (auto-generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env.example          # Environment template
└── README.md             # This file
```

## API Details

### Base URL

`https://www.cse.lk/api`

### Features

- **Error Handling**: Graceful fallback when API unavailable
- **Caching**: 30-second TTL reduces API calls
- **Symbol Resolution**: Auto-builds symbol-to-ID mapping
- **Data Sanitization**: Removes commas from prices, handles null values

### Rate Limiting

The CSE API does not publicly advertise rate limits, but best practice suggests:

- Keep API calls under 10 requests per second
- Use caching to minimize redundant requests

## Troubleshooting

### Server won't start

```bash
# Check Node.js version
node --version  # Should be v18+

# Check if port 3000 is available
# Or rebuild everything
rm -rf build/ node_modules/
npm install
npm run build
```

### Claude can't find the tools

1. Check the file path in `claude_desktop_config.json` is correct
2. Ensure the build directory exists: `npm run build`
3. Restart Claude Desktop completely
4. Check Claude's error console for details

### API returns empty data

- CSE market may be closed (closed outside market hours)
- Symbol may be incorrect (check exact symbol format)
- Try `scan_market` to get list of valid symbols

### Performance issues

- Data is cached for 30 seconds - avoid rapid repeated calls
- The CSE API may have rate limits we're not aware of
- Try spreading requests over time

## Disclaimer

This tool provides educational access to public CSE data. Always conduct your own due diligence before making investment decisions. The authors are not responsible for any financial losses.

## License

MIT

## Author

Created for CSE market research and analysis

## Support

For issues, feature requests, or improvements:

1. Check that you're running the latest version
2. Review the troubleshooting section
3. Ensure Node.js and npm are up to date

## Roadmap (Future Phases)

- Phase 2: Historical data analysis, sector comparison
- Phase 3: Portfolio tracking, alerts on price changes
- Phase 4: Technical indicators, moving averages
- Phase 5: Machine learning predictions
