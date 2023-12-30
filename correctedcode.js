const ethers = require('ethers');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();

const botToken = process.env.TOKEN;
const mnemonic = process.env.MEMONIC; // Corrected the environment variable name

const bot = new TelegramBot(botToken, { polling: true });

let chatIds = []; 

const addresses = {
    WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    me: "0xf2f4F74dcc0C7E59188F79084E7c1D63Da150a21"
};

const provider = new ethers.providers.WebSocketProvider(process.env.QUICKHTTP);
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

const router = new ethers.Contract(
    addresses.router,
    [
        'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
        'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)',
    ],
    account
);




//
factory.on("PairCreated", async (token0, token1, addressPair) => {
    //const chatId = msg.chat.id;

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
    bot.sendMessage(chatId, message);

    let buyToken, sellToken;
    if (token0 === addresses.WBNB) {
        buyToken = token0;
        sellToken = token1;
    } else if (token1 === addresses.WBNB) {
        buyToken = token1;
        sellToken = token0;
    } else {
        return; // Neither token is WBNB, and we cannot purchase
    }


    const amountIn = ethers.utils.parseUnits('0.0035', 'ether');
    const amounts = await router.getAmountsOut(amountIn, [buyToken, sellToken]);
    const amountOutMin = amounts[1].sub(amounts[1].div(10));

    const tx = await router.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        [buyToken, sellToken],
        addresses.me,
        Date.now() + 1000 * 60 * 5 // 5 minutes
    );

    const receipt = await tx.wait();
    console.log('Transaction receipt');
    bot.sendMessage(chatId, receipt);

    // bot.sendMessage(chatId, `New pair detected:\nToken0: ${token0}\nToken1: ${token1}\nAddress Pair: ${addressPair}`);
});

console.log('Working');

//

// factory.on("PairCreated", async (token0, token1, addressPair) => {
//     console.log(`
//     ~~~~~~~~~~~~~~~~~~
//     New pair detected
//     ~~~~~~~~~~~~~~~~~~
//     token0: ${token0}
//     token1: ${token1}
//     addressPair: ${addressPair}
//     `);

//     let buyToken, sellToken;
//     if (token0 === addresses.WBNB) {
//         buyToken = token0;
//         sellToken = token1;
//     } else if (token1 === addresses.WBNB) {
//         buyToken = token1;
//         sellToken = token0;
//     } else {
//         return; // Neither token is WBNB, and we cannot purchase
//     }

//     const amountIn = ethers.utils.parseUnits('0.0035', 'ether');
//     const amounts = await router.getAmountsOut(amountIn, [buyToken, sellToken]);
//     const amountOutMin = amounts[1].sub(amounts[1].div(10));

//     const tx = await router.swapExactTokensForTokens(
//         amountIn,
//         amountOutMin,
//         [buyToken, sellToken],
//         addresses.me,
//         Date.now() + 1000 * 60 * 5 // 5 minutes
//     );

//     const receipt = await tx.wait();
//     console.log('Transaction receipt');
//     console.log(receipt);

//     bot.sendMessage(chatId, `New pair detected:\nToken0: ${token0}\nToken1: ${token1}\nAddress Pair: ${addressPair}`);
// });


