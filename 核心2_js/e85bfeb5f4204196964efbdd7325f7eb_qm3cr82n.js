let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param = request.param;
    let url = request.url;
    // 获取token 代码
    // 获取token 代码
    let tokenfunc = extrequire("GT72125AT241.backDefaultGroup.getOpenApiToken");
    let tokenrest = tokenfunc.execute();
    var accesstoken = tokenrest.access_token;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    let base_path = url;
    // 请求数据
    var jsonstr = JSON.stringify(param);
    let apiResponse = postman("post", base_path.concat("?access_token=" + accesstoken), JSON.stringify(header), jsonstr);
    var responesobj = JSON.parse(apiResponse);
    var responesStr = JSON.stringify(responesobj, null, 2);
    return { data: responesStr };
  }
}
exports({ entryPoint: MyAPIHandler });