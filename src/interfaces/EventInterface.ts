export enum CONFIG_EVENT_TYPES {
    UPDATE = 'UPDATE'
}

export interface ErrorEvent {
    message: string;
    error: unknown;
}