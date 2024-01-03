const ethers = require('ethers');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();

const botToken = process.env.TOKEN;
const mnemonic = process.env.MEMONIC;

const bot = new TelegramBot(botToken, { polling: true });

let chatIds = [];

const addresses = {
    WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    me: "0xf2f4F74dcc0C7E59188F79084E7c1D63Da150a21",
    APPROVED_GAS_LIMIT: process.env.APPROVE_TOKEN_GAS_LIMIT,
    APPROVED_GWEI: ethers.utils.parseUnits(process.env.APPROVE_TOKEN_GWEI, 'gwei')
};

const provider = new ethers.providers.WebSocketProvider(process.env.QUICKHTTP);
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text.toString().toLowerCase().includes('/start')) {
        if (!chatIds.includes(chatId)) {
            chatIds.push(chatId);

            bot.sendMessage(chatId, `Hello! Welcome to Paflex Bot.\nI am now your bot. I will notify you about new token pairs.`);
        }
    }
});

const factory = new ethers.Contract(
    addresses.factory,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    account
);

const router = new ethers.Contract(
    addresses.router,
    [
        'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
        'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
        'function approve(address spender, uint amount) external returns (bool)',
    ],
    account
);

factory.on("PairCreated", async (token0, token1, addressPair) => {
    try {
        if (chatIds.length === 0) {
            return;
        }

        const message = `
        ~~~~~~~~~~~~~~~~~~
        New pair detected
        ~~~~~~~~~~~~~~~~~~
        token0: ${token0}
        token1: ${token1}
        addressPair: ${addressPair}
        `;

        // Send the message to the Telegram chat
        bot.sendMessage(chatIds[0], message);

        let buyToken, sellToken;
        if (token0 === addresses.WBNB) {
            buyToken = token0;
            sellToken = token1;
        } else if (token1 === addresses.WBNB) {
            buyToken = token1;
            sellToken = token0;
        } else {
            return bot.sendMessage(chatIds[0], 'Neither token is WBNB, and we cannot purchase');
        }

        const amountIn = ethers.utils.parseUnits('0.0011');
        const amounts = await router.getAmountsOut(amountIn, [buyToken, sellToken]);
        const amountOutMin = amounts[1].sub(amounts[1].div(10));

        // Ensure that the account has approved the router to spend the tokens
        const approvalTx = await router.approve(
            buyToken,
            amountIn,
            {
                gasLimit: addresses.APPROVED_GAS_LIMIT,
                gasPrice: addresses.APPROVED_GWEI
            }
        );
        const approvalReceipt = await approvalTx.wait();
        console.log('Token approval receipt:', approvalReceipt);

        // Delay for 30 seconds before executing the trade
        setTimeout(async () => {
            try {
                bot.sendMessage(chatIds[0], `Buying now...\n${buyToken}`);
                const swapTx = await router.swapExactTokensForTokens(
                    amountIn,
                    amountOutMin,
                    [buyToken, sellToken],
                    addresses.me,
                    Date.now() + 1000 * 60 * 5, // 5 minutes
                    { gasLimit: 210000 } // Adjust gas limit as needed
                );

                const swapReceipt = await swapTx.wait();
                console.log('Swap transaction receipt:', swapReceipt);

                if (swapReceipt.status === 1) {
                    bot.sendMessage(chatIds[0], 'Swap Transaction successful!');
                } else {
                    bot.sendMessage(chatIds[0], `Swap Transaction failed. Status: ${swapReceipt.status}`);
                }
            } catch (error) {
                console.error('Swap Error:', error.message);
                bot.sendMessage(chatIds[0], `Swap Error: ${error.message}`);
            }
        }, 30000); // 30 seconds delay (adjust as needed)

    } catch (error) {
        console.error('Error:', error.message);
    }
});

console.log('Bot running now');
