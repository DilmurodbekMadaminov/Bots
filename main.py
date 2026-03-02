import os
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.utils import executor
import aiosqlite
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher import Dispatcher, filters
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

API_TOKEN = os.getenv('TELEGRAM_API_TOKEN')

# Configure logging
logging.basicConfig(level=logging.INFO)

bot = Bot(token=API_TOKEN)
dispatcher = Dispatcher(bot, storage=MemoryStorage())

# Database setup
async def db_start():
    db = await aiosqlite.connect('hr_bot.db')
    async with db:
        await db.execute('CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY, username TEXT)')
    await db.close()

@dispatcher.message_handler(commands=['start'])
async def cmd_start(message: types.Message):
    await message.answer('Welcome to the HR bot!')

@dispatcher.message_handler(commands=['subscribe'])
async def cmd_subscribe(message: types.Message):
    user_id = message.from_user.id
    username = message.from_user.username

    async with aiosqlite.connect('hr_bot.db') as db:
        await db.execute('INSERT OR IGNORE INTO users (user_id, username) VALUES (?, ?)', (user_id, username))
        await db.commit()
    await message.answer('You are now subscribed!')

@dispatcher.message_handler(commands=['admin'])
async def cmd_admin(message: types.Message):
    if message.from_user.id == ADMIN_ID:
        await message.answer('Admin panel: Here you can manage users.')
    else:
        await message.answer('You do not have access to the admin panel.')

if __name__ == '__main__':
    from aiogram import executor
    asyncio.run(db_start())
    executor.start_polling(dispatcher, skip_updates=True)