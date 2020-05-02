export function toBase64UrlSafe(b: ArrayBuffer) {
    let uint8Array = new Uint8Array(b);
    let start = 0;
    let end = uint8Array.byteLength;

    const base64 = window.btoa(
        String.fromCharCode.apply(null, uint8Array.subarray(start, end)));
    return base64
        .replace(/\=/g, '') // eslint-disable-line no-useless-escape
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}