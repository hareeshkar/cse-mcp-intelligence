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
Get all stocks trading on the Colombo Stock Exchange.

**Parameters:**
- `maxPrice` (optional) - Filter for penny stocks below this price
- `minVolume` (optional) - Filter for stocks with minimum trading volume

**Returns:** Symbol, current price, change %, trading volume

#### `get_sectors`
Performance data for all market sectors.

**Returns:** Sector name, change %, turnover, market cap

#### `get_market_status`
Check if market is currently open or closed.

**Returns:** Market status, timestamp, trading hours

### Stock Analysis

#### `get_stock_detail`
Detailed information about a specific stock.

**Parameters:**
- `symbol` (required) - Stock symbol (e.g., "SLTL", "ASPI")

**Returns:** Company profile, price, performance, financial metrics

#### `get_stock_trades`
Recent trade history for a stock.

**Parameters:**
- `symbol` (required) - Stock symbol
- `limit` (optional) - Number of recent trades (default: 20)

**Returns:** Trade timestamps, prices, volumes

#### `get_order_book`
Market depth and order flow pressure analysis.

**Parameters:**
- `symbol` (required) - Stock symbol

**Returns:** Bid/ask levels, volumes, pressure indicators

### Technical Analysis

#### `get_candlesticks`
OHLC data for technical analysis.

**Parameters:**
- `symbol` (required) - Stock symbol
- `period` (optional) - Time period (default: "1d")

**Returns:** Candlestick data with volume

## 💡 Example Usage with Claude

1. **Market Scan:** "Scan for all penny stocks under Rs. 50 with high volume"
2. **Sector Analysis:** "Which sectors are performing best today?"
3. **Stock Deep Dive:** "Give me a full analysis of SLTL including technical indicators"
4. **Trading Pressure:** "What's the order flow pressure on ASPI right now?"

## 📚 Project Structure

```
cse-mcp-intelligence/
├── src/
│   ├── index.ts           # MCP server entry point
│   ├── cse-client.ts      # CSE API client
│   └── tools.ts           # Tool definitions & handlers
├── build/                 # Compiled JavaScript output
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## 🔌 API Reference

The server uses the official Colombo Stock Exchange API:
- Base URL: `https://api.cse.lk`
- Real-time data updates every 5-10 seconds
- Rate limits: Generous for institutional usage

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
