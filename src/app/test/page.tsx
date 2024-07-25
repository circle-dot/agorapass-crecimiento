"use client"
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { type Address, type Hash, createWalletClient, custom } from 'viem'
import { baseSepolia } from 'viem/chains'
import 'viem/window'

const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(window.ethereum!),
})

function Example() {
    const [account, setAccount] = useState<Address>()
    const [signature, setSignature] = useState<Hash>()

    const connect = async () => {
        const [address] = await walletClient.requestAddresses()
        setAccount(address)
    }

    const signTypedData = async () => {
        if (!account) return
        const signature = await walletClient.signTypedData({
            account,
            domain: {
                name: 'EAS',
                version: '1.2.0',
                chainId: 84532,
                verifyingContract: '0x4200000000000000000000000000000000000021'
            },
            types: {
                Attest: [
                    { name: 'schema', type: 'bytes32' },
                    { name: 'recipient', type: 'address' },
                    { name: 'expirationTime', type: 'uint64' },
                    { name: 'revocable', type: 'bool' },
                    { name: 'refUID', type: 'bytes32' },
                    { name: 'data', type: 'bytes' },
                    { name: 'value', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'deadline', type: 'uint64' }
                ]
            },
            primaryType: 'Attest',
            message: {
                schema: schemaUID,
                recipient: recipient,
                expirationTime: 0, // Unix timestamp of when attestation expires (0 for no expiration)
                revocable: true,
                refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
                data: encodedData,
                deadline: 0, // Unix timestamp of when signature expires (0 for no expiration)
                value: 0,
                nonce: nonce
            }
            ,
        })
        setSignature(signature)
    }

    if (account)
        return (
            <>
                <div>Connected: {account}</div>
                <button onClick={signTypedData}>Sign Typed Data</button>
                {signature && <div>Receipt: {signature}</div>}
            </>
        )
    return <button onClick={connect}>Connect Wallet</button>
}

export default Example
