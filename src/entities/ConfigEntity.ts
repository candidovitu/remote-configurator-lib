import { EventEmitter } from 'events';

import { ConnectionEntity } from './ConnectionEntity';

import { ConfiguratorService } from '../services/ConfiguratorService';

import { ErrorEvent } from '../interfaces/EventInterface';

export class ConfigEntity extends EventEmitter {
    key: string;
    namespace: string;

    connection?: ConnectionEntity;
    
    configuratorService: ConfiguratorService;

    on(event: 'connect', listener: () => any): any;
    on(event: 'update', listener: (data: any) => any): any;
    on(event: 'error', listener: (error: ErrorEvent) => any): any;

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    constructor(key: string, namespace: string) {
        super();

        this.key = key;
        this.namespace = namespace;
    }

    setConnection(connection: ConnectionEntity): ConfigEntity {
        this.connection = connection;
        this.configuratorService = new ConfiguratorService(connection);
        
        return this;
    }

    initialize(): ConfigEntity {
        if(!this.connection) throw new Error('Call Config#setConnection before initialize!');

        this.connection.connect(this);

        return this;
    }
    
    getData(): Promise<any> {
        return this.configuratorService.getConfigData(this.namespace, this.key);
    }
}