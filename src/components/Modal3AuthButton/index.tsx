import { useWeb3Modal } from '@web3modal/react';
import { FC, memo, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi';
import assets from "../../lib/assets";
import styled from "styled-components";
import { Modal3ButtonProps } from '../../types';

/**
 * wallet connect modal3授权按钮
 * @param param0 
 * @returns 
 */
const Modal3AuthButton: FC<Modal3ButtonProps> = ({
    children,
    className,
    onSuccess,
    onError,
    provideMessage,
}) => {
    const { open } = useWeb3Modal();
    const [connectLoading, setConnectLoading] = useState(false);
    const { signMessageAsync } = useSignMessage();
    const signAuthMessage = async () => {
        try {
            const message = await provideMessage();
            const data = await signMessageAsync({
                message
            })
            return {
                data,
                message,
            }
        }
        catch (err) {
            throw new ReferenceError(err as string);
        }
    }

    useAccount({
        async onConnect({
            address, connector
        }) {
            try {
                if (!address) {
                    throw new ReferenceError("address is not defined!")
                }
                const { data, message } = await signAuthMessage();
                onSuccess({
                    data,
                    message,
                    address,
                    connector
                })
            }
            catch (err) {
                onError && onError(err as string);
            }
            finally {
                connector?.disconnect();
                setConnectLoading(false);
            }
        }
    });


    const connect = () => {
        open({
            route: "ConnectWallet"
        })
    }


    return (
        <Modal3ButtonWrap
            disabled={connectLoading}
            className={className}
            onClick={connect}
        >
            {
                children || <img alt="walletConnect" src={assets.walletconnect} />
            }
        </Modal3ButtonWrap>
    )
}

export default memo(Modal3AuthButton);


const Modal3ButtonWrap = styled.button`
        margin-right: 8px;
        border: none;
        background-color: #fff;
        
        img {
          width: 28px;
          height: 28px;
          object-fit: cover;
        }
        &:last-of-type {
          margin-right: 0;
        }
`;