export interface IUserInfo {
    address: string;
    encryptionKey: CryptoKeyPair;
    signingKey: CryptoKeyPair;
}

export interface IApplicationState {
    clients: string[];
    messages: string[];
}