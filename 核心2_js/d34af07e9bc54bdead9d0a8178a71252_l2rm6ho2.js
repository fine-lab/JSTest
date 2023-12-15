let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = request.body;
    let func1 = extrequire("GT27751AT435.backDefaultGroup.getkrytoken");
    let res = func1.execute(request);
    var token = res.access_token;
    //请求数据
    var appKey = request.appKey;
    var shopIdenty = request.shopIdenty;
    var version = request.version;
    var timestamp = request.timestamp;
    let secrectdata = "appKey" + appKey + "shopIdenty" + shopIdenty + "timestamp" + timestamp + "version" + version + "body" + body + token;
    var resdata = SHA256Encode(secrectdata);
    var signature = encodeURIComponent(resdata);
    var base_path = request.url + "?appKey=" + appKey + "&shopIdenty=" + shopIdenty + "&timestamp=" + timestamp + "&version=" + version + "&sign=" + signature;
    var strResponse = postman("post", base_path, JSON.stringify(header), body);
    var responsedata = JSON.parse(strResponse);
    var resres = ObjectStore.insertBatch(request.entiteurl, responsedata.result.items, request.billnum);
    return { resres };
  }
}
exports({ entryPoint: MyAPIHandler });