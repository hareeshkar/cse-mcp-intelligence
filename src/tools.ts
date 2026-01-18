import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "scan_market",
    description:
      "Get list of all stocks trading on CSE with current prices. Can filter by max price for penny stock scanning and minimum volume to exclude dead/illiquid stocks.",
    inputSchema: {
      type: "object",
      properties: {
        maxPrice: {
          type: "number",
          description:
            "Optional: Only return stocks priced below this value (in LKR)",
        },
        minVolume: {
          type: "number",
          description:
            "Optional: Only return stocks with volume above this threshold (filters dead stocks)",
        },
      },
    },
  },
  {
    name: "get_sectors",
    description:
      "Get performance data for all market sectors including change % and turnover.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_market_status",
    description: "Check if market is currently open or closed.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_market_summary",
    description:
      "Get daily market overview including P/E ratio, P/B ratio, foreign flow, turnover.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_top_gainers",
    description: "Get list of top performing stocks (highest % increase).",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of stocks to return (default: 10)",
          default: 10,
        },
      },
    },
  },
  {
    name: "get_top_losers",
    description:
      "Get list of worst performing stocks (highest % decrease). Useful for identifying oversold opportunities or risk screening.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of stocks to return (default: 10)",
          default: 10,
        },
      },
    },
  },
  {
    name: "get_order_book",
    description:
      "Get market depth (bids vs asks) with alpha metrics: pressure index (-1=bearish to +1=bullish) and spread percentage. Shows buy/sell pressure and liquidity.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Stock symbol (e.g., JKH.N0000)",
        },
      },
      required: ["symbol"],
    },
  },
  {
    name: "get_stock_snapshot",
    description:
      "Get real-time data for a stock: open, high, low, last price, volume.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Stock symbol (e.g., DIAL.N0000)",
        },
      },
      required: ["symbol"],
    },
  },
  {
    name: "get_chart_data",
    description: "Get historical OHLCV (candlestick) data for charting.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Stock symbol",
        },
        period: {
          type: "string",
          description: "Time period: 1=Intraday, 2=Weekly, 3=Monthly, 5=Daily",
          enum: ["1", "2", "3", "5"],
          default: "5",
        },
      },
      required: ["symbol"],
    },
  },
  {
    name: "get_detailed_trades",
    description:
      "Get tick-by-tick trade data. Shows every individual transaction.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Optional: Stock symbol to filter trades",
        },
      },
    },
  },
  {
    name: "get_company_profile",
    description: "Get company information: directors, secretaries, registrars.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Stock symbol",
        },
      },
      required: ["symbol"],
    },
  },
  {
    name: "get_financial_reports",
    description: "Get links to quarterly and annual financial reports (PDFs).",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Stock symbol",
        },
      },
      required: ["symbol"],
    },
  },
  {
    name: "get_noncompliance_list",
    description:
      "Get list of companies on watch list or facing enforcement action. AVOID THESE!",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];
