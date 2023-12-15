let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let bankaccbasCode = request.bankaccbasCode;
    let org = request.org;
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      pageIndex: 1,
      pageSize: 100,
      code: bankaccbasCode
    };
    let bankaccbas = -1;
    var bankaccbasResp = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let bankaccbasResJson = JSON.parse(bankaccbasResp);
    if ("200" === bankaccbasResJson.code && bankaccbasResJson.data.recordList.length === 1) {
      bankaccbas = bankaccbasResJson.data.recordList[0];
    } else if ("200" === bankaccbasResJson.code && bankaccbasResJson.data.recordList.length > 1) {
      let recordList = bankaccbasResJson.data.recordList;
      for (let bank of recordList) {
        if (bankaccbasCode === bank.code) {
          bankaccbas = bank;
        }
      }
    }
    return { bankaccbas };
  }
}
exports({ entryPoint: MyAPIHandler });