import { Store } from "../Store";
import { Action } from "../Action";
import { LocalAppendOnlyLogService } from "../../append-only-log/LocalAppendOnlyLogService";
import { MessageEncoder } from "../../message-encoding/MessageEncoder";

export enum NotesActionNames {
    TakeNote = "TakeNote"
}

export class TakeNote implements Action {
    readonly type = NotesActionNames.TakeNote;
    constructor(public content: string) {

    }
}

export type NotesActions = TakeNote;

export class NotesActionCreator {
    constructor(private store: Store,
         private localAppendOnlyLogService : LocalAppendOnlyLogService,
         private messageEncoder : MessageEncoder) {

    }
    async takeNote(content: string) {
        let appendOnlyLog = await this.localAppendOnlyLogService.get();
        await appendOnlyLog.addMessage(this.messageEncoder.encodeNote(content));
        this.store.dispatch(new TakeNote(content));
    }
}