const net = require('net');
const fs = require('fs');
const path = require('path');
const cf_h = require('./helpers/client-files_helper');
const port = 8124;

const client = new net.Socket();
let dirs, files = [];
client.setEncoding('utf8');

const Incoming = {
    'ACK': () => {
        console.log('Connected');
        dirs = cf_h.getDirsFromArgv(process.argv.slice(2));
        createDialog(client, dirs);
    },

    'NEXT': () => {
        sendFileToServer();
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
    files = cf_h.readFilePaths(dirs);
    sendFileToServer();
    console.log(files);
    client.write('DEC');
}

function sendFileToServer(){
    if(files.length !== 0){

    }
}
