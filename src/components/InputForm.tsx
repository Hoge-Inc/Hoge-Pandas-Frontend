import React, { ChangeEvent } from "react";
import { ethers } from 'ethers'

type InputEvent = ChangeEvent<HTMLInputElement>;

type Props = {
  setValid: (val: boolean) => void;
  setSomeMsg: (val: string) => void;
  holderAddress: string;
  setHolderAddress: (val: string) => void;
  setLoaded: (val: boolean) => void;
  setTokenIds: (val: Map<number, [any]> | undefined) => void;
  setNames: (val: Map<number, [any]> | undefined) => void;
};

const InputForm: React.FC<Props> = ({
  setValid,
  setSomeMsg,
  holderAddress,
  setHolderAddress,
  setLoaded,
  setTokenIds,
  setNames
}) => {
     
  const handleHolderInputChange = async (e: InputEvent) => {
    e.preventDefault();
    refreshState()
    if (ethers.utils.isAddress(e.target.value) ){ 
      setHolderAddress(e.target.value)
      setValid(true)
      setSomeMsg('Valid Address') 
    }
    else { 
      setValid(false)
      setSomeMsg('Need Valid Address') } 
  }

  const refreshState = () => {
    //Needs work
    setHolderAddress('')
    setTokenIds(undefined)
    setNames(undefined)
    setLoaded(false)
}

  return (
    <>
        <input
          id="holderAdress"
          className="address"
          placeholder="Holder Address"
          value={holderAddress}
          onChange={handleHolderInputChange}
          type="text"
        />
    </>
  );
};

export default InputForm;