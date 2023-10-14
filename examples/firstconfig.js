const RemoteConfigurator = require('../dist');

const ACCESS_KEY = 'f256cc9eac836e73dafa15f7';
const SECRET_KEY = '675764b8278bea4d0d38aa81426cf2f0a92f5764ab4aa76370f82e8e0845644cc01e8041e9115b2281be0656c90f7cd3a6e98293baca8d69ac1c8ab7aec6e4836eb604b41e18b4a2'

// Create the Connection object
const connection = new RemoteConfigurator.Connection('127.0.0.1:3000', {
    accessKey: '',
    secretKey: ''
}, {
    reconnectInterval: 1000,
    tls: false
});

// Create the Config object
const firstConfig = new RemoteConfigurator.Config('brasileirao', 'flamengo')
.setConnection(connection) // set config connection
.initialize(); // intialize config

firstConfig.on('connect', () => console.log('firstConfig connected!'));

firstConfig.on('update', data => console.log('firstConfig has a new update:', data));

firstConfig.on('error', error => console.log('firstConfig error!!!!', error));

const getFirstConfigData = async () => {
    try {
        const data = await firstConfig.getData(); // fetch config data (good for first app initialization)
        console.log('firstConfig data:', data);
    } catch (error) {
        console.log('Failed to get firstConfig data!', error);
    }
}

getFirstConfigData();