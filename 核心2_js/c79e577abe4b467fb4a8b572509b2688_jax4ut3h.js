let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configfun = extrequire("AT1672920C08100005.config.baseConfig");
    let config = configfun.execute(request);
    //参数
    let data_id = request.data_id;
    let entry = request.entry;
    let syncState = request.syncState;
    //查询数据
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + config.config.api_key,
      apicode: config.config.appCode,
      appkey: config.config.appKey
    };
    //修改同步状态
    let jdyBody = {
      app_id: config.config.app_id,
      entry_id: entry.entry_id,
      data_id: data_id,
      data: {
        [syncState.fieldName]: {
          value: syncState.val
        }
      }
    };
    //简道云修改数据地址
    let url = config.config.JDY_UpdateUrl;
    let apiResponse = apiman("post", url, JSON.stringify(header), JSON.stringify(jdyBody));
    let data = JSON.parse(apiResponse).data;
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });