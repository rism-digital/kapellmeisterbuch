'use_strict';

const fs = require('fs');

const WEB_SERVER_BASE_PATH = '/var/www';

const sshConfig = {
    host: 'server host',
    port: 22,
    username: 'server user',
    passphrase: 'private key passphrase',
    privateKey: fs.readFileSync('/path/to/.ssh/privateKey')
};

const serverAccess = {
    host: 'server host',
    user: 'server user',
    key: {
        location: '/path/to/.ssh/privateKey',
        passphrase: 'private key passphrase'
    }
};

const webApps = {
    frontend: {
        ...serverAccess,
        remotePath: `${WEB_SERVER_BASE_PATH}/frontend/`
    },
    backend: {
        ...serverAccess,
        remotePath: `${WEB_SERVER_BASE_PATH}/backend/`
    },
    dataset: {
        ...serverAccess,
        remotePath: `${WEB_SERVER_BASE_PATH}/backend/dataset/`
    }
};

module.exports = { webApps, sshConfig };