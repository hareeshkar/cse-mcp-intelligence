# ⚡ Quick Start Guide

## 🎯 In 5 Minutes: Get CSE MCP Running

### 1. **Verify Node.js Installed**

```bash
node --version  # Should show v18+
npm --version   # Should show v9+
```

### 2. **Build the Project** (Already Done ✅)

```bash
cd /Users/hareeshkarravi/Desktop/cse_mcp
npm run build
```

### 3. **Get Your Full Path**

```bash
pwd  # Copy the output: /Users/hareeshkarravi/Desktop/cse_mcp
```

### 4. **Configure Claude Desktop**

**macOS:**

1. Press `Cmd + Space` → Type "Finder" → Click Applications
2. Find "Claude" → Right-click → "Open"
3. In menu bar: "Claude" → "Preferences"
4. Scroll to "MCP Servers"
5. Click "Add Server"
6. Name: `cse`
7. Command: `node`
8. Args: `/Users/hareeshkarravi/Desktop/cse_mcp/build/index.js`
9. Click "Save"

**Or manually edit the config file:**

```bash
# Open config editor
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Add to the file:**

```json
{
  "mcpServers": {
    "cse": {
      "command": "node",
      "args": ["/Users/hareeshkarravi/Desktop/cse_mcp/build/index.js"]
    }
  }
}
```

### 5. **Restart Claude Desktop**

- Close it completely (Cmd+Q)
- Wait 5 seconds
- Reopen Claude

### 6. **Test It!**

In Claude, type:

```
What are the top 5 gainers on CSE today?
```

You should get **real live data** in seconds! 🎉

---

## ✅ Verify It's Working

Look for these signs that the MCP is connected:

1. **In Claude's toolbar** → You should see a small "gear" icon
2. **MCP connection indicator** → Should show "cse" is connected
3. **First response** → May take 2-3 seconds (warming up symbol map)
4. **Second response** → Should be instant <1 second (cached)

---

## 🆘 Troubleshooting

### "Tool not found" error

- [ ] Check config file path is correct
- [ ] Restart Claude completely (not just refresh)
- [ ] Check Node.js path: `which node`

### "Connection refused"

- [ ] Verify build exists: `ls /Users/hareeshkarravi/Desktop/cse_mcp/build/index.js`
- [ ] Rebuild: `npm run build`
- [ ] Restart Claude

### "timeout waiting for response"

- [ ] First call takes 2-3 seconds (normal, warming up)
- [ ] CSE API may be temporarily down
- [ ] Check internet connection

---

## 🚀 Example Queries

Try these in Claude:

### Market Overview

- "Show me all stocks trading today"
- "What's the market P/E ratio?"
- "Which sectors are performing best?"

### Stock Specific

- "What's the current price of JKH.N0000?"
- "Show me the order book for DIALOG"
- "Get the top 10 gainers"

### Analysis

- "Find all penny stocks under 5 LKR"
- "Get financial reports for SOFTLYON"
- "Which companies are on the non-compliance watch list?"

---

## 📂 File Locations

| File        | Location                                                          | Purpose                |
| ----------- | ----------------------------------------------------------------- | ---------------------- |
| Main server | `build/index.js`                                                  | Runs the MCP server    |
| Symbol map  | Cache (memory)                                                    | 280+ stock→ID mappings |
| Config      | `~/Library/Application Support/Claude/claude_desktop_config.json` | Tells Claude about MCP |
| Logs        | Claude's dev console                                              | Error messages         |

---

## 🔄 Development Workflow

**If you edit source code:**

```bash
npm run build           # Recompile
# Then restart Claude
```

**For faster development:**

```bash
npm run dev            # Runs with hot-reload (tsx)
```

---

## 📊 Performance Timeline

| Event           | Time       | Notes                     |
| --------------- | ---------- | ------------------------- |
| Server start    | ~100ms     | Node startup              |
| Symbol map init | 200-500ms  | Background (non-blocking) |
| First API call  | 500-2000ms | Network + processing      |
| Cached response | <5ms       | Instant (30s cache)       |

---

## ✨ Next Steps

Once it's working:

1. **Test all 12 tools** - Try different queries
2. **Check symbol mapping** - Ask about specific stocks
3. **Note response times** - First call vs cached calls
4. **Read IMPLEMENTATION_SUMMARY.md** - Full technical details

---

## 🎓 What's Happening Behind the Scenes

```
You type in Claude
    ↓
Claude sends text to MCP server
    ↓
MCP identifies which tool to use
    ↓
Tool makes API call to CSE (https://cse.lk/api)
    ↓
CSE returns JSON data
    ↓
MCP formats response
    ↓
Claude displays answer to you ✅
```

---

## 💡 Key Features

- ✅ **Real-time data** - Live CSE market information
- ✅ **Smart caching** - 30-second cache reduces API calls
- ✅ **Fast symbol lookup** - Pre-cached symbol→ID mapping
- ✅ **Error handling** - Graceful fallbacks
- ✅ **Type-safe** - TypeScript prevents bugs
- ✅ **12 tools** - Complete market coverage

---

## 🆘 Still Having Issues?

**Check the most common problem:**

```bash
# Verify build was successful
ls -la /Users/hareeshkarravi/Desktop/cse_mcp/build/index.js

# Should output something like:
# -rw-r--r-- cse_mcp staff 7502 Jan 16 19:33 index.js

# If it doesn't exist, rebuild:
npm run build
```

**Check Node can run the server:**

```bash
node /Users/hareeshkarravi/Desktop/cse_mcp/build/index.js
# Should print: "CSE MCP Server running on stdio"
# Press Ctrl+C to stop
```

---

**Ready to go!** Start using CSE data in Claude immediately! 🚀
