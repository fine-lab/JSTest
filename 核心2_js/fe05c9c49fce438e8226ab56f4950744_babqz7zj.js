let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(request) {
    let orgId = request.orgId;
    let getApiPreAndApp = extrequire("Iyd1.backDesignerFunction.getApiPreAndApp").execute();
    let res = func1.execute(param1, param2);
    let url = getApiPreAndApp.openApiDomain + "/yonbip/uspace/org/child_list?orgId=" + orgId; //传参要写到这里
    let apiResponse = openLinker("GET", url, getApiPreAndApp.appCode, JSON.stringify({})); //TODO:注意填写应用编码（请看注意事项）；最后一个参数填写{}即可，不需要改动
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });