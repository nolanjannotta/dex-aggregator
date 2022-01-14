
module.exports = async function (callback) {


    // get accounts
    const accounts = await web3.eth.getAccounts()
    const unlockedAccount = "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"

    // weth contract
    const wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    const wethABI = require("./wethABI.json")
    const wethContract = new web3.eth.Contract(wethABI, wethAddress)




    // check balance
    const whaleBalance = await wethContract.methods.balanceOf(unlockedAccount).call()

    console.log("whale balance: ", whaleBalance / 10**18)



    // transfer
    await wethContract.methods.transfer(accounts[0], whaleBalance).send({from: unlockedAccount})


    // check ganache account balance
    const ganacheBalance = await wethContract.methods.balanceOf(accounts[0]).call()

    console.log("ganache balance: ", ganacheBalance / 10**18)


    







    callback()
}