let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configfun = extrequire("AT1672920C08100005.config.baseConfig");
    let tokenFun = extrequire("AT1672920C08100005.publickApi.getOpenApiToken");
    let tokenResult = tokenFun.execute(request);
    let access_token = tokenResult.access_token;
    let config = configfun.execute(request);
    //参数
    let bodyParam;
    if (request.body) {
      bodyParam = request.body;
    } else {
      bodyParam = {
        pageIndex: 1,
        pageSize: 10,
        code: request.code,
        name: request.name,
        mobile: request.mobile
      };
    }
    //单号
    let serialNumber = request.serialNumber;
    //查询数据
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + config.config.api_key,
      apicode: config.config.appCode,
      appkey: config.config.appKey
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1672920C08100005", JSON.stringify(bodyParam));
    let recordList = JSON.parse(apiResponse).data.recordList;
    let data;
    if (recordList.length == 0) {
      throw new Error("单号:" + serialNumber + ",员工编码:" + request.code + ",员工姓名:" + request.name + ",没有查到员工信息!");
    } else {
      data = recordList[0];
    }
    return data;
  }
}
exports({ entryPoint: MyAPIHandler });