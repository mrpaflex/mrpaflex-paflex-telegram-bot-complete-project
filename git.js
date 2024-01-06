const ethers = require('ethers');
const dotenv = require('dotenv');
dotenv.config();

const addresses = {
  WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  router: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  recipient: '0xf2f4F74dcc0C7E59188F79084E7c1D63Da150a21',
  APPROVED_GAS_LIMIT: process.env.APPROVE_TOKEN_GAS_LIMIT,
  APPROVED_GWEI: ethers.utils.parseUnits(process.env.APPROVE_TOKEN_GWEI, 'gwei')
}

const mnemonic = process.env.MEMONIC;
const provider = new ethers.providers.WebSocketProvider(process.env.QUICKHTTP);
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);
const factory = new ethers.Contract(
  addresses.factory,
  ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
  account
);
const router = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) external view returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
  ],
  account
);
const wbnb = new ethers.Contract(
  addresses.WBNB,
  ['function approve(address spender, uint amount) external returns(bool)'],
  account
);

const amountIn = ethers.utils.parseUnits('0.003', 'ether');


factory.on('PairCreated', async (token0, token1, pairAddress) => {
    console.log(`
        New pair detected
        =================
        token0: ${token0}
        token1: ${token1}
        pairAddress: ${pairAddress}
    `);

    let tokenIn, tokenOut;
    if (token0 === addresses.WBNB) {
        tokenIn = token0;
        tokenOut = token1;
    } 
    if (token1 === addresses.WBNB) {
        tokenIn = token1;
        tokenOut = token0;
    }
    // if (typeof tokenIn === 'undefined') {
    //     return;
    // }

    //approving token

    async function init() {
        try {
            console.log(`Approving token pair ${token0}`);
            const txn = await wbnb.approve(
                token0,
                amountIn,
                {
                    gasLimit: addresses.APPROVED_GAS_LIMIT,
                    gasPrice: addresses.APPROVED_GWEI
                }
            );
            const receiptapprove = await txn.wait();
            console.log('Token approval successful');
            console.log(`Transaction: https://www.bscscan.com/tx/${receiptapprove.transactionHash}`)
        } catch (error) {
            console.error('Token approval failed:', error);
        }
    }
    
    // Perform one-time initialization
    init();

    setTimeout(async () => {
        const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
        console.log('This is getAmountOut:', amounts);
        const amountOutMin = amounts[1].sub(amounts[1].div(10));
    
        console.log(`
            Buying new token
            =================
            tokenIn: ${amountIn.toString()} ${tokenIn} (WBNB)
            tokenOut: ${amountOutMin.toString()} ${tokenOut}
        `);
    
        try {
            const tx = await router.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                [tokenIn, tokenOut],
                addresses.recipient,
                Date.now() + 1000 * 60 * 10 // 10 minutes
            );
            const receipt = await tx.wait();
            console.log('Transaction successful');
            console.log('Transaction receipt:');
            console.log(receipt);
        } catch (error) {
            console.error('Transaction failed:', error);
        }
    }, 30000); // 30 seconds
    
});

console.log('Code running, please wait...');
