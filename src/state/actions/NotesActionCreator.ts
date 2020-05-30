import { Store } from "../Store";
import { Action } from "../lib/Action";
import { LocalAppendOnlyLogService } from "../../append-only-log/LocalAppendOnlyLogService";
import { MessageEncoder } from "../../message-encoding/MessageEncoder";
import { DeviceLinkService } from "../../device-linking/DeviceLinkService";
import { Note } from "../../notes/Note";
import { uuid } from "../../utils/uuid";
import { NotesPersistence } from "../../notes/NotesPersistence";

export enum NotesActionNames {
    TakeNote = "TakeNote",
    NotesLoaded = "NotesLoaded"
}

export class TakeNote implements Action {
    readonly type = NotesActionNames.TakeNote;
    constructor(public note: Note) {

    }
}

export class NotesLoaded implements Action {
    readonly type = NotesActionNames.NotesLoaded;
    constructor(public notes: Note[]) {

    }
}


export type NotesActions = TakeNote | NotesLoaded;

export class NotesActionCreator {
    constructor(private store: Store,
        private localAppendOnlyLogService: LocalAppendOnlyLogService,
        private messageEncoder: MessageEncoder,
        private deviceLinkService: DeviceLinkService,
        private notePersistence: NotesPersistence) {

    }
    async takeNote(content: string) {
        let note = new Note();
        note.id = uuid();
        note.content = content;
        let appendOnlyLog = await this.localAppendOnlyLogService.getCurrentLog();
        let devices = this.deviceLinkService.getMessageEncryptors();
        for (let d of devices) {
            await appendOnlyLog.addMessage(await this.messageEncoder.encodeNote(note, d));
        }
        await this.notePersistence.storeNote(note);
        this.store.dispatch(new TakeNote(note));
    }

    async loadNotes() {
        let notes = await this.notePersistence.getAllNotes();
        this.store.dispatch(new NotesLoaded(notes));
    }
}