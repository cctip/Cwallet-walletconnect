import { ReactNode } from "react";
import { Connector } from "wagmi";

type signData = {
    data: `0x${string}` | undefined,
    message: string;
    address: string;
    connector: Connector<any, any, any> | undefined;
}

export interface ClientContextProps {
    children: ReactNode | ReactNode[]
}

export interface Modal3ButtonBasic {
    className?: string;
    children?: ReactNode | ReactNode[];
    onError?: (msg: string) => void;
}

export interface Modal3ButtonProps extends Modal3ButtonBasic {
    onSuccess: (params: signData) => void;
    /**提供需要签名的message */
    provideMessage: () => Promise<string>;
}

export interface SendSignConfig {
    data: string;
    gasLimit?: string;
    to: string;
    chainId: number;
}

export interface SignTransactionProps extends Modal3ButtonBasic {
    onSuccess: (data: any) => void;
    sendConfig: SendSignConfig;
}

export interface Modal3SendButtonProps extends Modal3ButtonBasic {
    onSuccess: (transactionHash: string) => void;
    /**提供需要签名的message */
    provideMessage: () => Promise<SendSignConfig>;
}


export interface DisconnectButtonProps extends Modal3ButtonBasic {
    onSuccess?: () => void;
}