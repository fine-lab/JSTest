let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let httpUrl = "https://www.example.com/";
    let httpRes = postman("GET", httpUrl, JSON.stringify(header), JSON.stringify(null));
    let httpResData = JSON.parse(httpRes);
    if (httpResData.code != "00000") {
      throw new Error("获取数据中心信息出错" + httpResData.message);
    }
    let httpurl1 = httpResData.data.gatewayUrl;
    let func1 = extrequire("GT3949AT190.openApi.getToken");
    let res = func1.execute(null);
    let token = res.access_token;
    let url = httpurl1 + "/yonbip/digitalModel/salesDelegate/list?access_token=" + token;
    var pageIndex = "1";
    //公有云的客开项目一般不会存在大量的委托关系，如果确实出现了，
    //也不应该递归调用接口去查找默认委托关系，请提交工单接口支持传【是否默认】参数进行过滤
    //此处默认只查找至多100条数据
    var pageSize = "100";
    let body = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      salesOrg: request.params.orgid
    };
    var salesDelegateDefaultData = null;
    let apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    let apiResponse = JSON.parse(apiResponseRes);
    if (apiResponse.data === undefined || apiResponse.data === null) return;
    if (apiResponse.data.recordCount > 0) {
      for (let index = 0; index < apiResponse.data.recordCount; index++) {
        let currentData = apiResponse.data.recordList[index];
        if (currentData.isDefault == 1) {
          salesDelegateDefaultData = currentData;
          break;
        }
      }
    }
    return { salesDelegateDefaultData };
  }
}
exports({ entryPoint: MyAPIHandler });