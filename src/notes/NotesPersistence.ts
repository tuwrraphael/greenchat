import { Note } from "./Note";
export interface NotesPersistence {
    storeNote(note: Note): Promise<void>;
    getAllNotes(): Promise<Note[]>;
}
