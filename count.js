const { Client } = require("@elastic/elasticsearch");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const {
  getRandomDate,
  convertExcelToJson,
  getRandomNum,
  getUserId,
  getEvent,
} = require("./helpers/helper");
const client = new Client({
  node: process.env.HOST.toString(),
});
let success=0,fail=0;
let data = convertExcelToJson("./data/VTP-Actions.xlsx");

const countActivity = async (userId, eventName) => {
  let startMs = Date.now();
  const counter = await client.count({
    index: "data*",
    body: {
      query: {
        bool: {
          must: { match: { name: eventName } },
          filter: {
            term: {
              userId: userId,
            },
          },
        },
      },
    },
  });
  if (!counter || counter.statusCode !== 200) {
    fail++;
    return "Failed!";
  } else {
    const result = counter.body.count;
    console.log(
      JSON.stringify({
        payload: {
          userId: userId,
          eventName: eventName,
        },
        result: result,
        requestTime: Date.now() - startMs,
      })
    );
    success++;
    return result;
  }
};
let startMs=Date.now();
let count=0;
(async()=>{
  for (let i = 0; i < process.env.LOOP_TIME; i++) {
    await countActivity(getUserId(), getEvent());
    count++;
  }
  console.log(JSON.stringify({
    totalRequest:count,
    requestTime:Date.now()-startMs,
    sucess:success,
    fail:fail
  }));
})();
