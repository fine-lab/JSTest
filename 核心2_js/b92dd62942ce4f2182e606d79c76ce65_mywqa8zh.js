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
    let httpurl = httpResData.data.gatewayUrl;
    let func1 = extrequire("AT16142F1209C80004.backDesignerFunction.getApiToken");
    let res = func1.execute(null);
    let token = res.access_token;
    let url = httpurl + "/yonbip/digitalModel/salesDelegate/list?access_token=" + token;
    var pageIndex = "1";
    //公有云的客开项目一般不会存在大量的委托关系，如果确实出现了，
    //也不应该递归调用接口去查找默认委托关系，请提交工单接口支持传【是否默认】参数进行过滤
    //此处默认只查找至多100条数据
    var pageSize = "100";
    let body = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      salesOrg: request.param.orgid
    };
    let apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponseRes };
  }
}
exports({ entryPoint: MyAPIHandler });