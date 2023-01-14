import { FC } from 'react'
import styled from 'styled-components';
import { useDisconnect } from 'wagmi';
import { DisconnectButtonProps } from '../../types';

const DisconnectButton: FC<DisconnectButtonProps> = ({
    className,
    onError,
    onSuccess,
    children
}) => {
    const { disconnect } = useDisconnect({
        onSuccess() {
            onSuccess && onSuccess();
        },
        onError(error) {
            onError && onError(error.message);
        },
    });

    return (
        <DisconnectButtonWrap
            onClick={() => disconnect()}
            className={className}
        >
            {
                children || "disconnect"
            }
        </DisconnectButtonWrap >
    )
}

export default DisconnectButton;

const DisconnectButtonWrap = styled.button`

`