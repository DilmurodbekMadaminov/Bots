import express from 'express';
import { Bot, InlineKeyboard, Keyboard, webhookCallback } from 'grammy';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const API_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_HOST = process.env.APP_URL; // AI Studio sets this automatically

if (!API_TOKEN) {
  console.error("BOT_TOKEN topilmadi! .env faylni tekshiring.");
  process.exit(1);
}

if (!WEBHOOK_HOST) {
  console.error("APP_URL topilmadi! AI Studio muhitida bu avtomatik beriladi.");
  process.exit(1);
}

const ADMIN_ID = 7858117466;
const CHANNEL_ID = "@Xorazm_ish_bozor1";

// Initialize Database
const db = new Database('bot_database.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    hdp INTEGER DEFAULT 0,
    omon INTEGER DEFAULT 0
  )
`);

const addUser = db.prepare('INSERT OR IGNORE INTO users (user_id) VALUES (?)');
const incrementHdp = db.prepare('UPDATE users SET hdp = hdp + 1 WHERE user_id = ?');
const incrementOmon = db.prepare('UPDATE users SET omon = omon + 1 WHERE user_id = ?');
const getStats = db.prepare('SELECT COUNT(*) as count, SUM(hdp) as hdp, SUM(omon) as omon FROM users');

// Initialize Bot
const bot = new Bot(API_TOKEN);

// Keyboards
const getSubKeyboard = () => {
  return new InlineKeyboard()
    .url("Obuna bo'lish", "https://t.me/Xorazm_ish_bozor1").row()
    .text("Tekshirish", "check_sub");
};

const getMainKeyboard = () => {
  return new Keyboard()
    .text("HDP LC").text("Omon School")
    .resized();
};

// Helper: Check subscription
async function isSubscribed(userId: number) {
  try {
    const member = await bot.api.getChatMember(CHANNEL_ID, userId);
    return ['member', 'administrator', 'creator'].includes(member.status);
  } catch (error) {
    console.error(`Obunani tekshirishda xatolik:`, error);
    return false;
  }
}

// Handlers
bot.command('start', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  
  addUser.run(userId);
  
  if (await isSubscribed(userId)) {
    await ctx.reply("Xush kelibsiz! Kerakli bo'limni tanlang:", {
      reply_markup: getMainKeyboard()
    });
  } else {
    await ctx.reply("Botdan foydalanish uchun kanalimizga obuna bo'ling:", {
      reply_markup: getSubKeyboard()
    });
  }
});

bot.callbackQuery('check_sub', async (ctx) => {
  const userId = ctx.from.id;
  
  if (await isSubscribed(userId)) {
    await ctx.answerCallbackQuery({ text: "Rahmat! Endi botdan foydalanishingiz mumkin." });
    await ctx.reply("Kerakli bo'limni tanlang:", {
      reply_markup: getMainKeyboard()
    });
    try {
      if (ctx.msg) {
        await ctx.api.deleteMessage(ctx.chat?.id || 0, ctx.msg.message_id);
      }
    } catch (e) {
      // Ignore delete errors
    }
  } else {
    await ctx.answerCallbackQuery({ text: "Siz hali obuna bo'lmagansiz!", show_alert: true });
  }
});

bot.hears('HDP LC', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  if (await isSubscribed(userId)) {
    incrementHdp.run(userId);
    await ctx.reply("HDP LC uchun havola: https://forms.gle/f6ZiQtiqCAH1CLy87");
  } else {
    await ctx.reply("Avval kanalga obuna bo'ling!", { reply_markup: { remove_keyboard: true } });
    await ctx.reply("Botdan foydalanish uchun kanalimizga obuna bo'ling:", {
      reply_markup: getSubKeyboard()
    });
  }
});

bot.hears('Omon School', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  if (await isSubscribed(userId)) {
    incrementOmon.run(userId);
    await ctx.reply("Omon School uchun havola: https://forms.gle/97m9hCsBFovYKKrX7");
  } else {
    await ctx.reply("Avval kanalga obuna bo'ling!", { reply_markup: { remove_keyboard: true } });
    await ctx.reply("Botdan foydalanish uchun kanalimizga obuna bo'ling:", {
      reply_markup: getSubKeyboard()
    });
  }
});

bot.command('admin', async (ctx) => {
  const userId = ctx.from?.id;
  if (userId === ADMIN_ID) {
    const stats = getStats.get() as any;
    const text = `📊 *Bot statistikasi*:\n\n👥 Jami foydalanuvchilar: \`${stats.count || 0}\`\n🏢 HDP LC bosishlar: \`${stats.hdp || 0}\`\n🏫 Omon School bosishlar: \`${stats.omon || 0}\``;
    await ctx.reply(text, { parse_mode: "Markdown" });
  } else {
    await ctx.reply("Siz admin emassiz!");
  }
});

// Express Server Setup
const app = express();
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Webhook Route
const webhookPath = `/webhook/${API_TOKEN}`;
app.use(webhookPath, webhookCallback(bot, 'express'));

// Vite Integration for Frontend
import { createServer as createViteServer } from 'vite';

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
    
    // Set Webhook
    const webhookUrl = `${WEBHOOK_HOST.replace(/\/$/, '')}${webhookPath}`;
    try {
      await bot.api.setWebhook(webhookUrl);
      console.log(`Webhook set to ${webhookUrl}`);
    } catch (err) {
      console.error("Failed to set webhook:", err);
    }
  });
}

startServer();
