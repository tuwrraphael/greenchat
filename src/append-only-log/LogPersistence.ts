import { LogMessage } from "./LogMessage";
import { AppendOnlyLogMetadata } from "./AppendOnlyLogMetadata";
export interface LogPersistence {
    createAppendOnlyLog(logId: string, publicKey: CryptoKey, privateKey: CryptoKey): Promise<any>;
    hasAppendOnlyLog(logId: string): Promise<boolean>;
    getLastMessage(logId: string): Promise<LogMessage>;
    storeMessages(logId: string, messages: LogMessage[]): Promise<boolean>;
    getAppendOnlyLog(logId: string): Promise<AppendOnlyLogMetadata>;
    getAll(logId: string): AsyncGenerator<LogMessage, void, unknown>;
}
