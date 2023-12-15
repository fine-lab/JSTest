let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configfun = extrequire("AT1672920C08100005.config.baseConfig");
    let config = configfun.execute(request);
    //参数
    let serialNumber = request.serialNumber;
    let bodyParam = {
      pageIndex: 1,
      pageSize: 10,
      code: request.code,
      name: request.name
    };
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
      throw new Error("单号:" + serialNumber + ",银行编码:" + request.code + ",银行名称:" + request.name + ",没有查到企业银行账户信息!");
    } else {
      data = recordList[0];
    }
    return data;
  }
}
exports({ entryPoint: MyAPIHandler });