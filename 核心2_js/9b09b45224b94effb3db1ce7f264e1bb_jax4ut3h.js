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
    if (request.userId) {
      bodyParam = {
        condition: {
          simpleVOs: [
            {
              field: "id",
              op: "eq",
              value1: request.userId
            }
          ]
        },
        page: {
          pageIndex: 1,
          pageSize: 1
        }
      };
    } else if (request.name) {
      bodyParam = {
        condition: {
          simpleVOs: [
            {
              field: "name",
              op: "eq",
              value1: request.name
            }
          ]
        },
        page: {
          pageIndex: 1,
          pageSize: 1
        }
      };
    } else {
      bodyParam = request.body;
    }
    //查询数据
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + config.config.api_key,
      apicode: config.config.appCode,
      appkey: config.config.appKey
    };
    //获取用户信息
    let url = config.config.YS_API_url_list.getUserMessageUrl + "?access_token=" + access_token;
    let apiResponse = apiman("post", url, JSON.stringify(header), JSON.stringify(bodyParam));
    let data = JSON.parse(apiResponse)["data"]["recordList"][0];
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });