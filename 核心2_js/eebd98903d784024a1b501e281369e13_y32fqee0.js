let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let getToken = extrequire("AT161E5DFA09D00001.apiFunction.getToken");
    let getTokenResult = getToken.execute();
    let access_token = getTokenResult.access_token;
    let conditionArr = [];
    conditionArr.push({
      field: "id",
      op: "eq",
      value1: request.userId
    });
    let bizUrl = "https://www.example.com/" + access_token;
    let bizHeader = {};
    let bizBody = {
      condition: {
        simpleVOs: conditionArr
      },
      page: {
        pageIndex: 1,
        pageSize: 1
      }
    };
    let userInfo = null;
    let bizStrResponse = postman("post", bizUrl, JSON.stringify(bizHeader), JSON.stringify(bizBody));
    var str = JSON.stringify(bizStrResponse);
    console.log(str);
    let bizResponse = JSON.parse(bizStrResponse);
    let bizRecordList = bizResponse.data.recordList;
    bizRecordList.forEach((record) => {
      userInfo = {
        id: record.id,
        userName: record.userName,
        mobile: record.mobile,
        email: record.email
      };
    });
    return { userInfo };
  }
}
exports({ entryPoint: MyAPIHandler });