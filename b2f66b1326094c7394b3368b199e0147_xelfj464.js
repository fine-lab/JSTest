let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {}; //声明变量开始
    body.data = new Object();
    body.data.id = "youridHere"; //单据id
    //声明变量结束
    const rootUrl = "https://c1.yonyoucloud.com"; //根路径
    let requestUrl = `${rootUrl}/iuap-api-gateway/yonbip/EFI/paymentApply/delete`; //请求路径
    let requestMethod = "POST"; //请求方式
    let appCode = "AT186F81E417580005";
    let apiResponse = openLinker(requestMethod, requestUrl, appCode, JSON.stringify(body)); //友联接口付款申请单删除
    var result = JSON.parse(apiResponse);
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });