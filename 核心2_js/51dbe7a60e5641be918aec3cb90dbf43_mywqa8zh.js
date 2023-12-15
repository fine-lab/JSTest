let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
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
    let func1 = extrequire("ST.frontDesignerFunction.token");
    let res = func1.execute(null);
    let token = res.access_token;
    let url = httpurl + "/yonbip/scm/salesout/single/update?access_token=" + token;
    let body = {
      data: {
        resubmitCheckKey: replace(uuid(), "-", ""),
        id: param.id,
        _status: "Update",
        headDefine: {
          id: param.id,
          _status: "Update",
          define1: param.kdh
        }
      }
    };
    let apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponseRes };
  }
}
exports({ entryPoint: MyTrigger });