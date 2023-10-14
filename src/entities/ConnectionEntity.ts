import WebSocket from 'ws';

import { ConfigEntity } from './ConfigEntity';

interface AuthParam {
    /**
    * @description Credential access key
    */
    accessKey: string;
    /**
    * @description Credential secret key
    */
    secretKey: string;
}

interface OptionsParam {
    /**
    * @description Interval between socket reconnection tries, when lost connection with server 
    */
    reconnectInterval?: number;
    /**
    * @description Use TLS protocols (https and wss)
    */
    tls?: boolean;
}

/**
 * This is the ConnectionEntity class.
 * @class
*/
export class ConnectionEntity {
    address: string;

    accessKey: string;
    secretKey: string;

    reconnectInterval: number;

    tls: boolean;

    headers: {
        Authorization: string;
    }

    private ws: WebSocket;

    /**
    * @param {string} address Server address without protocols (example: myserver.com)
    * @param {AuthParam} auth Credential data
    * @param {OptionsParam} options Connection options (Optional)
    * @example
    * new Config('myserver.com', {
    *   accessKey: 'hello',
    *   secretKey: 'world'
    * });
    */
    constructor(address: string, auth: AuthParam, options?: OptionsParam) {
        this.address = address;
        this.accessKey = auth.accessKey;
        this.secretKey = auth.secretKey;

        this.reconnectInterval = options?.reconnectInterval ?? 5000;

        this.tls = options?.tls ?? false;

        this.headers = {
            Authorization: `Credential ${Buffer.from(`${auth.accessKey}:${auth.secretKey}`).toString('base64')}`
        }
    }

    connect(config: ConfigEntity) {
        const connectionUrl = `${this.tls ? 'wss' : 'ws'}://${this.address}/config/${config.namespace}/${config.key}`;

        this.ws = new WebSocket(connectionUrl, {
            headers: this.headers
        });

        this.ws.on('open', () => config.emit('connect'));

        this.ws.on('close', () => {
            config.emit('error', {
                message: 'Config connection closed'
            });

            this.reconnect(config);
        });

        this.ws.on('error', error => {
            config.emit('error', {
                message: 'Config connection error',
                error
            });
        });

        this.ws.on('message', message => this.handleMessage(config, message.toString('utf-8')));
    }

    private handleMessage(config: ConfigEntity, message: string) {
        try {
            const { config: { data } } = JSON.parse(message);

            config.emit('update', data);
        } catch (error: unknown) {
            config.emit('error', {
                message: 'Failed to emit config update event',
                error
            });
        }
    }

    private reconnect(config: ConfigEntity) {
        setTimeout(() => 
            this.connect(config),
            this.reconnectInterval
        );
    }
}