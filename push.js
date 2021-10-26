const { Client } = require("@elastic/elasticsearch");
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const {
  getRandomDate,
  convertExcelToJson,
  getRandomNum,
  getUserId,
  getEvent
} = require("./helpers/helper");
const client = new Client({
  node: process.env.HOST.toString(),
});
const host = process.env.HOST || "localhost";
let data = convertExcelToJson("./data/VTP-Actions.xlsx");
async function push() {
    const _id = await getRandomNum(1, 38);
    const _index= await data.find(i => i.ID===_id);
    const current = new Date();
    current.setMonth(current.getMonth() - 3);
    const indexName=`data-2021-${getRandomDate(current, new Date()).getMonth()}-${getRandomDate(current, new Date()).getDate()}`;
    await client.index({
      index: indexName,
      id: uuidv4(),
      body: {
        action: _index.Type,
        name: _index.EventShort,
        type: _index.Type,
        userId: Math.floor(Math.random() + _index.UserId).toString(),
        transactionId: uuidv4(),
        amount: Math.random(),
        createdDate: new Date(),
        description: _index.Event,
        note1: `${_index.Event}-${uuidv4()}`,
        note2: `${uuidv4()}-${_index.Event}`,
      },
    });
    console.log(`Pushed index: ${indexName}`)
}

getUserPurchase(getUserId());
setInterval(()=>{
  push();
},10);

