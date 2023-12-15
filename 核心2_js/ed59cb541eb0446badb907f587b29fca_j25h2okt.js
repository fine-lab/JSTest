let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = param.requestData;
    let request = JSON.parse(requestData);
    let _status = request._status;
    if (_status == "Insert") {
      // 数据源
      let Data = param.data[0];
      // 组织id
      let createOrg = Data.createOrg;
      // 组织名称
      let createOrg_name = Data.createOrg_name;
      // 客户类型id
      let transType = Data.transType;
      // 客户类型名称
      let transType_Name = Data.transType_Name;
      // 客户编码
      let code = Data.code;
      // 客户名称
      let nameList = Data.name;
      let name = nameList.zh_CN;
      let id = Data.id;
      // 客户分类id
      let customerClass = Data.customerClass;
      // 客户分类名称
      let customerClass_Name = Data.customerClass_Name;
      // 销售区域id
      let customerArea = Data.customerArea;
      // 销售区域编码
      let customerArea_code = Data.customerArea_code;
      let jsonBody = {
        dealerCode: code,
        dealerName: name,
        id: id,
        createOrg: createOrg,
        createOrg_name: createOrg_name,
        transType: transType,
        transType_Name: transType_Name,
        customerClass: customerClass,
        customerClass_Name: customerClass_Name,
        customerArea: customerArea,
        customerArea_code: customerArea_code,
        _status: "Insert"
      };
      let body = {
        appCode: "beiwei-base-data",
        appApiCode: "standard.dealer.sync",
        schemeCode: "beiwei_bd",
        jsonBody: jsonBody
      };
      let header = { key: "yourkeyHere" };
      let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(body));
      let str = JSON.parse(strResponse);
      if (str.success != true) {
        throw new Error(str.errorMessage);
      }
    } else {
      // 数据源
      let Data = param.data[0];
      // 组织id
      let createOrg = Data.createOrg;
      // 组织名称
      let createOrg_name = Data.createOrg_name;
      // 客户类型id
      let transType = Data.transType;
      // 客户类型名称
      let transType_Name = Data.transType_Name;
      // 客户编码
      let code = Data.code;
      // 客户名称
      let nameList = Data.name;
      let name = nameList.zh_CN;
      let id = Data.id;
      // 客户分类id
      let customerClass = Data.customerClass;
      // 客户分类名称
      let customerClass_Name = Data.customerClass_Name;
      // 销售区域id
      let customerArea = Data.customerArea;
      // 销售区域编码
      let customerArea_code = Data.customerArea_code;
      let jsonBody = {
        dealerCode: code,
        dealerName: name,
        id: id,
        createOrg: createOrg,
        createOrg_name: createOrg_name,
        transType: transType,
        transType_Name: transType_Name,
        customerClass: customerClass,
        customerClass_Name: customerClass_Name,
        customerArea: customerArea,
        customerArea_code: customerArea_code,
        _status: "Update"
      };
      let body = {
        appCode: "beiwei-base-data",
        appApiCode: "standard.dealer.sync",
        schemeCode: "beiwei_bd",
        jsonBody: jsonBody
      };
      let header = { key: "yourkeyHere" };
      let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(body));
      let str = JSON.parse(strResponse);
      if (str.success != true) {
        throw new Error(str.errorMessage);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });