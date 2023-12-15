let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("Idx3.BaseConfig.GetLocAppConfig");
    let res = func1.execute();
    let hostUrl = "https://" + res.config.videoUrl;
    hostUrl += "?videoname" + request.reqParams.videoname;
    hostUrl += "&videourl" + request.reqParams.videourl;
    hostUrl += "&status" + "0";
    hostUrl += "&videotype" + request.reqParams.videotype;
    hostUrl += "&pageIndex" + request.reqParams.pageIndex;
    hostUrl += "&pageSize" + request.reqParams.pageSize;
    //信息体
    let body = {};
    //信息头
    let header = {};
    return { hostUrl };
  }
}
exports({ entryPoint: MyAPIHandler });