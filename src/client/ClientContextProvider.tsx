import { FC } from 'react'
import {
    configureChains,
    createClient,
    WagmiConfig
} from "wagmi";
import { bsc, polygon, mainnet, avalanche, arbitrum, goerli } from '@wagmi/chains';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { Web3Modal as Web3ModalComponent } from '@web3modal/react';
import env from '../lib/env';
import { ClientContextProps } from '../types';




const chains = [polygon, bsc, mainnet, avalanche, arbitrum, goerli];


const ClientContextProvider: FC<ClientContextProps> = ({
    children
}) => {
    if (!env.projectId) {
        throw new ReferenceError("project id is not defind!")
    }
    // Wagmi client
    const { provider, webSocketProvider } = configureChains(chains, [
        walletConnectProvider({ projectId: env.projectId }),
    ]);
    const wagmiClient = createClient({
        autoConnect: true,
        connectors: modalConnectors({ appName: "web3Modal", chains }),
        provider,
        webSocketProvider
    });

    const ethereumClient = new EthereumClient(wagmiClient, chains);

    return (
        <>
            <WagmiConfig client={wagmiClient}>
                {children}
            </WagmiConfig>
            <Web3ModalComponent
                projectId={env.projectId}
                ethereumClient={ethereumClient}
            />
        </>

    )
}

export default ClientContextProvider;

