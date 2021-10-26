const reader = require("xlsx");

function convertExcelToJson(path) {
  var file = reader.readFile(path);
  let data = [];
  const sheets = file.SheetNames;
  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      data.push(res);
    });
  }
  return data;
}

function getRandomDate(start, end){
    return new Date(start.getTime() + Math.random()*(end.getTime() - start.getTime()));
}

function getRandomNum(min,max){
    return Math.floor(Math.random()*(max - min + 1)) + min;
}

const userIds=["2439327","4109700","2304095","288529","8878971","8617637","9625781","429150","534893","2424666"];
function getUserId(){
  return userIds[Math.floor(Math.random()*(userIds.length-1))];
}

const events = [
  "Issue mastercard",
  "Buy voucher success",
  "Use voucher success",
  "Gift voucher success",
  "Try features",
  "Login face id/ finger prints",
  "Register auto payment",
  "Login save",
  "Change avatar",
  "Screenshot Viettelpay",
  "Balance query success",
  "Link money source success",
  "Link bank account success",
  "Other money source payment success",
  "Invite friend",
];
function getEvent() {
  return events[Math.floor(Math.random() * (events.length - 1))];
}
module.exports = { convertExcelToJson, getRandomDate, getRandomNum, getUserId, getEvent };