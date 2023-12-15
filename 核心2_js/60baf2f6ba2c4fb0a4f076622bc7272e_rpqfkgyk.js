//调用
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //使用公共函数
    let configfun = extrequire("IMP_PES.common.getConfig");
    let config = configfun.execute(request);
    //获取公共函数配置的url
    let requrl = config.config.apiurl.setValueDemo;
    //构建请求apiData入参
    var main = new Object();
    //设置入参字段_status为更新
    var apiData = { main };
    //使用openLinker调用开放接口
    var strResponse = openLinker("POST", requrl, "GT8429AT6", apiData);
    var responseObj = JSON.parse(strResponse);
    return {
      responseObj
    };
  }
}
exports({ entryPoint: MyAPIHandler });