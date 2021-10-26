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
const getUserPurchase = async (userId) => {
  let startMs = Date.now();
  const total = await client.search({
    index: "data*",
    body: {
      query: {
        constant_score: {
          filter: {
            match: { userId: userId },
          },
        },
      },
      aggs: {
        total: {
          sum: {
            field: "amount",
          },
        },
      },
    },
  });
  if (total.statusCode !== 200) {
    fail++;
    return "Failed";
  } else {
    const result = total.body.aggregations.total.value;
    if (!result) {
      fail++;
      return "Failed";
    } else {
      console.log(
        JSON.stringify({
          userId: userId,
          total: result,
          requestTime: Date.now() - startMs,
        })
      );
      success++;
      return result;
    }
  }
};
let startMs = Date.now();
let totalRequest = 0;
(async () => {
  for (let i = 0; i < process.env.LOOP_TIME; i++) {
    await getUserPurchase(getUserId());
    totalRequest++;
  }
  console.log(
    JSON.stringify({
      totalRequest: totalRequest,
      timeRequest: Date.now() - startMs,
      sucess:success,
      fail:fail
    })
  );
})();
