let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 交易类型ID
    const tradeTypeId = request.tradeTypeId;
    if (tradeTypeId) {
      // 获取token
      let functoken = extrequire("GT52668AT9.backDefaultGroup.getOpenApiToken");
      const res = functoken.execute();
      // 查询交易类型
      if (res && res.access_token) {
        const token = res.access_token;
        const hmd_contenttype = "application/json;charset=UTF-8";
        const header = {
          "Content-Type": hmd_contenttype
        };
        const base_path = "https://www.example.com/";
        const apiResponse = postman("get", base_path.concat("?access_token=" + token).concat("&id=" + tradeTypeId), JSON.stringify(header));
        const obj = JSON.parse(apiResponse);
        if (obj && obj.code == "200") {
          return { name: obj.data.name.zh_CN };
        }
      }
    }
    // 如果没有获取到tradeTypeId，或者查询交流类型名称失败，返回空json
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });