export interface MessageEncryptor {
    encrypt(content: ArrayBuffer): Promise<ArrayBuffer>;
}