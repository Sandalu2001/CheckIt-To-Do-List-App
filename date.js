module.exports.Date = getDate;

function getDate(){
    var today = new Date();

    var option = {
        year : 'numeric',
        month : 'long',
        day : 'numeric', 
        weekday : 'long'
    }

    var day = today.toLocaleDateString("en-US", option);
    return day;
}



module.exports.Day = getDay;

function getDay(){
    var today = new Date();

    var option = {
        day : 'numeric', 
    }

    var day = today.toLocaleDateString("en-US", option);
    return day;
}




