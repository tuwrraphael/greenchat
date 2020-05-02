export async function digestMessage(beforeHash: string, content: ArrayBuffer, timestamp: number) {
    let encoder = new TextEncoder();
    let encoded = encoder.encode(`${timestamp}.${beforeHash}`);
    let uint8ArrayView = new Uint8Array(content);
    let mergedArray = new Uint8Array(encoded.length + uint8ArrayView.length);
    mergedArray.set(encoded);
    mergedArray.set(uint8ArrayView, encoded.length);
    let digest = await crypto.subtle.digest("SHA-256", encoded);
    return {
        encodedContent: encoded,
        digest: digest
    };
}
