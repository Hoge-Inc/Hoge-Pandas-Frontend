import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Kards from './components/Kards'
import GetNFTs from './components/GetNFTs'
import InputForm from './components/InputForm'



const App: React.FC = () => {
  const [loaded, setLoaded] = React.useState<boolean>(false)
  const [holderAddress, setHolderAddress] = useState<string>('')
  const [tokenIds, setTokenIds] = useState< Map<number, [any]> >()
  const [names, setNames] = useState< Map<number, [any]> >()
  const [count, setCount] = useState<number>(0)
  const [bambooAmount, setBambooAmount] = useState<number>(0)
  const [someMsg, setSomeMsg] = useState<string>('')
  const [valid, setValid] = useState<boolean>(false)

  React.useEffect(() => {
    if (tokenIds === undefined && valid) {
      setSomeMsg('None Found')
    }
    if (tokenIds !== undefined) {
      setSomeMsg('Found')
    }
  },[tokenIds, valid])

  const nftOptions = {
    valid: valid,
    holderAddress: holderAddress,
    loaded: loaded,
    setLoaded: setLoaded,
    tokenIds: tokenIds,
    setTokenIds: setTokenIds,
    names: names,
    setNames: setNames,
    setCount: setCount,
    setBambooAmount: setBambooAmount
  }

  const inputOptions = {
    setValid: setValid,
    setSomeMsg: setSomeMsg,
    holderAddress: holderAddress,
    setHolderAddress: setHolderAddress,
    setLoaded: setLoaded,
    setTokenIds: setTokenIds,
    setNames: setNames,
  }

  const kardsOptions = {
    bambooAmount: bambooAmount,
    count: count,
    loaded: loaded,
    tokenIds: tokenIds,
    names: names,
  }

  return (
    <div className="App">
      <GetNFTs {...nftOptions} />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Hoge Pandas 🐼 - Web Manager</h1>
        <InputForm {...inputOptions} />
        {someMsg}
        <Kards {...kardsOptions} />
      </header>
    </div>
  );
}

export default App;
