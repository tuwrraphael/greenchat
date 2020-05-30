import { LogMessage } from "./LogMessage";
import { AppendOnlyLogMetadata } from "./AppendOnlyLogMetadata";
import { AppendOnlyLogState } from "./LocalAppendOnlyLogService";

export interface LogPersistence {
    storeAppendOnlyLogState(appendOnlyLogState: AppendOnlyLogState): Promise<void>;
    getAppendOnlyLogState(): Promise<AppendOnlyLogState>;
    createAppendOnlyLog(logId: string, publicKey: CryptoKey, privateKey: CryptoKey): Promise<any>;
    hasAppendOnlyLog(logId: string): Promise<boolean>;
    getLastMessage(logId: string): Promise<LogMessage>;
    storeMessages(logId: string, messages: LogMessage[]): Promise<boolean>;
    getAppendOnlyLog(logId: string): Promise<AppendOnlyLogMetadata>;
    getAll(logId: string): AsyncGenerator<LogMessage, void, unknown>;
}
