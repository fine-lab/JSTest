let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configfun = extrequire("AT1672920C08100005.config.baseConfig");
    let config = configfun.execute(request);
    let JDY_dataListUrl = config.config.JDY_dataListUrl;
    //参数
    let bodyParam = request.body;
    //查询数据
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + config.config.api_key,
      apicode: config.config.appCode,
      appkey: config.config.appKey
    };
    //简道云地址
    let url = JDY_dataListUrl;
    let apiResponse = apiman("post", url, JSON.stringify(header), JSON.stringify(bodyParam));
    let data = JSON.parse(apiResponse).data;
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });