// Function to estimate gas for a transaction
const estimateGas = async (transaction) => {
    try {
        const gasEstimate = await transaction.estimateGas();
        return gasEstimate.mul(private_data.SLIPPAGE).div(ethers.utils.parseUnits('1', 'gwei'));
    } catch (error) {
        console.error('Error estimating gas:', error.message);
        throw error;
    }
};

// Modified buyTokenFunction
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
                gasLimit: await estimateGas(Transfer_function.swapExactTokensForTokensSupportingFeeOnTransferTokens),
                gasPrice: await provider.getGasPrice(), // Fetch dynamically from a reliable source
            }
        );

        const receipt = await transaction.wait();

        console.log('buy token successfully:', receipt.transactionHash);

        // ... rest of the code
    } catch (err) {
        console.log(err.message);
    }
};

// Modified sellTokenFunction
const sellToken = async () => {
    try {
        const checkFunction = createCheckFunction(sellTokenAdress);

        const dec = await checkFunction.decimals();
        const sellAmout = ethers.utils.parseUnits(private_data.AMOUNT_OF_TOKEN_TO_SELL, dec);
        console.log('selling it at', sellAmout);

        // ... rest of the code

        const transaction = await Transfer_function.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            sellAmout,
            amountOutMin,
            [sellTokenAdress, WbnbAddr],
            myWallet,
            Date.now() + 1000 * 60 * 5,
            {
                gasLimit: await estimateGas(Transfer_function.swapExactTokensForTokensSupportingFeeOnTransferTokens),
                gasPrice: await provider.getGasPrice(), // Fetch dynamically from a reliable source
            }
        );

        // ... rest of the code
    } catch (err) {
        console.error(err.message);
    }
};
