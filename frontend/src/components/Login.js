import React, {useState} from 'react'
import "./Login.css"
import Web3 from "web3"



function Login() {
    const web3 = new Web3(window.ethereum)

    const [address, setAddress] = useState("please connect wallet")
    const [ethBalance, setEthBalance] = useState('')
    const [buttonText, setButtonText] = useState("connect")

    if (window.ethereum == null) {
        setAddress("MetaMask not detected. Please install")
        return
    
    }

    const connect = async () => {
        const connectAddress = window.ethereum.selectedAddress
        await web3.eth.getBalance(connectAddress).then(balance => {
            setEthBalance(balance)
        })

        connectAddress === undefined ? setButtonText("connect") : setButtonText("connected")
        
        window.ethereum.request({ method: 'eth_requestAccounts' })
        setAddress(window.ethereum.selectedAddress)

    }




    return (
        <div className="Button-container">

            <div className="Address">
                <div>
                  {address}  
                </div>
                
                <div>
                 Current Balance: {ethBalance / 10**18} Eth   
                </div>
                
            </div>

            <button className="Connect" onClick={connect}>
                {buttonText}
            </button>
            
        </div>
    )
}

export default Login
