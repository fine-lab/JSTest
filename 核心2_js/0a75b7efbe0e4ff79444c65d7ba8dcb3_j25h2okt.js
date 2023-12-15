let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 数据源
    let Data = param.data[0];
    // 区域编码
    let code = Data.code;
    // 组织id
    let orgid = Data.orgId;
    // 组织名称
    let orgId_name = Data.orgId_name;
    // 区域名称
    let nameList = Data.name;
    let name = nameList.zh_CN;
    let id = Data.id;
    let jsonBody = {
      saleAreaCode: code,
      saleAreaName: name,
      id: id,
      orgId: orgid,
      orgIdName: orgId_name,
      _status: "Delete"
    };
    let body = {
      appCode: "beiwei-base-data",
      appApiCode: "standard.salearea.sync",
      schemeCode: "beiwei_bd",
      jsonBody: jsonBody
    };
    let header = { key: "yourkeyHere" };
    let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyTrigger });