// const ethers = require('ethers');
// const TelegramBot = require('node-telegram-bot-api');
// const dotenv = require('dotenv');
// dotenv.config();

// const botToken = process.env.TOKEN;
// const mnemonic = process.env.MEMONIC;

// const bot = new TelegramBot(botToken, { polling: true });

// let chatIds = [];

// const addresses = {
//     WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
//     router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
//     factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
//     me: "0xf2f4F74dcc0C7E59188F79084E7c1D63Da150a21"
// };

// const provider = new ethers.providers.WebSocketProvider(process.env.QUICKHTTP);
// const wallet = ethers.Wallet.fromMnemonic(mnemonic);
// const account = wallet.connect(provider);

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;

//     if (msg.text.toString().toLowerCase().includes('/start')) {
//         if (!chatIds.includes(chatId)) {
//             chatIds.push(chatId);

//             bot.sendMessage(chatId, `Hello! Welcome to Paflex Bot.\n I am now your bot. I will notify you about new token pairs.`);
//         }
//     }
// });

// const factory = new ethers.Contract(
//     addresses.factory,
//     ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
//     account
// );

// const router = new ethers.Contract(
//     addresses.router,
//     [
//         'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
//         'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)',
//     ],
//     account
// );

// factory.on("PairCreated", async (token0, token1, addressPair) => {
//     try {
//         if (chatIds.length === 0) {
//             return;
//         }

//         const message = `
//         ~~~~~~~~~~~~~~~~~~
//         New pair detected
//         ~~~~~~~~~~~~~~~~~~
//         token0: ${token0}
//         token1: ${token1}
//         addressPair: ${addressPair}. buying...
//         `;

//         // Send the message to the Telegram chat
//         bot.sendMessage(chatIds[0], message); // Assuming you want to send to the first chat ID

//         let buyToken, sellToken;
//         if (token0 === addresses.WBNB) {
//             buyToken = token0;
//             sellToken = token1;
//         } else if (token1 === addresses.WBNB) {
//             buyToken = token1;
//             sellToken = token0;
//         } else {
//             return "Neither token is WBNB, and we cannot purchase";
//         }

//         const amountIn = ethers.utils.parseUnits('0.0031', 'ether');
//         const amounts = await router.getAmountsOut(amountIn, [buyToken, sellToken]);
//         const amountOutMin = amounts[1].sub(amounts[1].div(10));


//     //     setTimeout(async () => {
//     //     const tx = await router.swapExactTokensForTokens(
//     //         amountIn,
//     //         amountOutMin,
//     //         [buyToken, sellToken],
//     //         addresses.me,
//     //         Date.now() + 1000 * 60 * 5 // 5 minutes
//     //     );

//     //     const receipt = await tx.wait();

//     //     if (receipt.status === 1) {
//     //         bot.sendMessage(chatIds[0], 'Transaction successful!'); // Send success message
//     //     } else {
//     //         bot.sendMessage(chatIds[0], 'Transaction failed!'); // Send failure message
//     //     }
//     // }, 30000);//wait for 30 sec


//     // ... (previous code)

// // Delay for 1 minute before executing the trade
// setTimeout(async () => {
//     // Ensure that the account has approved the router to spend the tokens
//     const tokenContract = new ethers.Contract(buyToken, ['function approve(address spender, uint amount)'], account);

//     const approvalTx = await tokenContract.approve(addresses.router, amountIn);
//     await approvalTx.wait();

//     // Now proceed with the swap
//     const swapTx = await router.swapExactTokensForTokens(
//         amountIn,
//         amountOutMin,
//         [buyToken, sellToken],
//         addresses.me,
//         Date.now() + 1000 * 60 * 5 // 5 minutes
//     );

//     const swapReceipt = await swapTx.wait();
//     console.log('Swap Transaction receipt', swapReceipt);

//     if (swapReceipt.status === 1) {
//         bot.sendMessage(chatIds[0], 'Swap Transaction successful!');
//     } else {
//         bot.sendMessage(chatIds[0], 'Swap Transaction failed: Status is 0 (Reverted).');
//     }
// }, 30000); // 30 seconds delay (30000 milliseconds)

//         // bot.sendMessage(chatIds[0], `Transaction receipt:\n${JSON.stringify(receipt, null, 2)}`);
//     } catch (error) {
//       //  console.error('Error:', error.message);
//         bot.sendMessage(chatIds[0], `Error: ${error.message}`);
//     }
// });

// console.log('bot running now');



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
        'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)',
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

      

        const amountIn = ethers.utils.parseUnits('0.0031', 'ether');
        const amounts = await router.getAmountsOut(amountIn, [buyToken, sellToken]);
        const amountOutMin = amounts[1].sub(amounts[1].div(10));

        // Delay for 5 minutes before executing the trade
        setTimeout(async () => {
            try {
                // Ensure that the account has approved the router to spend the tokens
                bot.sendMessage(chatIds[0], `buying now... \n${token0}`);
                const approvalTx = await router.approve(addresses.router, amountIn, { gasLimit: 200000 });
                await approvalTx.wait();

                // Now proceed with the swap
                const swapTx = await router.swapExactTokensForTokens(
                    amountIn,
                    amountOutMin,
                    [buyToken, sellToken],
                    addresses.me,
                    Date.now() + 1000 * 60 * 5, // 5 minutes
                    { gasLimit: 250000 }
                );

                const swapReceipt = await swapTx.wait();
               // console.log(swapReceipt)

                if (!swapReceipt.error) {
                    bot.sendMessage(chatIds[0], 'Swap Transaction successful!');
                } else {
                    bot.sendMessage(chatIds[0], `Swap Transaction failed. Status: ${swapReceipt}`);
                }
            } catch (error) {
               // console.error('Swap Error:', error.message);
                bot.sendMessage(chatIds[0], `Swap Error: ${error.message}`);
            }
        }, 60000); // 30 seconds delay (adjust as needed)

        // setTimeout(async () => {
        //     try {
        //         bot.sendMessage(chatIds[0], `buying now... \n${token0}`);
        //         // Ensure that the account has approved the router to spend the tokens
        //         const approvalGasEstimate = await router.estimateGas.approve(addresses.router, amountIn);
        //         const approvalTx = await router.approve(addresses.router, amountIn, {
        //             gasLimit: approvalGasEstimate.mul(120).div(100), // Add a buffer of 20%
        //         });
        //         await approvalTx.wait();
        
        //         // Now proceed with the swap, dynamically setting the gas limit
        //         const swapGasEstimate = await router.estimateGas.swapExactTokensForTokens(
        //             amountIn,
        //             amountOutMin,
        //             [buyToken, sellToken],
        //             addresses.me,
        //             Date.now() + 1000 * 60 * 5, // 5 minutes
        //         );
        //         const swapTx = await router.swapExactTokensForTokens(
        //             amountIn,
        //             amountOutMin,
        //             [buyToken, sellToken],
        //             addresses.me,
        //             Date.now() + 1000 * 60 * 5, // 5 minutes
        //             { gasLimit: swapGasEstimate.mul(120).div(100) } // Add a buffer of 20%
        //         );
        
        //         const swapReceipt = await swapTx.wait();
        
        //         if (swapReceipt.status === 1) {
        //             bot.sendMessage(chatIds[0], 'Swap Transaction successful!');
        //         } else {
        //             bot.sendMessage(chatIds[0], `Swap Transaction failed. Status: ${swapReceipt.status}`);
        //         }
        //     } catch (error) {
        //         //console.error('Swap Error:', error.message);
        //         bot.sendMessage(chatIds[0], `Swap Error: ${error.message}`);
        //     }
        // }, 30000); // 30 seconds delay (adjust as needed)

    } catch (error) {
        console.error('Error:', error.message);
        //bot.sendMessage(chatIds[0], `Error: ${error.message}`);
    }
});

console.log('Bot running now');
