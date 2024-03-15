import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [color] = useState("blue")
  useEffect(()=>{
   document.body.style.backgroundColor = color
  })
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
    

  }
  const gasprint =()=>{
    alert(Gasinfo)
  }
  
  const [Gasinfo,setGasinfo]=useState(undefined);
  
  const getGas = async() => {
    if (atm) {
      setGasinfo((await atm.gasprice()).toNumber());
    }
    

  }
  const Ethamnt2=()=>{
    alert(Ethinfo)
  }
  
  const [Ethinfo,setEthinfo]=useState(undefined);
  
  const Ethamnt1 = async() => {
    if (atm) {
      setEthinfo((await atm.quantityeth()).toNumber());
    }
    

  }
 
 
  
  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }
  
  const amountdeposit =async() =>  {
    if (atm) {
      let tx = await atm.deposit(DepositAmount);
      await tx.wait();
      getBalance();
    }
  }
  const [DepositAmount,SetDepositAmount]= useState(undefined);
 
  const depositchange = event =>{
    SetDepositAmount(event.target.value)
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }
  const amountwithdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(WithdrawAmount);
      await tx.wait()
      getBalance();
    }
  }
  const [WithdrawAmount,SetWithdrawAmount]= useState(undefined);
 
  const withdrawchange = event =>{
    SetWithdrawAmount(event.target.value)
  }


  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }
    if (Gasinfo == undefined) {
      getGas();
    }
    if (Ethinfo == undefined){
      Ethamnt1();

    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        
        <button style={{background:'yellow',color:'black'}} onClick={deposit}>Deposit 1 ETH</button>
        <button style={{background:'green',color:'white'}} onClick={withdraw}>Withdraw 1 ETH</button>
        <button style={{background:'orange',color:'white'}} onClick={()=>{
          getGas();
          gasprint();

        }}>Gasprice</button>
        
        <button style={{background:'cyan',color:'black'}} onClick={()=>{
          Ethamnt1();
          Ethamnt2();
          

        }}>BlockNum</button>
        

      
        <input 
      type="text"
      placeholder="Deposit Amount"
      value={DepositAmount}
      onChange={depositchange}
     
     
      />
       <button style={{background:'yellow',color:'black'}} onClick ={()=>{
        
        amountdeposit()
        
       }}>Deposit</button>
        
        
      <input 
      type="text"
      placeholder="Withdraw Amount"
      value={WithdrawAmount}
      onChange={withdrawchange}
     
     
      />
       <button style={{background:'green',color:'white'}} onClick ={()=>{
        
        amountwithdraw()
        
       }}>Withdraw</button>
        

  

      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
  
}
