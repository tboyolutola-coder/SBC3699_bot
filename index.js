const { Telegraf } = require('telegraf');

// Railway will provide the Port, and we pull the Bot Token from environment variables
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("Error: BOT_TOKEN environment variable is missing!");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Welcome message when someone starts the bot
bot.start((ctx) => {
  ctx.reply(
    "👋 Welcome! Send me any text, and I will instantly analyze its character and word counts for you."
  );
});

// Listen for any text message
bot.on('text', (ctx) => {
  const text = ctx.message.text;

  // Calculate counts
  const charWithSpaces = text.length;
  const charWithoutSpaces = text.replace(/\s+/g, '').length;
  
  // Split by spaces to count words, filtering out empty strings
  const wordsArray = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = wordsArray.length;

  // Simple sentence count based on periods, exclamation marks, or question marks
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  // Build the reply layout
  const response = 
`📊 **Text Analysis:**

▪️ **Characters (with spaces):** ${charWithSpaces}
▪️ **Characters (no spaces):** ${charWithoutSpaces}
▪️ **Word Count:** ${wordCount}
▪️ **Sentences:** ${sentenceCount}`;

  ctx.replyWithMarkdown(response);
});

// Launch the bot using long-polling for simplicity
bot.launch().then(() => {
  console.log("Bot is successfully running...");
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
