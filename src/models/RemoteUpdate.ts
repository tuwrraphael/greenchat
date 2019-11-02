import { Source } from "./Source";
import { Message } from "./Message";
export interface RemoteUpdate {
    messages: Message[];
    sources: Source[];
}
