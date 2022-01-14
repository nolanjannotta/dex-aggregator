const DexAggregator = artifacts.require("./DexAggregator.sol")
const ERC20ABI = require("./ABIs/ERC20ABI.json")



contract("Dex Aggregator", ([deployer]) => {
    let aggregator, wethSwapAmount
    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

    before(async () => {
        wethSwapAmount = web3.utils.toBN(10 * 10**18)
        aggregator = await DexAggregator.deployed();
    })
    describe("UNISWAP", () => {
        it("get amounts out given an input amount", async () => {
            const results = await aggregator.uniRate([WETH, USDC], wethSwapAmount)
            console.log("for 10 eth receives",( results / 10**6).toString(), "usdc" )
        }) 
    })
    describe("SUSHISWAP", () => {
        it("get amounts out given an input amount", async () => {
            const results = await aggregator.sushiRate([WETH, USDC], wethSwapAmount)
            console.log("for 10 eth receives",( results / 10**6).toString(), "usdc" )
        })
    })
    describe("best rate", () => {
        it("calculates best rate for amount OUT", async () => {
            const results = await aggregator.getHighestAmountOut([WETH, USDC], wethSwapAmount)
            console.log(results[0].toString(), results[1].toString())
            results[0] == 0 ? console.log("uniswap") : console.log("sushiswap")
        })

    })

    describe("swapping", () => {
        let wethContract, usdcContract
        let initialWETH, initialUSDC

        before(async () => {

            wethContract = new web3.eth.Contract(ERC20ABI, WETH)
            usdcContract = new web3.eth.Contract(ERC20ABI, USDC)
            await wethContract.methods.approve(aggregator.address, wethSwapAmount).send({from: deployer})


        })

        it("initial balances", async () => {
            initialWETH = await wethContract.methods.balanceOf(deployer).call()
            initialUSDC = await usdcContract.methods.balanceOf(deployer).call()
            console.log("user initial usdc balance: ",initialUSDC / 10**6)
            console.log("user initial weth balance: ",initialWETH / 10**18)
        })

        it("performs swap", async () => {
            console.log("swap amount: ", wethSwapAmount / 10**18)
            await aggregator.wethToUSDC(wethSwapAmount)
        })


        it("post swap balances", async () => {
            let wethBalance = await wethContract.methods.balanceOf(deployer).call()
            let usdcBalance = await usdcContract.methods.balanceOf(deployer).call()
            console.log("usdc balance after: ",usdcBalance / 10**6)
            console.log("weth balance after: ",wethBalance / 10**18)
        })
        it("swap in reverse direction", async () => {
            const usdcBalance = await usdcContract.methods.balanceOf(deployer).call()
            await usdcContract.methods.approve(aggregator.address, usdcBalance).send({from: deployer})

            await aggregator.usdcToWETH(usdcBalance)
        })

        it("verifies balance change", async () => {
            const balance = await usdcContract.methods.balanceOf(deployer).call()
            console.log("users usdc balance: ",balance / 10**6)
        })


    })

    

})