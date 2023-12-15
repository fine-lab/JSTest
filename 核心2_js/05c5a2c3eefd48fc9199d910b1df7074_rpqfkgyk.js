let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //使用公共函数--------------begin
    let configfun = extrequire("IMP_PES.common.getConfig");
    let config = configfun.execute(request);
    let requrl = config.config.apiurl.salesoutList;
    //使用公共函数--------------end
    var apiData = {
      pageIndex: 1,
      pageSize: 10,
      isSum: false
    };
    var strResponse = openLinker("POST", requrl, "IMP_PES", JSON.stringify(apiData));
    var responseObj = JSON.parse(strResponse);
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });