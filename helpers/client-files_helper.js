const fs = require('fs');

function getDirsFromArgv(dirs){
    if(dirs.length === 0){
        console.log('No path in argv');
    }
    else if(!checkDirsCorrect(dirs)){
        console.log('Wrong path in argv');
        dirs = [];
    }
    return dirs;
}

function checkDirsCorrect(dirs){
    try {
        dirs.forEach((elem) => {
            fs.lstatSync(elem).isDirectory();
        });
        return true;
    } 
    catch (error) {
        return false;
    }
}

module.exports.getDirsFromArgv = getDirsFromArgv;
module.exports.checkDirsCorrect = checkDirsCorrect;
