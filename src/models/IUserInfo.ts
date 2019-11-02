export interface IUserInfo {
    clientId: string;
    encryptionKey: CryptoKeyPair;
    signingKey: CryptoKeyPair;
}

export interface IApplicationState {
    clients: string[];
    messages: string[];
}