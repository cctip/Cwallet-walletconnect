import { useWeb3Modal, useWeb3ModalNetwork, Web3Button } from '@web3modal/react'
import React, { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchNetwork } from 'wagmi'
import Modal3SendButton from '../components/Modal3SendButton'
import { SendSignConfig } from '../types';
import { bsc, polygon } from "wagmi/chains";
import DisconnectButton from '../components/DisconnectButton';


const Test = () => {
    const { open } = useWeb3Modal();
    const { isConnected, address } = useAccount();
    const { selectedChain, setSelectedChain } = useWeb3ModalNetwork();
    const { data, switchNetworkAsync } = useSwitchNetwork();
    const { connectors, connectAsync, data: connectData } = useConnect();
    const { disconnect } = useDisconnect();

    const getMessage = (): Promise<string> => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res("dadsaxxxxx")
            }, 2000);
        })
    }

    const getSendMessage = (): Promise<SendSignConfig> => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res({
                    data: "5cf0ec8600000000000000000000000000000000000000000000000000000000000000c000000000000000000000000076865e63e9de9b3e78f10d6a8e8e96dd2e8ed8344f9d79daf0486ccec418b6d90ff4015c050bf879a00eadf6f12843d5ae57439c000000000000000000000000000000000000000000000000000000000000001b1d2e18462bfb74060a9827751ad2464e041561f2292cda70fa28e5d299501e23063428f1bb3a95ff06a4213861e169885c5e80319d331abc5e84bd41019d046b000000000000000000000000000000000000000000000000000000000000002049316c50636f67744c424b6e696b363755656133466477704c4447306165624f",
                    to: "0xE07bFfC039996579D7ADBBFeFf2c2A1ae4D27ff4",
                    chainId: 1
                })
            }, 1000);
        })
    }


    return (
        <div>
            {/* <Modal3AuthButton
                provideMessage={getMessage}
                onSuccess={(data) => {
                    console.log(data)
                }}
            >
            </Modal3AuthButton> */}
            <Modal3SendButton
                provideMessage={getSendMessage}
                onSuccess={(data) => {
                    console.log(data)
                }}
                onError={(err) => {
                    console.error(err);
                }}
            />

            <p>--------------------------------</p>
            <DisconnectButton />
            <p>--------------------------------</p>
            {/* {show && <Web3Button />} */}

            <p>--------------------------------</p>

            {
                isConnected ?
                    <>
                        <p>{address}</p>
                        <p>{`${selectedChain?.name} ${selectedChain?.id}`}</p>
                        <p>{`${data?.name} ${data?.id}`}</p>
                        <button onClick={() => {
                            setSelectedChain(bsc)
                        }}>switch network</button>
                        <button onClick={async () => {
                            await switchNetworkAsync?.(bsc.id);
                        }}>async switch network</button>
                        <button onClick={() => {
                            open({
                                route: "SelectNetwork"
                            })
                        }}>swtich network modal</button>
                    </>
                    :
                    <>
                        {
                            connectors.map(connector => (
                                <button
                                    key={connector.id}
                                    onClick={async () => {
                                        console.log(connector)
                                        console.log(connectData)

                                        try {
                                            // const id = await connector.getChainId();
                                            console.log(await connector.getAccount());
                                            // console.log(await connector.connect({ chainId: id }))
                                            // const a = await connectAsync({ connector });
                                            // console.log("account", a)
                                        }
                                        catch (err) {
                                            console.log(err)
                                        }
                                    }}>
                                    {connector.name}
                                </button>
                            ))
                        }
                    </>

            }

        </div>
    )
}

export default Test