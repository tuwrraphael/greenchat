import { IUserInfo } from "../models/IUserInfo";
import { generateUserAddress } from "./generate-user-address";

export async function generateIdentity() {
    const encryptionKey = await crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    }, false, ["encrypt", "decrypt"]);
    const signingKey = await crypto.subtle.generateKey({
        name: "RSA-PSS",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
    }, false, ["sign", "verify"]);
    return <IUserInfo>{ encryptionKey, signingKey, address: await generateUserAddress(signingKey) };
}