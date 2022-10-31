import React, { useState, ChangeEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import Kards from './components/Kards'
import GetNFTs from './components/GetNFTs'
import { ethers } from 'ethers'
import Moralis from 'moralis'

type InputEvent = ChangeEvent<HTMLInputElement>;

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const [holderAddress, setHolderAddress] = useState<string>('')
  const [tokenIds, setTokenIds] = useState< Map<number, [any]> >()
  const [names, setNames] = useState< Map<number, [any]> >()
  const [bambooAmount, setBambooAmount] = useState<number>(0)
  const [someMsg, setSomeMsg] = useState<string>('')
  const [valid, setValid] = useState<boolean>(false)
  const [started, setStarted] = useState<boolean>(false)
  const [done, setDone] = useState<boolean>(false)


  const handleHolderInputChange = (e: InputEvent) => {
    e.preventDefault();
    
    if (ethers.utils.isAddress(e.target.value) ){ 
      setInputValue(e.target.value)
      setValid(true)
      setSomeMsg('Valid Address') 
      
    }
    else { 
      setInputValue('')
      setValid(false)
      setSomeMsg('Need Valid Address') } 
  }

  const refreshState = () => {
    setTokenIds(undefined)
    setNames(undefined)
    setBambooAmount(0)
  }

  React.useEffect(() => {

    if (inputValue !== '' && inputValue !== holderAddress) {
      setHolderAddress(inputValue)
      refreshState()
    }

    if (tokenIds === undefined && valid) {
      setSomeMsg('None Found')
    }
    if (tokenIds !== undefined) {
      setSomeMsg('Found')
    }
    const startServer = async () => {
      await Moralis.start({
        apiKey: process.env.REACT_APP_MORALIS_API_KEY,
        formatEvmAddress: 'checksum',
        //formatEvmChainId: 'decimal',
        //logLevel: 'verbose'
      })
      setStarted(true)
    }
    if (!started) startServer()
  },[holderAddress, inputValue, started, tokenIds, valid])

  const someInput =     
    <input
      id="holderAdress"
      className="address"
      placeholder="Holder Address"
      value={inputValue}
      onChange={handleHolderInputChange}
      type="text"
    />


  const nftOptions = {
    valid: valid,
    holderAddress: holderAddress,
    tokenIds: tokenIds,
    setTokenIds: setTokenIds,
    setNames: setNames,
    setBambooAmount: setBambooAmount,
    done: done,
    setDone: setDone
  }


  const kardsOptions = {
    done: done,
    bambooAmount: bambooAmount,
    tokenIds: tokenIds,
    names: names,
  }

  return (
    <div className="App">
      <GetNFTs {...nftOptions} />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Hoge Pandas 🐼 - Web Manager</h1>
        {someInput}
        {someMsg}
        <Kards {...kardsOptions} />
      </header>
    </div>
  );
}

export default App;
