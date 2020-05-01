export async function generateUserAddress(signingKey: CryptoKeyPair) {
    const exportedPublicKey = new Uint8Array(await crypto.subtle.exportKey("spki", signingKey.publicKey));
    const modifier = new Uint8Array(16);
    crypto.getRandomValues(modifier);
    const concatenated = new Uint8Array(modifier.length + exportedPublicKey.length);
    concatenated.set(modifier);
    concatenated.set(exportedPublicKey, modifier.length);
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", concatenated));
    console.log(digest.length);
    return btoa(String.fromCharCode(...digest));
}