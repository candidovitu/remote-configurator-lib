import axios, { AxiosInstance } from 'axios';

import { ConnectionEntity } from '../entities/ConnectionEntity';

export class ConfiguratorService {
    private instance: AxiosInstance;

    constructor(connection: ConnectionEntity) {
        this.instance = axios.create({
            baseURL: `${connection.tls ? 'wss' : 'ws'}://${connection.address}`,
            headers: connection.headers
        });
    }

    public getConfigData(namespace: string, key: string): Promise<any> {
        return this.instance.get(`/config/${namespace}/${key}`)
        .then(response => response.data)
        .then(({ data }) => data);
    }

}