
import React, { useState } from 'react';
import Moralis from 'moralis'
import { EvmChain } from '@moralisweb3/evm-utils'
import { ABI, CONTRACT } from './info'


type Props = {
    valid: boolean;
    holderAddress: string;
    loaded: boolean;
    setLoaded: (val: boolean) => void;
    setTokenIds: (val: Map<number, [any]> | undefined) => void;
    setNames: (val: Map<number, [any]> | undefined) => void;
    setCount: (val: number) => void;
    setBambooAmount: (val: number) => void;
}

export const GetNFTs: React.FC<Props> = ({
    valid,
    holderAddress,
    loaded,
    setLoaded,
    setTokenIds,
    setNames,
    setCount,
    setBambooAmount
}) => {
    const [started, setStarted] = useState<boolean>(false)
    const [go, setGo] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [done, setDone] = useState<boolean>(false)
    const [foundIds, setFoundIds] = useState<Map<string, number>>()
    
    React.useEffect(() => {
        let currentAddress = ''
        const idMap = new Map<number, [any]>()
        const nameMap = new Map<number, [any]>()
        
        const goFetch = (id:number, metadata:string) => {
            fetch(metadata)
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                idMap.set(id, data)
                setTokenIds(idMap) 
            })
            .catch((error) => {
                console.error(error)
                return
            })
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
    
        const getTokenIds = async () => {
            if (!valid) { return }
            const options = {
                address: holderAddress,
                chain: EvmChain.POLYGON,
            }
            const response = await Moralis.EvmApi.nft.getWalletNFTs(options)
            const dataObj = JSON.parse(JSON.stringify(response.result))
            let items = new Map<string, number>()
            await dataObj.forEach((data: any) => {
                if (data.tokenAddress === CONTRACT) {
                    items.set(data.tokenId, data.amount)
                    if (data.tokenId === '0') setBambooAmount(data.amount)
                }
            });
            return items
        }

        async function getDone(ids: Map<string, number>) {
            await render(ids)
        }
        async function setIds() {
            const foundIds = await getTokenIds()
            setFoundIds(foundIds)
        }
        async function render(ids: Map<string, number>) {
            if (!ids) { return }
            let count = 0
            for ( let key of ids.keys()) {
                console.log(key)
                await getData(key, "getTokenData")
                await getData(key, "getTokenName")
                setCount(++count)
                if (count === ids.size){
                    setDone(true)
                }
            }
        }

        const getData = async (id:string, functionName:string) => {
            if (!id) {return}
            const options = {
                address: CONTRACT,
                chain: EvmChain.POLYGON,
                functionName: functionName,
                abi: ABI,
                params: { nft_id: id }
            }
            const response = await Moralis.EvmApi.utils.runContractFunction(options);
            const rr = response.result
            console.log(rr)
            if (rr.slice(-5) !== '.json') {
                nameMap.set(parseInt(id), [rr])
                setNames(nameMap)
            }else {
                goFetch(parseInt(id), rr)
            }
        }

        if (!go){
            startServer()
            setGo(true)
        }
        if (started && !loading && !loaded && valid) {
            setIds() 
        }
        if (foundIds !== undefined && !loading && !loaded && !done) {
            setLoading(true)
            getDone(foundIds)

        }
        if (done && foundIds !== undefined) {
            setLoaded(true)
            setLoading(false)
        }
        if (currentAddress !== holderAddress) {
            
            currentAddress = holderAddress

        }

    },[started, loading, loaded, done, go, setLoaded, foundIds, setNames, setTokenIds, setCount, setBambooAmount, valid, holderAddress])

    return <></>
}

export default GetNFTs
