
import React, { useState } from 'react';
import Moralis from 'moralis'
import { EvmChain } from '@moralisweb3/evm-utils'
import { ABI, CONTRACT } from './info'


type Props = {
    valid: boolean;
    holderAddress: string;
    tokenIds: Map<number, [any]> | undefined;
    setTokenIds: (val: Map<number, [any]> | undefined) => void;
    setNames: (val: Map<number, [any]> | undefined) => void;
    setBambooAmount: (val: number) => void;
    done: boolean;
    setDone: (val: boolean) => void;
}

export const GetNFTs: React.FC<Props> = ({
    valid,
    holderAddress,
    tokenIds,
    setTokenIds,
    setNames,
    setBambooAmount,
    done,
    setDone
}) => {
    
    const [loading, setLoading] = useState<boolean>(false)
    const [foundIds, setFoundIds] = useState<Map<string, number>>()


    React.useEffect(() => {

        const idMap = new Map<number, [any]>()
        const nameMap = new Map<number, [any]>()

        async function setIds() {
            const foundIds = await getTokenIds()
            setFoundIds(foundIds)
        }
    
        const getTokenIds = async () => {
            if (!valid || tokenIds !== undefined || holderAddress === '') { return }
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
        
        async function getDone(_ids: Map<string, number>) {
            await render(_ids)
        }

        async function render(_ids: Map<string, number>) {
            if (!_ids) { return }
            let count = 0
            for ( let key of _ids.keys()) {
                console.log(key)
                await getData(key, "getTokenData")
                await getData(key, "getTokenName")
                if (++count === _ids.size){
                    setDone(true)
                }
            }
        }
        
        const getData = async (_id:string, _functionName:string) => {
            if (!_id) {return}
            const options = {
                address: CONTRACT,
                chain: EvmChain.POLYGON,
                functionName: _functionName,
                abi: ABI,
                params: { nft_id: _id }
            }
            const response = await Moralis.EvmApi.utils.runContractFunction(options);
            const rr = response.result
            console.log(rr)
            if (rr.slice(-5) !== '.json') {
                nameMap.set(parseInt(_id), [rr])
                setNames(nameMap)
            }else {
                goFetch(parseInt(_id), rr)
            }
        }
    
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


        if (tokenIds === undefined && !loading) setFoundIds(undefined)
        if (!loading && valid && foundIds === undefined) {
            setIds() 
            setDone(false)
        }
        if (foundIds !== undefined && !loading && !done) {
            setLoading(true)
            getDone(foundIds)
        }
        if (done && tokenIds !== undefined) {
            setLoading(false)
            console.log('Done Loading.')
        }

    },[loading, done, foundIds, setNames, setTokenIds, setBambooAmount, valid, holderAddress, tokenIds, setDone])

    return <></>
}

export default GetNFTs
