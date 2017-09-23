function findQuestion(question, qa){
    for(let i = 0; i < qa.length; i++){
        if(qa[i].q === question){
            return true;
        }
    }
    return false;
}

function getAnswer(question, qa){
    for(let i = 0; i < qa.length; i++){
        if(qa[i].q === question){
            return qa[i].a;
        }
    }
    return 0;
}

module.exports.findQuestion = findQuestion;
module.exports.getAnswer = getAnswer;
