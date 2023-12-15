let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let url = apiPreAndAppCode.apiPrefix + "/yonbip/scm/stock/QueryCurrentStocksByCondition"; //传参要写到这里
    let apiResponse = openLinker("POST", url, "GT22176AT10", JSON.stringify({})); //TODO:注意填写应用编码（请看注意事项）；最后一个参数填写{}即可，不需要改动
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });