const ethers = require('ethers');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv')
dotenv.config()

// Your existing code...

// Create a Telegram bot instance with your bot token
const botToken = process.env.TOKEN;
const mnemonic = process.env.MEMONIC;
const bot = new TelegramBot(botToken, { polling: true });
let chatIds = []; // Store multiple chatIds

const addresses = {
    factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
}

const provider = new ethers.providers.WebSocketProvider(process.env.QUICKHTTP)
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text.toString().toLowerCase().includes('/start')) {
        if (!chatIds.includes(chatId)) {
            chatIds.push(chatId);
            bot.sendMessage(chatId, `Hello! Welcome to Paflex Bot.\n I am now your bot. I will notify you about new token pairs.`);
        }
    }
});

const factory = new ethers.Contract(
    addresses.factory,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    account
);

factory.on("PairCreated", async (token0, token1, addressPair) => {
    try {
        if (chatIds.length === 0) {
            return;
        }

        const link = `https://pancakeswap.finance/swap?utm_source=tokenpocket&outputCurrency=${token1}`;

        for (const chatId of chatIds) {
            bot.sendMessage(chatId, `New pair detected on Binance Smart Chain:\nToken0: ${token0}\nToken1: ${token1}\nAddress Pair: ${addressPair}\nBuy Link:${link}`);
        }

    } catch (error) {
        // Handle errors as needed
        for (const chatId of chatIds) {
            bot.sendMessage(chatId, `Error handling new pair: ${error.message}`);
        }
    }
});

console.log('running');
