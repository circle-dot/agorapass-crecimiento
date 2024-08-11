function truncateWallet(wallet: string) {
    return wallet.slice(0, 6) + '...' + wallet.slice(-4);
}

export default truncateWallet;