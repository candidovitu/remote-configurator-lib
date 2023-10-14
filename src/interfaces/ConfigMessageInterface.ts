import { CONFIG_EVENT_TYPES } from './EventInterface';

export interface ConfigMessage {
    type: CONFIG_EVENT_TYPES;
    config: Config;
}

export interface Config {
    namespace: string;
    key: string;
    data: Object;
    createdAt: Date;
    updatedAt: Date;
}