#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { CSEClient } from "./cse-client.js";
import { tools } from "./tools.js";

// Initialize CSE API client
const cseClient = new CSEClient();

// Create MCP server
const server = new Server(
  {
    name: "cse-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler: List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

/**
 * Handler: Execute tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "scan_market": {
        const stocks = await cseClient.getAllStocks();
        const maxPrice = args?.maxPrice as number | undefined;
        const minVolume = args?.minVolume as number | undefined;

        let filtered = stocks;

        // Filter 1: Remove dead stocks by volume
        if (minVolume !== undefined && minVolume > 0) {
          filtered = filtered.filter((s) => s.volume >= minVolume);
        }

        // Filter 2: Price filter for penny stocks
        if (maxPrice !== undefined) {
          filtered = filtered.filter((s) => s.price <= maxPrice);
        }

        // Sort by turnover (most liquid first)
        filtered.sort((a, b) => b.turnover - a.turnover);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(filtered, null, 2),
            },
          ],
        };
      }

      case "get_sectors": {
        const sectors = await cseClient.getAllSectors();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(sectors, null, 2),
            },
          ],
        };
      }

      case "get_market_status": {
        const status = await cseClient.getMarketStatus();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(status, null, 2),
            },
          ],
        };
      }

      case "get_market_summary": {
        const summary = await cseClient.getMarketSummary();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      }

      case "get_top_gainers": {
        const limit = (args?.limit as number) || 10;
        const gainers = await cseClient.getTopGainers(limit);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(gainers, null, 2),
            },
          ],
        };
      }

      case "get_top_losers": {
        const limit = (args?.limit as number) || 10;
        const losers = await cseClient.getTopLosers(limit);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(losers, null, 2),
            },
          ],
        };
      }

      case "get_order_book": {
        const symbol = args?.symbol as string;
        if (!symbol) throw new Error("Symbol required");

        const orderBook = await cseClient.getOrderBook(symbol);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(orderBook, null, 2),
            },
          ],
        };
      }

      case "get_stock_snapshot": {
        const symbol = args?.symbol as string;
        if (!symbol) throw new Error("Symbol required");

        const snapshot = await cseClient.getStockSnapshot(symbol);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(snapshot, null, 2),
            },
          ],
        };
      }

      case "get_chart_data": {
        const symbol = args?.symbol as string;
        const period = (args?.period as "1" | "2" | "3" | "5") || "5";
        if (!symbol) throw new Error("Symbol required");

        const chartData = await cseClient.getChartData(symbol, period);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(chartData, null, 2),
            },
          ],
        };
      }

      case "get_detailed_trades": {
        const symbol = args?.symbol as string | undefined;
        const trades = await cseClient.getDetailedTrades(symbol);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(trades, null, 2),
            },
          ],
        };
      }

      case "get_company_profile": {
        const symbol = args?.symbol as string;
        if (!symbol) throw new Error("Symbol required");

        const profile = await cseClient.getCompanyProfile(symbol);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(profile, null, 2),
            },
          ],
        };
      }

      case "get_financial_reports": {
        const symbol = args?.symbol as string;
        if (!symbol) throw new Error("Symbol required");

        const reports = await cseClient.getFinancialReports(symbol);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(reports, null, 2),
            },
          ],
        };
      }

      case "get_noncompliance_list": {
        const toxic = await cseClient.getNonComplianceList();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ toxic_companies: toxic }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: errorMessage }),
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CSE MCP Server running on stdio");

  // Warm up the symbol map in background - improves first API call responsiveness
  cseClient.initializeSymbolMap().catch((error) => {
    console.error(
      "⚠️  Warning: Symbol map initialization failed - will lazy-load:",
      error
    );
  });
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
