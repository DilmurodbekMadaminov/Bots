import os
import logging
import sqlite3
import sys
from aiogram import Bot, Dispatcher, types
from aiogram.utils.executor import start_webhook
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_TOKEN = os.getenv("BOT_TOKEN")
WEBHOOK_HOST = os.getenv("WEBHOOK_HOST")

if not API_TOKEN:
    logging.error("BOT_TOKEN topilmadi! .env faylni tekshiring.")
    sys.exit(1)

if not WEBHOOK_HOST:
    logging.error("WEBHOOK_HOST topilmadi! .env faylni tekshiring.")
    sys.exit(1)

WEBHOOK_PATH = f'/webhook/{API_TOKEN}'
WEBHOOK_URL = f"{WEBHOOK_HOST.rstrip('/')}{WEBHOOK_PATH}"

# Webserver settings
WEBAPP_HOST = '0.0.0.0'
WEBAPP_PORT = 8000

# Bot settings
ADMIN_ID = 7858117466
CHANNEL_ID = "@Xorazm_ish_bozor1"

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Initialize bot and dispatcher
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

# Database helper with context manager
def get_db_connection():
    return sqlite3.connect('bot_database.db')

def init_db():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,
                hdp INTEGER DEFAULT 0,
                omon INTEGER DEFAULT 0
            )
        ''')
        conn.commit()

def add_user(user_id):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT OR IGNORE INTO users (user_id) VALUES (?)', (user_id,))
        conn.commit()

def increment_counter(user_id, column):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(f'UPDATE users SET {column} = {column} + 1 WHERE user_id = ?', (user_id,))
        conn.commit()

def get_stats():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*), SUM(hdp), SUM(omon) FROM users')
        stats = cursor.fetchone()
        # Handle None values if table is empty
        count = stats[0] or 0
        hdp = stats[1] or 0
        omon = stats[2] or 0
        return count, hdp, omon

# Keyboards
def get_sub_keyboard():
    keyboard = InlineKeyboardMarkup(row_width=1)
    keyboard.add(
        InlineKeyboardButton("Obuna bo'lish", url="https://t.me/Xorazm_ish_bozor1"),
        InlineKeyboardButton("Tekshirish", callback_data="check_sub")
    )
    return keyboard

def get_main_keyboard():
    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.add(KeyboardButton("HDP LC"), KeyboardButton("Omon School"))
    return keyboard

# Helper: Check subscription
async def is_subscribed(user_id):
    try:
        member = await bot.get_chat_member(CHANNEL_ID, user_id)
        return member.status in ['member', 'administrator', 'creator']
    except Exception as e:
        logging.error(f"Obunani tekshirishda xatolik: {e}")
        # Agar bot kanalda admin bo'lmasa yoki kanal topilmasa False qaytaradi
        return False

# Handlers
@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    add_user(message.from_user.id)
    if await is_subscribed(message.from_user.id):
        await message.answer("Xush kelibsiz! Kerakli bo'limni tanlang:", reply_markup=get_main_keyboard())
    else:
        await message.answer(
            "Botdan foydalanish uchun kanalimizga obuna bo'ling:",
            reply_markup=get_sub_keyboard()
        )

@dp.callback_query_handler(text="check_sub")
async def check_subscription_callback(callback_query: types.CallbackQuery):
    if await is_subscribed(callback_query.from_user.id):
        await bot.answer_callback_query(callback_query.id, "Rahmat! Endi botdan foydalanishingiz mumkin.")
        await bot.send_message(callback_query.from_user.id, "Kerakli bo'limni tanlang:", reply_markup=get_main_keyboard())
        # Eski xabarni o'chirish yoki tahrirlash mumkin
        try:
            await bot.delete_message(callback_query.from_user.id, callback_query.message.message_id)
        except:
            pass
    else:
        await bot.answer_callback_query(callback_query.id, "Siz hali obuna bo'lmagansiz!", show_alert=True)

@dp.message_handler(lambda message: message.text == "HDP LC")
async def hdp_handler(message: types.Message):
    if await is_subscribed(message.from_user.id):
        increment_counter(message.from_user.id, 'hdp')
        await message.answer("HDP LC uchun havola: https://forms.gle/f6ZiQtiqCAH1CLy87")
    else:
        await message.answer("Avval kanalga obuna bo'ling!", reply_markup=ReplyKeyboardRemove())
        await send_welcome(message)

@dp.message_handler(lambda message: message.text == "Omon School")
async def omon_handler(message: types.Message):
    if await is_subscribed(message.from_user.id):
        increment_counter(message.from_user.id, 'omon')
        await message.answer("Omon School uchun havola: https://forms.gle/97m9hCsBFovYKKrX7")
    else:
        await message.answer("Avval kanalga obuna bo'ling!", reply_markup=ReplyKeyboardRemove())
        await send_welcome(message)

@dp.message_handler(commands=['admin'])
async def admin_panel(message: types.Message):
    if message.from_user.id == ADMIN_ID:
        count, hdp_total, omon_total = get_stats()
        text = (
            "📊 **Bot statistikasi**:\n\n"
            f"👥 Jami foydalanuvchilar: `{count}`\n"
            f"🏢 HDP LC bosishlar: `{hdp_total}`\n"
            f"🏫 Omon School bosishlar: `{omon_total}`"
        )
        await message.answer(text, parse_mode="Markdown")
    else:
        await message.answer("Siz admin emassiz!")

# Webhook startup/shutdown
async def on_startup(dispatcher):
    logging.info(f"Webhook o'rnatilmoqda: {WEBHOOK_URL}")
    await bot.set_webhook(WEBHOOK_URL)
    init_db()

async def on_shutdown(dispatcher):
    logging.warning('Bot to\'xtatilmoqda...')
    await bot.delete_webhook()
    await dispatcher.storage.close()
    await dispatcher.storage.wait_closed()

if __name__ == '__main__':
    try:
        start_webhook(
            dispatcher=dp,
            webhook_path=WEBHOOK_PATH,
            on_startup=on_startup,
            on_shutdown=on_shutdown,
            skip_updates=True,
            host=WEBAPP_HOST,
            port=WEBAPP_PORT,
        )
    except Exception as e:
        logging.error(f"Botni ishga tushirishda xatolik: {e}")
