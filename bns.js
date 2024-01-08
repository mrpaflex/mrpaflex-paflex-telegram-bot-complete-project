const ethers = require('ethers');
const dotenv = require('dotenv');
const ps = require('prompt-sync')

dotenv.config();

const privateData = {
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
    SLIPPAGE: ethers.utils.parseUnits(process.env.SLIPPAGE, 'gwei'),
};

const prompt = ps({ sigint: true });

const provider = new ethers.providers.WebSocketProvider(privateData.QUICKHTTP);
const wallet = ethers.Wallet.fromMnemonic(privateData.MY_PRIVATE_KEY);
const account = wallet.connect(provider);

const amountIn = privateData.AMOUNT_OF_WBNB_TO_BUY_TOKEN;
const WbnbAddr = privateData.WBNB_ADDR;
const tokenBuyAddress = privateData.PURCHASE_TOKEN_ADDR;
const sellTokenAdress = privateData.SELL_TOKEN_ADDR;
const myWallet = privateData.MY_WALLET;

const TransferFunction = new ethers.Contract(
    privateData.ROUTER_ADDR,
    [
        // 'function getAmountsOut(uint amountIn, address[] memory path) internal view returns (uint[] memory amounts)',
        'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
        'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
    ],
    account
);

const createCheckFunction = (tokenAddress) => {
    return new ethers.Contract(
        tokenAddress,
        [
            'function name() view returns (string)',
            'function symbol() view returns (string)',
            'function approve(address spender, uint amount) public returns(bool)',
            'function balanceOf(address account) external view returns (uint256)',
            'function decimals() view returns(uint8)',
        ],
        account
    );
};

const approvedTokenFunction = async (checkFunction) => {
    try {
        const symbol = await checkFunction.symbol();
        console.log(`Please wait! Approving token ${symbol}`);
        const tokenAddress = checkFunction.address;
        const ApproveToken = await checkFunction.approve(
            tokenAddress,
            ethers.constants.MaxUint256, // Set the approval to the maximum value
            {
                gasPrice: ethers.utils.parseUnits('5', 'gwei'),
               // gasLimit: 360000,
                gasLimit: ethers.utils.hexlify(210000),
                // gasLimit: privateData.GAS_LIMIT_FOR_APPROVE_TOKEN,
                // gasPrice: privateData.GWEI_FOR_APPROVE_TOKEN,
            }
        );
        const txnReceipt = await ApproveToken.wait();
        console.log(`Token approved successfully: https://www.bscscan.com/tx/${txnReceipt.transactionHash}`);
    } catch (err) {
        console.error(`Error in approving token: ${err.message}`);
    }
};

const buyTokenFunction = async () => {
    try {
        console.log('Buying function running now');
        const amountOut = await TransferFunction.getAmountsOut(amountIn, [WbnbAddr, tokenBuyAddress]);
        const slippagePercentage = 5; // 1% slippage as an example, you can adjust this value
        const amountOutMin = amountOut[1].sub(amountOut[1].mul(slippagePercentage).div(100));
        //const amountOutMin = amountOut[1].sub(amountOut[1].div(100));

        console.log('amountOut[1]:', amountOut[1].toString());
        console.log('amountOutMin:', amountOutMin.toString());

        // Create checkFunction instance based on tokenBuyAddress
        const checkFunction = createCheckFunction(tokenBuyAddress);

        const transaction = await TransferFunction.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountIn,
            amountOutMin,
            [WbnbAddr, tokenBuyAddress],
            myWallet,
            Date.now() + 1000 * 60 * 5,
            {
                gasPrice: ethers.utils.parseUnits('6', 'gwei'),
               // gasLimit: 360000,
                gasLimit: ethers.utils.hexlify(250000)
                // gasLimit: private_data.GAS_LIMIT_BUY_TOKEN,
                // gasPrice: private_data.GWEI_BUY_TOKEN
            }
        );

        const receipt = await transaction.wait();

        console.log('buy token successfully:', receipt.transactionHash);

        const symb = await checkFunction.symbol();
        const balance = await checkFunction.balanceOf(privateData.MY_WALLET);
        const dec = await checkFunction.decimals();
        const amt = await TransferFunction.getAmountsOut(balance, [tokenBuyAddress, WbnbAddr]);

        console.log('your balance:', parseFloat(amt[0] / 10**dec).toString().substring(0, 6), symb, "WORTH: ", parseFloat(amt[1] / 10**18).toString().substring(0, 6))
    } catch (err) {
        console.error(`Error in buying token: ${err.message}`);
    }
};

const sellToken = async () => {
    try {
        const checkFunction = createCheckFunction(sellTokenAdress);
        const dec = await checkFunction.decimals();
        const sellAmount = ethers.utils.parseUnits(privateData.AMOUNT_OF_TOKEN_TO_SELL, dec);

        console.log(`Selling ${parseFloat(sellAmount / 10**dec).toString().substring(0, 6)} ${await checkFunction.symbol()} tokens.`);

        const amountOut = await TransferFunction.getAmountsOut(sellAmount, [sellTokenAdress, WbnbAddr]);

        // Convert amountOut[1] and amountOutMin to Ether for better readability
        const amountOutWei = BigInt(amountOut[1]);
        const slippagePercentage = 2; // Assuming 1% slippage
        const amountOutMinWei = amountOutWei - (amountOutWei * BigInt(slippagePercentage) / BigInt(100));
        
        //this two guys are don't have business
        const amountOutEth = ethers.utils.formatUnits(amountOutWei, 'ether');
        const amountOutMinEth = ethers.utils.formatUnits(amountOutMinWei, 'ether');

        console.log(`AmountOut[1] in Ether: ${amountOutEth}`);
        console.log(`AmountOutMin in Ether: ${amountOutMinEth}`);

        const transaction = await TransferFunction.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            sellAmount,
            amountOutMinWei,
            [sellTokenAdress, WbnbAddr],
            myWallet,
            Date.now() + 1000 * 60 * 5,
            {
                gasPrice: ethers.utils.parseUnits('5', 'gwei'),
                // gasLimit: 360000,
                 gasLimit: ethers.utils.hexlify(210000),
            }
        );

        const receipt = await transaction.wait();
        console.log(`Tokens sold successfully. Transaction hash: https://www.bscscan.com/tx/${receipt.transactionHash}`);

        const balance = await checkFunction.balanceOf(privateData.MY_WALLET);
        const tokenSymbol = await checkFunction.symbol();
        const amountsOutAfterSell = await TransferFunction.getAmountsOut(balance, [sellTokenAdress, WbnbAddr]);

        console.log('Your updated balance:', parseFloat(amountsOutAfterSell[0] / 10**dec).toString().substring(0, 6), tokenSymbol)
    } catch (err) {
        console.error(`Error in selling token: ${err.message}`);
    }
};

const begin = async () => {
    console.log("Choose the number based on the task you want to execute \n1. APPROVE TOKEN. \n2. BUY TOKEN \n3. SELL TOKEN");
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
    } else if (menu === '2') {
        await buyTokenFunction();
    } else if (menu === '3') {
        await sellToken();
    } else {
        console.log("Invalid menu option.");
    }
};

begin();
