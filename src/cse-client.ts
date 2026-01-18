import axios, { AxiosInstance } from "axios";

interface StockData {
  symbol: string;
  id: string;
  price: number;
  name: string;
  change: number;
  changePercent: number;
  turnover: number;
  volume: number;
}

interface OrderBookData {
  symbol: string;
  totalBids: number;
  totalAsks: number;
  pressureIndex: number; // -1 (Bearish) to +1 (Bullish)
  spreadPercentage: number;
  bids: Array<{ price: number; volume: number }>;
  asks: Array<{ price: number; volume: number }>;
  status: "Active" | "Closed/Unavailable";
}

interface SectorData {
  name: string;
  change: number;
  turnover: number;
}

export class CSEClient {
  private api: AxiosInstance;
  private symbolMap: Map<string, string> = new Map();
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds
  private symbolMapInitialized: boolean = false;

  constructor() {
    this.api = axios.create({
      baseURL: "https://www.cse.lk/api",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Origin: "https://www.cse.lk",
        Referer: "https://www.cse.lk/",
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/plain, */*",
      },
      timeout: 15000, // Increased for slower CSE responses
    });
  }

  /**
   * Utility: Fix CSE's chaotic CDN paths
   * Handles: cmt/cmt/ duplication, missing cmt/, spaces in filenames
   */
  private fixCdnUrl(rawPath: string): string {
    if (!rawPath) return "";

    // Remove leading slashes and whitespace
    let clean = rawPath.trim().replace(/^\/+/, "");

    // Fix double prefix "cmt/cmt/"
    if (clean.startsWith("cmt/cmt/")) {
      clean = clean.substring(4);
    }

    // Ensure single prefix
    if (!clean.startsWith("cmt/")) {
      clean = "cmt/" + clean;
    }

    // URL encode path segments (keeps / but encodes spaces to %20)
    const segments = clean
      .split("/")
      .map((segment) => encodeURIComponent(segment));
    return "https://cdn.cse.lk/" + segments.join("/");
  }

  /**
   * Initialize the symbol map - call this on server startup
   * Eagerly loads all stocks to map symbols to IDs
   * This ensures every symbol lookup is instant and reliable
   */
  async initializeSymbolMap(): Promise<void> {
    if (this.symbolMapInitialized) return;
    try {
      await this.getAllStocks();
      this.symbolMapInitialized = true;
      console.error(
        `✅ Symbol map initialized with ${this.symbolMap.size} symbols`
      );
    } catch (error) {
      console.error("⚠️  Failed to initialize symbol map:", error);
      // Non-fatal - will lazy-load on first use
    }
  }

  /**
   * Get a symbol's internal ID - uses pre-cached map or lazy-loads
   */
  private async getSymbolId(symbol: string): Promise<string> {
    let id = this.symbolMap.get(symbol);

    if (!id) {
      // Symbol not in map - refresh the entire map
      await this.getAllStocks();
      id = this.symbolMap.get(symbol);

      if (!id) {
        throw new Error(`Symbol ${symbol} not found on CSE`);
      }
    }

    return id;
  }

  /**
   * Utility: Sanitize price strings (removes commas)
   */
  private sanitizePrice(value: any): number {
    if (typeof value === "number") return value;
    if (!value) return 0;
    return parseFloat(String(value).replace(/,/g, "")) || 0;
  }

  /**
   * Utility: Check cache validity
   */
  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  /**
   * Utility: Set cache
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * ATOMIC TOOL 1: Get all stocks (tradeSummary)
   */
  async getAllStocks(): Promise<StockData[]> {
    const cacheKey = "all_stocks";
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.api.post("tradeSummary");
      const data = response.data;

      // Handle the "Summery" typo
      const stockList = data.reqTradeSummery || [];

      const stocks: StockData[] = stockList.map((stock: any) => {
        const symbol = stock.symbol;
        const id = String(stock.id);

        // Build symbol-to-ID map
        this.symbolMap.set(symbol, id);

        return {
          symbol,
          id,
          price: this.sanitizePrice(stock.price || stock.lastTradedPrice),
          name: stock.name || stock.companyName || symbol,
          change: this.sanitizePrice(stock.change),
          changePercent: this.sanitizePrice(stock.percentageChange),
          turnover: this.sanitizePrice(stock.turnover),
          volume: this.sanitizePrice(stock.sharevolume || stock.volume),
        };
      });

      this.setCache(cacheKey, stocks);
      return stocks;
    } catch (error) {
      console.error("Error fetching stocks:", error);
      throw new Error(
        `Market scan failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * ATOMIC TOOL 2: Get all sectors (allSectors)
   */
  async getAllSectors(): Promise<SectorData[]> {
    const cacheKey = "all_sectors";
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.api.post("allSectors");
      const sectors = response.data.map((sector: any) => ({
        name: sector.sector || sector.name,
        change: this.sanitizePrice(sector.change),
        turnover: this.sanitizePrice(sector.turnover),
      }));

      this.setCache(cacheKey, sectors);
      return sectors;
    } catch (error) {
      console.error("⚠️  Sector data unavailable:", error);
      // Return empty array
      return [];
    }
  }

  /**
   * ATOMIC TOOL 3: Get market status
   */
  async getMarketStatus(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.api.post("marketStatus");
      return {
        status: response.data.status || "Unknown",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("⚠️  Market status unavailable:", error);
      // Return unknown status
      return {
        status: "Unknown",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * ATOMIC TOOL 4: Get daily market summary
   */
  async getMarketSummary(): Promise<any> {
    const cacheKey = "market_summary";
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.api.post("dailyMarketSummery"); // Note: typo preserved
      const data = response.data;

      const summary = {
        marketPE: this.sanitizePrice(data.marketPE),
        marketPB: this.sanitizePrice(data.marketPB),
        netForeignFlow: this.sanitizePrice(data.netForeignFlow),
        totalTurnover: this.sanitizePrice(data.totalTurnover),
        totalVolume: data.totalVolume || 0,
        timestamp: new Date().toISOString(),
      };

      this.setCache(cacheKey, summary);
      return summary;
    } catch (error) {
      console.error("⚠️  Market summary unavailable:", error);
      // Return zero metrics
      return {
        marketPE: 0,
        marketPB: 0,
        netForeignFlow: 0,
        totalTurnover: 0,
        totalVolume: 0,
        timestamp: new Date().toISOString(),
        status: "Unavailable",
      };
    }
  }

  /**
   * ATOMIC TOOL 5: Get top gainers
   */
  async getTopGainers(limit: number = 10): Promise<StockData[]> {
    try {
      const response = await this.api.post("topGainers");
      const gainers = response.data.slice(0, limit).map((stock: any) => ({
        symbol: stock.symbol,
        id: String(stock.id),
        price: this.sanitizePrice(stock.price),
        name: stock.name,
        change: this.sanitizePrice(stock.change),
        volume: stock.volume,
      }));

      return gainers;
    } catch (error) {
      console.error("⚠️  Top gainers unavailable:", error);
      // Return empty array
      return [];
    }
  }

  /**
   * ATOMIC TOOL 5B: Get top losers
   */
  async getTopLosers(limit: number = 10): Promise<StockData[]> {
    try {
      const response = await this.api.post("topLosers");
      const losers = response.data.slice(0, limit).map((stock: any) => ({
        symbol: stock.symbol,
        id: String(stock.id),
        price: this.sanitizePrice(stock.price),
        name: stock.name,
        change: this.sanitizePrice(stock.change),
        volume: stock.volume,
      }));

      return losers;
    } catch (error) {
      console.error("⚠️  Top losers unavailable:", error);
      // Return empty array
      return [];
    }
  }

  /**
   * ATOMIC TOOL 6: Get order book (market depth) with alpha metrics
   */
  async getOrderBook(symbol: string): Promise<OrderBookData> {
    const stockId = await this.getSymbolId(symbol);

    // Use URLSearchParams for safe encoding
    const params = new URLSearchParams();
    params.append("stockId", stockId);

    try {
      const response = await this.api.post("orderBook", params.toString());
      const data = response.data;

      // Handle nested response structure
      const totalBids = this.sanitizePrice(
        data.reqOrderBookTotal?.totalBids || 0
      );
      const totalAsks = this.sanitizePrice(
        data.reqOrderBookTotal?.totalAsks || 0
      );

      // Calculate pressure index: -1 (all sellers) to +1 (all buyers)
      let pressureIndex = 0;
      if (totalBids + totalAsks > 0) {
        pressureIndex = (totalBids - totalAsks) / (totalBids + totalAsks);
      }

      // Extract bid/ask arrays
      const orderBook = data.reqOrderBook || [];
      const bids = orderBook
        .filter((x: any) => x.type === "BID")
        .slice(0, 5)
        .map((x: any) => ({
          price: this.sanitizePrice(x.price),
          volume: this.sanitizePrice(x.quantity),
        }));

      const asks = orderBook
        .filter((x: any) => x.type === "ASK")
        .slice(0, 5)
        .map((x: any) => ({
          price: this.sanitizePrice(x.price),
          volume: this.sanitizePrice(x.quantity),
        }));

      // Calculate spread percentage
      let spreadPercentage = 0;
      if (bids.length > 0 && asks.length > 0) {
        const bestBid = bids[0].price;
        const bestAsk = asks[0].price;
        if (bestBid > 0) {
          spreadPercentage = ((bestAsk - bestBid) / bestBid) * 100;
        }
      }

      return {
        symbol,
        totalBids,
        totalAsks,
        pressureIndex: Number(pressureIndex.toFixed(4)),
        spreadPercentage: Number(spreadPercentage.toFixed(4)),
        bids,
        asks,
        status: "Active",
      };
    } catch (error) {
      console.error(
        `⚠️  Order book unavailable for ${symbol} (likely market closed):`,
        error
      );

      // GRACEFUL FALLBACK: Return zero data to allow analysis to continue
      return {
        symbol,
        totalBids: 0,
        totalAsks: 0,
        pressureIndex: 0,
        spreadPercentage: 0,
        bids: [],
        asks: [],
        status: "Closed/Unavailable",
      };
    }
  }

  /**
   * ATOMIC TOOL 7: Get stock snapshot (todaySharePrice)
   */
  async getStockSnapshot(symbol: string): Promise<any> {
    const params = new URLSearchParams();
    params.append("symbol", symbol);

    try {
      const response = await this.api.post(
        "todaySharePrice",
        params.toString()
      );
      const data = response.data;

      return {
        symbol,
        open: this.sanitizePrice(data.open),
        high: this.sanitizePrice(data.high),
        low: this.sanitizePrice(data.low),
        last: this.sanitizePrice(data.last),
        volume: data.volume || 0,
        crossingVolume: data.crossingVolume || 0,
        change: this.sanitizePrice(data.change),
        changePercent: this.sanitizePrice(data.changePercent),
      };
    } catch (error) {
      console.error(`⚠️  Snapshot unavailable for ${symbol}:`, error);
      // Return minimal data structure
      return {
        symbol,
        open: 0,
        high: 0,
        low: 0,
        last: 0,
        volume: 0,
        crossingVolume: 0,
        change: 0,
        changePercent: 0,
        status: "Unavailable",
      };
    }
  }

  /**
   * ATOMIC TOOL 8: Get chart data (OHLCV)
   */
  async getChartData(
    symbol: string,
    period: "1" | "2" | "3" | "5" = "5"
  ): Promise<any[]> {
    const stockId = await this.getSymbolId(symbol);

    const params = new URLSearchParams();
    params.append("stockId", stockId);
    params.append("period", period);

    try {
      const response = await this.api.post(
        "companyChartDataByStock",
        params.toString()
      );
      const chartData =
        response.data.reqCompanyChartData || response.data || [];

      return chartData.map((candle: any) => ({
        date: candle.date,
        open: this.sanitizePrice(candle.open),
        high: this.sanitizePrice(candle.high),
        low: this.sanitizePrice(candle.low),
        close: this.sanitizePrice(candle.close),
        volume: candle.volume,
      }));
    } catch (error) {
      console.error(`⚠️  Chart data unavailable for ${symbol}:`, error);
      // Return empty array - allows other analysis to continue
      return [];
    }
  }

  /**
   * ATOMIC TOOL 9: Get detailed trades (tick data)
   */
  async getDetailedTrades(symbol?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (symbol) {
      params.append("symbol", symbol);
    }

    try {
      const response = await this.api.post("detailedTrades", params.toString());

      return response.data.map((trade: any) => ({
        symbol: trade.symbol,
        price: this.sanitizePrice(trade.price),
        volume: trade.volume,
        time: trade.time,
        buyer: trade.buyer,
        seller: trade.seller,
      }));
    } catch (error) {
      console.error("⚠️  Trade data unavailable:", error);
      // Return empty array
      return [];
    }
  }

  /**
   * ATOMIC TOOL 10: Get company profile
   */
  async getCompanyProfile(symbol: string): Promise<any> {
    const params = new URLSearchParams();
    params.append("symbol", symbol);

    try {
      const response = await this.api.post("companyProfile", params.toString());
      return response.data;
    } catch (error) {
      console.error(`⚠️  Company profile unavailable for ${symbol}:`, error);
      // Return basic structure
      return {
        symbol,
        name: symbol,
        status: "Unavailable",
      };
    }
  }

  /**
   * ATOMIC TOOL 11: Get financial reports with fixed CDN URLs
   */
  async getFinancialReports(symbol: string): Promise<any[]> {
    const params = new URLSearchParams();
    params.append("symbol", symbol);

    try {
      const response = await this.api.post("financials", params.toString());
      const data = response.data;

      const reports: any[] = [];

      // Process quarterly reports (top 3 most recent)
      if (data.infoQuarterlyData) {
        data.infoQuarterlyData.slice(0, 3).forEach((report: any) => {
          reports.push({
            type: "Quarterly",
            period: report.fileText,
            url: this.fixCdnUrl(report.path),
            uploadDate: report.uploadDate,
          });
        });
      }

      // Process annual reports (top 3 most recent)
      if (data.infoAnnualData) {
        data.infoAnnualData.slice(0, 3).forEach((report: any) => {
          reports.push({
            type: "Annual",
            period: report.fileText,
            url: this.fixCdnUrl(report.path),
            uploadDate: report.uploadDate,
          });
        });
      }

      return reports;
    } catch (error) {
      console.error(`⚠️  Financial reports unavailable for ${symbol}:`, error);
      // Return empty array - may be no reports filed
      return [];
    }
  }

  /**
   * ATOMIC TOOL 12: Get non-compliance announcements
   */
  async getNonComplianceList(): Promise<string[]> {
    try {
      const response = await this.api.post("getNonComplianceAnnouncements");
      const announcements = response.data.nonComplianceAnnouncements || [];

      // Extract unique company symbols
      const companies = new Set<string>();
      for (const item of announcements) {
        if (item.company) companies.add(item.company);
      }

      return Array.from(companies);
    } catch (error) {
      console.error("⚠️  Non-compliance list unavailable:", error);
      // Return empty array - assume all clean if data unavailable
      return [];
    }
  }
}
