import { useWeb3Modal, useWeb3ModalNetwork } from '@web3modal/react';
import { Modal3SendButtonProps, SendSignConfig } from '../../types';
import assets from "../../lib/assets";
import { FC, memo, useEffect, useState } from 'react'
import styled from 'styled-components';
import {
    useAccount,
    useConnect,
    useSwitchNetwork,
    usePrepareSendTransaction,
    useSendTransaction,
    useWaitForTransaction
} from 'wagmi';
import { utils } from 'ethers';

const defaultConfig = {
    data: "",
    to: "",
    chainId: 1
}

/**
 * wallet connect modal3  签名交易
 * @returns 
 */
const Modal3SendButton: FC<Modal3SendButtonProps> = ({
    className,
    children,
    provideMessage,
    onSuccess,
    onError,
}) => {
    const { open } = useWeb3Modal();
    const { selectedChain } = useWeb3ModalNetwork();
    const { connectAsync, connectors } = useConnect();
    const {
        switchNetworkAsync,
        isLoading: isNetworkLoading
    } = useSwitchNetwork({
        onError(error) {
            ThrowError(error.message);
        },
    })
    const [sign, setSign] = useState<SendSignConfig | null>(null);
    const [connectLoading, setConnectLoading] = useState(false);

    const getTransactionMessage = async () => {
        try {
            const sign = await provideMessage();
            if (selectedChain?.id != sign.chainId) {
                const chain = await switchNetworkAsync?.(sign.chainId);
                if (chain?.id != sign.chainId) throw new ReferenceError("network error");
            }
            setSign(sign);
        }
        catch (err) { ThrowError(err as string) }
    }

    const { isConnected } = useAccount({
        onConnect: () => getTransactionMessage()
    });

    const { config } = usePrepareSendTransaction({
        request: {
            data: utils.hexlify(sign?.data || defaultConfig.data, {
                allowMissingPrefix: true
            }),
            to: sign?.to || defaultConfig.to,
            chainId: sign?.chainId || defaultConfig.chainId
        },
        enabled: isConnected,
    })

    const {
        data: transaction,
        sendTransaction,
    } = useSendTransaction({
        ...config,
        onSettled(data, error) {
            (error && onError) && onError(error.message);
            resetSign();
        },
    });

    useWaitForTransaction({
        hash: transaction?.hash,
        onSuccess(data) {
            onSuccess(data.transactionHash);
        },
        onSettled(data, error) {
            (error && onError) && onError(error.message);
            resetSign();
        },
    })


    useEffect(() => {
        if (!sign) return;
        sendTransaction?.();
    }, [sign])

    /**
     * 
     */
    const connect = async () => {
        setConnectLoading(true);
        try {
            if (!isConnected) {
                const connector = getWalletConnectors();
                let account = "";
                try {
                    account = await connector.getAccount();
                }
                catch (err) {
                    ThrowError(err as string)
                }
                console.log("@@@", account, !account);

                const id = await connector.getChainId();

                !account ?
                    // 未链接
                    open({ route: "ConnectWallet" })
                    :
                    // 已链接但是页面刷新 状态被初始化
                    await connectAsync({ connector, chainId: id })
            }
            else {
                // 已链接直接发起交易
                getTransactionMessage();
            }
        }
        catch (err) {
            ThrowError(err as string)
        }
    }

    /**
     * 抛出错误
     * @param err 
     */
    const ThrowError = (err: string) => {
        setConnectLoading(false);
        onError && onError(err);
    }

    /**
     * 重置签名数据
     */
    const resetSign = () => {
        setSign(null);
        setConnectLoading(false);
    }
    /**
     * 获取wallet connect连接器
     * @returns 
     */
    const getWalletConnectors = () => {
        return connectors.find(item => item.id == "walletConnect") || connectors[0]
    }


    return (
        <>
            <p>
                {`isConnected:${isConnected}`}
            </p>
            <Modal3SendButtonWrap
                disabled={isNetworkLoading || connectLoading}
                className={className}
                onClick={connect}
            >
                {
                    children || <img alt="walletConnect" src={assets.walletconnect} />
                }
            </Modal3SendButtonWrap>
        </>

    )
}

export default memo(Modal3SendButton);

const Modal3SendButtonWrap = styled.button`
        border: none;
        outline: none;
        background-color: #fff;

        &:disabled {
            border: 1px solid #f40;
        }
        
        img {
          width: 28px;
          height: 28px;
          object-fit: cover;
        }
        &:last-of-type {
          margin-right: 0;
        }
`;