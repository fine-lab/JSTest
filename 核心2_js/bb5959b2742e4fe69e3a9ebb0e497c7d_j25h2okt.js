let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 数据源
    let Data = param.data[0];
    // 组织id
    let orgId = Data.orgId;
    // 组织名称
    let orgId_name = Data.orgId_name;
    // 客户分类名称
    let nameList = Data.name;
    let name = nameList.zh_CN;
    let code = Data.code;
    let id = Data.id;
    let jsonBody = {
      custCategoryCode: code,
      custCategoryName: name,
      id: id,
      orgId: orgId,
      orgName: orgId_name,
      _status: "Delete"
    };
    let body = {
      appCode: "beiwei-base-data",
      appApiCode: "standard.customer.category.sync",
      schemeCode: "beiwei_bd",
      jsonBody: jsonBody
    };
    let header = { key: "yourkeyHere" };
    let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(body));
    let str = JSON.parse(strResponse);
    if (str.success != true) {
      throw new Error(str.errorMessage);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });