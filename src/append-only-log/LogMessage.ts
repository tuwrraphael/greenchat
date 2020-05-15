export class LogMessage {
    constructor(public content: ArrayBuffer,
        public hash: string,
        public previous: string,
        public signature: string,
        public timestamp: number,
        public sequence: number) {
    }
}
