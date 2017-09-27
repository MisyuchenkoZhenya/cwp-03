const net = require('net');
const fs = require('fs');
const fs_extra = require("fs-extra");
const path = require('path');
const uid = require('uid');
const logOut = require('./helpers/path_creater');
const sh = require('./helpers/server_helper');
const port = 8124;
const defaultPath = process.env.DEFAULT_PATH = fs.realpathSync('') + '\\clientFiles\\';
const IP = '127.0.0.1';

let qa = readJson();

const Incoming = {
    'NONE': (client, pathToLog) => {},

    'QA': (client, pathToLog) => {
        fs.writeFileSync(pathToLog, '');
        LogQA(pathToLog, `Client with id ${client.id} connected`);
        client.current_state = modes['QA'];
        client.write('ACK');
    },

    'FILES': (client, pathToLog) => {
        sh.checkFileDirectory(defaultPath);
        client.current_state = modes['FILES'];
        client.write('ACK');
    },

    'DEC': (client, pathToLog) => {
        client.write('DEC');
    },
};

const modes = {
    'NONE': 0,
    'QA': 1,
    'FILES': 2,
}

const server = net.createServer((client) => {
    client.id = uid();
    client.current_state = modes['NONE'];
    client.setEncoding('utf8');
    const pathToLog = logOut.getLogPath(client, fs.realpathSync(''));

    client.on('data', (data) => {
        if(data in Incoming){
            client.current_state = modes['NONE'];
            Incoming[data](client, pathToLog);
        }
        else if(client.current_state === modes['QA']){
            sendAnswer(pathToLog, client, data, qa);
        }
        else if(client.current_state === modes['FILES']){
            sh.createNewFile(client, data, defaultPath);
        }
        else{
            console.log('Unknown command');
            client.write('DEC');
        }
    });

    client.on('end', () => {
        LogQA(pathToLog, `Client disconnected`)
    });
});

server.listen({host: IP, port: port, exclusive: true},  () => {
    console.log(`Server listening on localhost: ${port}`);
});

function LogQA(pathToLog, message) {
    date = new Date();
    if (fs.existsSync(pathToLog)){
        fs.appendFile(pathToLog, 
                      date.getHours() + ':' + date.getMinutes() + ':' + 
                      date.getSeconds() + ' - ' + message + '\n', 
                      (err) => {
            if(err){
                console.err(err.toString());
            }
        });
    }
}

function readJson(){
    let data = JSON.parse(fs.readFileSync('qa.json'));
    return data['QA'];
}

function sendAnswer(pathToLog, client, question, qa){
    let answer = '';

    const rand = Math.floor(Math.random() * (qa.length));
    answer = rand % 2 === 0 ? sh.getAnswer(question, qa) : qa[rand].a;
    
    LogQA(pathToLog, `Qestion: ${question}` + '\n\t\t' + `Answer: ${answer}`);
    client.write(answer);
}
