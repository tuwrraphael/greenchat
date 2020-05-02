export interface AppendOnlyLogMetadata {
    sequence: number;
    logId: string;
    privateKey: CryptoKey;
    publicKey: CryptoKey;
}
