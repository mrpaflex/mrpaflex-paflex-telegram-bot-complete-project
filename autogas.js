const ethers = require('ethers');
const dotenv = require('dotenv');
const ps = require('prompt-sync');

dotenv.config();

const prompt = ps({ sigint: true });

const private_data = {
    QUICKHTTP: process.env.QUICKHTTP,
    WBNB_ADDR: process.env.ADDR,
    ROUTER_ADDR: process.env.ROUTER_ADDR,
    FACTORY_ADDR: process.env.FACTORY_ADDR,
    WSS_NODE: process.env.WSS_NODE,
    MY_WALLET: process.env.MY_WALLET,
    MY_PRIVATE_KEY: process.env.MEMONIC, 
    HONEYPOT: process.env.HONEYPOT,
    GWEI_BUY_TOKEN: ethers.utils.parseUnits(process.env.GWEI_BUY_TOKEN, 'gwei'),
    
    GAS_LIMIT_BUY_TOKEN: process.env.GAS_LIMIT_BUY_TOKEN,
    
    GWEI_FOR_APPROVE_TOKEN: ethers.utils.parseUnits(process.env.GWEI_FOR_APPROVE_TOKEN, 'gwei'),
        
    GAS_LIMIT_FOR_APPROVE_TOKEN: process.env.GAS_LIMIT_FOR_APPROVE_TOKEN,

    GWEI_TO_SELL_TOKEN: ethers.utils.parseUnits(process.env.GWEI_TO_SELL_TOKEN, 'gwei'),

    GAS_LIMIT_TO_SELL_TOKEN: process.env.GAS_LIMIT_TO_SELL_TOKEN,

    AMOUNT_OF_WBNB_TO_BUY_TOKEN: ethers.utils.parseUnits(process.env.AMOUNT_OF_WBNB_TO_BUY_TOKEN, 'ether'),

    AMOUNT_OF_TOKEN_TO_SELL: process.env.AMOUNT_OF_TOKEN_TO_SELL,
    PURCHASE_TOKEN_ADDR: process.env.PURCHASE_TOKEN_ADDR,
    SELL_TOKEN_ADDR: process.env.SELL_TOKEN_ADDR,

    SLIPPAGE: ethers.utils.parseUnits(process.env.SLIPPAGE, 'gwei')
};

const provider = new ethers.providers.WebSocketProvider(private_data.QUICKHTTP);
const wallet = ethers.Wallet.fromMnemonic(private_data.MY_PRIVATE_KEY);
const account = wallet.connect(provider);

const Transfer_function = new ethers.Contract(
    private_data.ROUTER_ADDR,
    [
        'function getAmountsOut(uint amountIn, address[] memory path) internal view returns (uint[] memory amounts)',
        'function swapExactTokensForTokensSupportingFeeOnTransferTokens( uint amountIn, uint amountOutMin,  address[] calldata path,  address to,  uint deadline) external',
    ],
    account
);

const amountIn = private_data.AMOUNT_OF_WBNB_TO_BUY_TOKEN;
const WbnbAddr = private_data.WBNB_ADDR;
const tokenBuyAddress = private_data.PURCHASE_TOKEN_ADDR;
const sellTokenAdress = private_data.SELL_TOKEN_ADDR;
const myWallet = private_data.MY_WALLET;


const createCheckFunction = (tokenAddress) => {
    return new ethers.Contract(
                tokenAddress,
                [
                    'function name() view returns (string) ',
                    'function symbol() view returns (string)',
                    'function approve(address spender, uint amount) public returns(bool)',
                    'function balanceOf(address account) external view returns (uint256) ',
                    'function decimals() view returns(uint8) '
                ],
                account
            );
};

// const estimateGas = async (transaction) => {
//     try {
//         const gasEstimate = await transaction.estimateGas();
//         return gasEstimate.mul(private_data.SLIPPAGE).div(ethers.utils.parseUnits('1', 'gwei'));
//     } catch (error) {
//         console.error('Error estimating gas for transaction:', error.message);
//         throw error;
//     }
// };

const estimateGas = async (contract, method, ...params) => {
    try {
        const gasEstimate = await contract.estimateGas[method](...params);
        return gasEstimate.mul(private_data.SLIPPAGE).div(ethers.utils.parseUnits('1', 'gwei'));
    } catch (error) {
        console.error('Error estimating gas for transaction:', error.message);
        throw error;
    }
};


const approvedTokenFunction = async (checkFunction) => {
    console.log('Please wait! Approving token...');
    try {
        const ApproveToken = await checkFunction.approve(
            private_data.MY_WALLET,
            amountIn,
            {
                gasLimit: await estimateGas(checkFunction.approve),
                gasPrice: (await provider.getGasPrice()) || ethers.utils.parseUnits('5', 'gwei')
            }
        );
        const txnreceipt = await ApproveToken.wait();
        console.log(`Token approved successfully: https://www.bscscan.com/tx/${txnreceipt.transactionHash}`);
    } catch (err) {
        console.error('Error in approving token:', err.message);
    }
};

const buyTokenFunction = async () => {
    try {
        console.log('buying function running now');

        const amountOut = await Transfer_function.getAmountsOut(amountIn, [WbnbAddr, tokenBuyAddress]);
        const amountOutMin = amountOut[1].sub(amountOut[1].div(100));
        
        console.log('amountOut[1]:', amountOut[1].toString());
        console.log('amountOutMin:', amountOutMin.toString());
        
        // Create checkFunction instance based on tokenBuyAddress
        const checkFunction = createCheckFunction(tokenBuyAddress);

        const transaction = await Transfer_function.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountIn,
            amountOutMin,
            [WbnbAddr, tokenBuyAddress],
            myWallet,
            Date.now() + 1000 * 60 * 5,
            {
                gasLimit: await estimateGas(transaction),
                gasPrice: (await provider.getGasPrice()) || ethers.utils.parseUnits('5', 'gwei')
            }
        );

        const receipt = await transaction.wait();

        console.log('buy token successfully:', receipt.transactionHash);
        const symb = await checkFunction.symbol();
        const balance = await checkFunction.balanceOf(private_data.MY_WALLET);
        const dec = await checkFunction.decimals();
        const amt = await Transfer_function.getAmountsOut(balance, [tokenBuyAddress, WbnbAddr]);

        console.log('your balance:', parseFloat(amt[0] / 10**dec).toString().substring(0, 6), symb, "WORTH: ", parseFloat(amt[1] / 10**18).toString().substring(0, 6));

    } catch (err) {
        console.error('Error in buying token:', err.message);
    }
};

// const sellToken = async () => {
//     try {
//         const checkFunction = createCheckFunction(sellTokenAdress);

//         const dec = await checkFunction.decimals();
//         const sellAmount = ethers.utils.parseUnits(private_data.AMOUNT_OF_TOKEN_TO_SELL, dec);
//         console.log('Selling it at', sellAmount);

//         const amountOut = await Transfer_function.getAmountsOut(sellAmount, [sellTokenAdress, WbnbAddr]);
//         const amountOutMin = amountOut[1].sub(amountOut[1].div(100));

//         console.log('AmountOut[1]:', amountOut[1].toString());
//         console.log('AmountOutMin:', amountOutMin.toString());

//         const transaction = await Transfer_function.swapExactTokensForTokensSupportingFeeOnTransferTokens(
//             sellAmount,
//             amountOutMin,
//             [sellTokenAdress, WbnbAddr],
//             myWallet,
//             Date.now() + 1000 * 60 * 5,
//             {
//                 gasLimit: await estimateGas(Transfer_function.swapExactTokensForTokensSupportingFeeOnTransferTokens),
//                 gasPrice: (await provider.getGasPrice()) || ethers.utils.parseUnits('5', 'gwei')
//             }
//         );

//         const rec = await transaction.wait();
//         console.log(`${dec} sold successfully: https://www.bscscan.com/tx/${rec.transactionHash}`);

//         const symb = await checkFunction.symbol();
//         const balance = await checkFunction.balanceOf(private_data.MY_WALLET);
//         const amt = await Transfer_function.getAmountsOut(balance, [sellTokenAdress, WbnbAddr]);

//         console.log('Your balance:', parseFloat(amt[0] / 10**dec).toString().substring(0, 6), symb);

//     } catch (err) {
//         console.error('Error in selling token:', err.message);
//     }
// };

const sellToken = async () => {
    try {
        const checkFunction = createCheckFunction(sellTokenAdress);

        const dec = await checkFunction.decimals();
        const sellAmount = ethers.utils.parseUnits(private_data.AMOUNT_OF_TOKEN_TO_SELL, dec);
        console.log('Selling it at', sellAmount);

        const amountOut = await Transfer_function.getAmountsOut(sellAmount, [sellTokenAdress, WbnbAddr]);
        const amountOutMin = amountOut[1].sub(amountOut[1].div(100));

        console.log('AmountOut[1]:', amountOut[1].toString());
        console.log('AmountOutMin:', amountOutMin.toString());

        const gasLimit = await estimateGas(Transfer_function, 'swapExactTokensForTokensSupportingFeeOnTransferTokens', sellAmount, amountOutMin, [sellTokenAdress, WbnbAddr], myWallet, Date.now() + 1000 * 60 * 5);
        const gasPrice = (await provider.getGasPrice()) || ethers.utils.parseUnits('5', 'gwei');

        const transaction = await Transfer_function.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            sellAmount,
            amountOutMin,
            [sellTokenAdress, WbnbAddr],
            myWallet,
            Date.now() + 1000 * 60 * 5,
            {
                gasLimit,
                gasPrice,
            }
        );

        const rec = await transaction.wait();
        console.log(`${dec} sold successfully: https://www.bscscan.com/tx/${rec.transactionHash}`);

        const symb = await checkFunction.symbol();
        const balance = await checkFunction.balanceOf(private_data.MY_WALLET);
        const amt = await Transfer_function.getAmountsOut(balance, [sellTokenAdress, WbnbAddr]);

        console.log('Your balance:', parseFloat(amt[0] / 10**dec).toString().substring(0, 6), symb);

    } catch (err) {
        console.error('Error in selling token:', err.message);
    }
};



const begin = async () => {
    console.log("Choose the number based on the task you want to execute \n1. APPROVE TOKEN. \n2. BUY TOKEN \n3 SELL TOKEN");
    let menu = prompt('');

    if (menu === "1") {
        console.log("Enter the token address you want to approve:");
        const tokenAddress = prompt('');
        if (ethers.utils.isAddress(tokenAddress)) {
            const dynamicCheckFunction = createCheckFunction(tokenAddress);
            await approvedTokenFunction(dynamicCheckFunction);
        } else {
            console.log("Invalid token address.");
        }
    }
    if (menu === '2') {
        await buyTokenFunction();
    }

    if (menu === '3') {
        await sellToken();
    }
};

begin();
