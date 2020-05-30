import { Store } from "../Store";
import { Action } from "../lib/Action";
import { LocalAppendOnlyLogService } from "../../append-only-log/LocalAppendOnlyLogService";
import { MessageEncoder } from "../../message-encoding/MessageEncoder";
import { DeviceLinkService } from "../../device-linking/DeviceLinkService";

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
        private localAppendOnlyLogService: LocalAppendOnlyLogService,
        private messageEncoder: MessageEncoder,
        private deviceLinkService: DeviceLinkService) {

    }
    async takeNote(content: string) {
        let appendOnlyLog = await this.localAppendOnlyLogService.getCurrentLog();
        let devices = this.deviceLinkService.getMessageEncryptors();
        for (let d of devices) {
            await appendOnlyLog.addMessage(await this.messageEncoder.encodeNote(content, d));
        }
        this.store.dispatch(new TakeNote(content));
    }
}