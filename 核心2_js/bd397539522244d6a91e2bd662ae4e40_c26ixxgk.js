let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgId = request.orgId;
    //查询【国家地区属性】菜单数据
    //组织单元详情查询获取“描述”字段
    let url = "https://www.example.com/" + orgId;
    let apiResponse = openLinker("GET", url, "AT1590F01809B00007", null);
    let apiResponseRes = JSON.parse(apiResponse);
    if (apiResponseRes.code == "200") {
      let descriptionValue = apiResponseRes.data.description.zh_CN;
      if (descriptionValue == null) {
        throw new Error("对应业务单元【描述】字段为空！");
      } else {
        let returnData = { code: descriptionValue };
        return returnData;
      }
    } else {
      throw new Error(apiResponseRes.message);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });