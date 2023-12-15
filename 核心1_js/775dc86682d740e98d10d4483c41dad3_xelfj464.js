let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //声明变量开始
    let body = {};
    body.name = "ML测试项目001";
    body.orgId = "yourIdHere";
    body.mamanagerId = "yourIdHere";
    body.projectDate = "2023-06-20";
    //声明数组变量
    body.deliveryList = new Array();
    let deliveryListItem = new Object();
    deliveryListItem.qty = 2;
    deliveryListItem.productCode = "WL-0115";
    //将对象加到数组里面
    body.deliveryList.push(deliveryListItem);
    //声明变量结束
    const rootUrl = "https://c1.yonyoucloud.com";
    let requestUrl = `${rootUrl}/iuap-api-gateway/yonbip/pm/project/saveProject`;
    let requestMethod = "POST";
    let appCode = "AT18558D1E16E8000B";
    let apiResponse = openLinker(requestMethod, requestUrl, appCode, JSON.stringify(body));
    var result = JSON.parse(apiResponse);
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });