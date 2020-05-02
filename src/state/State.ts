import { DeviceLinkStatus } from "../models/DeviceLinkStatus";

export interface NotesSubState {
    notes: string[];
}

export interface DeviceLinkState {
    deviceLinkStatus : DeviceLinkStatus;
    inviteCode : string;
}

export interface State {
    notes: NotesSubState
    deviceLink : DeviceLinkState;
    signallingConnected: boolean;
}
