const net = require('net');
const fs = require('fs');
const cf_h = require('./helpers/client-files_helper')
const port = 8124;

const client = new net.Socket();
let dirs;
client.setEncoding('utf8');

const Incoming = {
    'ACK': () => {
        console.log('Connected');
        dirs = cf_h.getDirsFromArgv(process.argv.slice(2));
        createDialog(client, dirs);
    },

    'DEC': () => {
        client.destroy();
    },
};

client.connect({host: '127.0.0.1', port: port}, () => {
    client.write('FILES');
});

client.on('data', (data) => {
    if(data in Incoming){
        Incoming[data]();
    }
    else{
        
    }
});

client.on('close', () => {
    console.log('Connection closed');
});

function createDialog(client, dirs) {
    if(dirs.length !== 0){

        
    }
    client.destroy();
}
