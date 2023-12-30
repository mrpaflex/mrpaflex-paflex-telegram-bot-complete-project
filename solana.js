const { Connection, PublicKey } = require('@solana/web3.js');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();

const rmmm = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
const tokenProgramId = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const botToken = process.env.TOKEN;
const solanaEndpoint = process.env.SOLANA_RPC_ENDPOINT;
const radiumSwapProgramId = new PublicKey(tokenProgramId)
const marketAddress = new PublicKey(rmmm); // Replace with your Radium Market address
const bot = new TelegramBot(botToken, { polling: true });
let chatIds = [];

const connection = new Connection(solanaEndpoint, 'confirmed');

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text.toString().toLowerCase().includes('/start')) {
        if (!chatIds.includes(chatId)) {
            chatIds.push(chatId);
            bot.sendMessage(chatId, `Hello! Welcome to Radium Token Monitor Bot.\nI will notify you about newly listed tokens on Radium.`);
        }
    }
});

const marketSubscription = connection.onMarket(marketAddress, (event) => {
    const { base, price, size } = event.data;
    const token1 = base.mint.toString();
    const token2 = price.mint.toString();

    // You may need to fetch token names or symbols using the token addresses

    for (const chatId of chatIds) {
        bot.sendMessage(chatId, `New trade on Radium Swap:\nToken1: ${token1}\nToken2: ${token2}\nSize: ${size}`);
    }
});

// Handle errors and close the subscription if needed
marketSubscription.on('error', (err) => {
    console.error(`Error in Radium market subscription: ${err}`);
});

// Uncomment the line below if you want to close the subscription after a certain time
// setTimeout(() => marketSubscription.unsubscribe(), 60000); // Unsubscribe after 60 seconds

console.log('Running Radium Token Monitor Bot');


