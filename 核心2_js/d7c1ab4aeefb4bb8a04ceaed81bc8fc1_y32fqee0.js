let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let getToken = extrequire("AT161E5DFA09D00001.apiFunction.getToken");
    let getTokenResult = getToken.execute();
    let access_token = getTokenResult.access_token;
    let url = "https://www.example.com/" + access_token;
    let header = {};
    let body = {
      roleId: request.roleId,
      pageNumber: 1,
      pageSize: 99999
    };
    let strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let Response = JSON.parse(strResponse);
    var str = JSON.stringify(Response);
    console.log("str", str);
    let list = Response.data.list;
    let conditionArr = [];
    list.forEach((item) => {
      // 邮箱地址被加密情况
      if (item.email) {
        conditionArr.push({
          field: "id",
          op: "eq",
          value1: item.id
        });
      }
    });
    let bizUrl = "https://www.example.com/" + access_token;
    let bizHeader = {};
    let bizBody = {
      condition: {
        simpleVOs: conditionArr
      },
      page: {
        pageIndex: 1,
        pageSize: 99999
      }
    };
    let userList = [];
    let bizStrResponse = postman("post", bizUrl, JSON.stringify(bizHeader), JSON.stringify(bizBody));
    let bizResponse = JSON.parse(bizStrResponse);
    var str2 = JSON.stringify(bizResponse);
    console.log("str2", str2);
    let bizRecordList = bizResponse.data.recordList;
    bizRecordList.forEach((record) => {
      userList.push({
        id: record.id,
        userName: record.userName,
        mobile: record.mobile,
        email: record.email
      });
    });
    return { userList };
  }
}
exports({ entryPoint: MyAPIHandler });