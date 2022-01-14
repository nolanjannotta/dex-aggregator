import React, {useState, useEffect} from 'react'
import "./Aggregator.css"
import Web3 from "web3"
import ERC20 from "../ABIs/ERC20.json"
import DexABI from "../ABIs/DexABI.json";




function Aggregator() {
    const web3 = new Web3(window.ethereum)
    const dexAddress = "0x87A704179C5ED644050fA007cAAEC043160AcB33"
    const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

    const DexAggregator = new web3.eth.Contract(DexABI, dexAddress)
    const wethToken = new web3.eth.Contract(ERC20, wethAddress)
    const usdcToken = new web3.eth.Contract(ERC20, usdcAddress)




    const [swap, setSwap] = useState({
        amountIn: 0,
        amountOut: 0,
        dex: "",
        path: [],
        tokens: []

    });

    const [tokenBalance, setTokenBalance] = useState({
        wethBalance: 0,
        wethApproved: 0,
        usdcBalance: 0,
        usdcApproved: 0
    })


    const [approval, setApproval] = useState(0)
    
    const [account, setAccount] = useState("")

    
    // Loads account from metamask, loads token balances

    const loadAccount = async () => {
        const accounts = await web3.eth.getAccounts()
        setAccount(accounts[0])
    }

    const loadData = async () => {
        const accounts = await web3.eth.getAccounts()
        setAccount(accounts[0])
        const wethBalance = await wethToken.methods.balanceOf(accounts[0]).call()
        const usdcBalance = await usdcToken.methods.balanceOf(accounts[0]).call()

        const wethApproved = await wethToken.methods.allowance(accounts[0], dexAddress).call()
        const usdcApproved = await usdcToken.methods.allowance(accounts[0], dexAddress).call()

        setTokenBalance({
            wethBalance: wethBalance,
            wethApproved: wethApproved,
            usdcBalance: usdcBalance,
            usdcApproved: usdcApproved
        })
        
    }

    
    // WETH => 18 decimals 
    // USDC => 6 decimals
    const toTokenUnits = (amount, unit) => {
        return web3.utils.toWei(amount, unit)
    
    }
    const fromTokenUnits = (amount, unit) => {
        return web3.utils.fromWei(amount.toString(), unit)
    }


        
    const approveWeth = async () => {
        await wethToken.methods.approve(dexAddress, toTokenUnits(approval, "ether")).send({from: account})
        loadData()
    }

    const approveUsdc = async () => {
        await usdcToken.methods.approve(dexAddress, toTokenUnits(approval, "mwei")).send({ from: account })
        loadData()
    } 
        


    const reviewSwap = async () => {
        if (swap.path.length < 2 || swap.amountIn === 0) {
            setSwap({
                ...swap,
                amountIn: "please choose token to swap"
            })
            return
            
        }

        let amountInWei
        swap.path[0] === wethAddress ?
            amountInWei = toTokenUnits(swap.amountIn, "ether") :
            amountInWei = toTokenUnits(swap.amountIn, "mwei")
        
        const bestRate = await DexAggregator.methods.getHighestAmountOut(swap.path, amountInWei).call()

        bestRate[0] === 0 ?
            setSwap({ ...swap, dex: "Uniswap", amountOut: bestRate[1] }) : 
            setSwap({ ...swap, dex: "Sushiswap", amountOut: bestRate[1] })
        


        
    }

    const executeSwap = async () => {

        if (swap.path[0] === wethAddress) {
            await DexAggregator.methods.wethToUSDC(toTokenUnits(swap.amountIn, "ether")).send({from: account })
        }
        else {
            await DexAggregator.methods.usdcToWETH(toTokenUnits(swap.amountIn, "mwei")).send({from: account})
        }

        loadData()
        
    }






    useEffect(() => {

        loadAccount()
        loadData() 
        


    }, [])
    




    


    return (

        <div className="body-container">
            <div className="aggregator-container">

                <div className="sub-section">
                    <p>
                      Select token to swap:  
                    </p>
                    
                    
                    <button
                        style={{margin: "20px"}}
                        onClick={() => {
                            setSwap({
                                ...swap,
                                path: [wethAddress, usdcAddress],
                                tokens: ["Weth", "USDC"],
                                amountIn: swap.amountIn
                            })
                        }}>
                            Weth
                    </button>
                    <p style={{fontSize: "10px"}}>
                        Available Balance: {tokenBalance.wethBalance / 10 ** 18} WETH</p>
                    <p style={{ fontSize: "10px" }}>
                        Approved: {tokenBalance.wethApproved / 10**18} WETH
                    </p>
                    
                    
                    
                    <div>
                        
                    </div>
                    <button
                        style={{margin: "20px"}}
                        onClick={() => {
                            setSwap({
                                ...swap,
                                path: [usdcAddress, wethAddress],
                                tokens: ["USDC", "Weth"],
                                amountIn: swap.amountIn
                            })
                        }}>
                            Usdc
                    </button>
                    <p style={{fontSize: "10px"}}>
                        available balance: {tokenBalance.usdcBalance / 10 ** 6} USDC</p>
                    <p style={{fontSize: "10px"}}>
                    Approved: {tokenBalance.usdcApproved / 10**6} USDC
                    </p>


                    


                </div>

                <div className='sub-section'>
                    <p>
                      Approval:  
                    </p>
                    
                    <div style={{marginTop: "30px"}}>
                            <input
                            onChange={(event) => { setApproval(event.target.value) }}
                            placeholder="amount"
                                >
                            </input>
                            <div>
                            <button onClick={approveWeth}>Approve Weth</button>  
                                <button onClick={approveUsdc}>Approve usdc</button>  
                            </div>
                                
                    </div>
                    
                    
                    <div>
                        <p>
                            How many?
                        </p>
                        
                    <input
                        // input type="number"
                        style={{margin: "20px"}}
                        
                        placeholder='amount'
                        onChange={(event) => { setSwap({...swap, amountIn: event.target.value })}}

                    >
                    </input>
                    <p>

                        {swap.amountIn}  
                        
                        {swap.tokens[0]}

                    </p>
                    <div>
                        <button
                            style={{margin: "20px"}}
                            onClick={reviewSwap}
                        >
                            Review Swap
                        </button>
                    </div>

                    </div>
                    
                    
                    

                </div>
                
                <div className="sub-section">
                    <p>
                      You will receive at least:  
                    </p>
                    

                    

                    <p>

                        {swap.path[1] === wethAddress ? fromTokenUnits(swap.amountOut, "ether") : fromTokenUnits(swap.amountOut, "mwei")}

                        {swap.tokens[1]}
                    
                    </p>

                    
                    <p>{swap.dex}</p>

                        
                    <div>
                        <button
                            style={{margin: "20px"}}
                            onClick={executeSwap}
                        >
                        Swap!
                    </button>  
                    </div>
                    
                    

                    

                </div>

            </div>
            
            
        </div>
    )
}

export default Aggregator
