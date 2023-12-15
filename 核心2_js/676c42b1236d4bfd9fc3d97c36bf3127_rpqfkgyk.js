let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //使用公共函数
    let configfun = extrequire("IMP_PES.common.getConfig");
    let config = configfun.execute(request);
    //获取公共函数配置的url
    let requrl = config.config.apiurl.updateSaleout;
    //构建请求apiData入参
    var main = new Object();
    //设置入参字段_status为更新
    main._status = "Update";
    //设置入参字段resubmitCheckKey为上游单据ID
    main.resubmitCheckKey = request.params.id;
    main.id = request.params.id;
    //设置入参字段define15为安装工单编号
    let headDefine = {
      id: request.params["headDefine!id"],
      _status: "Update",
      define15: request.params["code"]
    };
    main.headDefine = headDefine;
    var apiData = { data: [main] };
    //使用openLinker调用开放接口
    var strResponse = openLinker("POST", requrl, "IMP_PES", JSON.stringify(apiData));
    var responseObj = JSON.parse(strResponse);
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });