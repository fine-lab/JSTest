let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let updateid = request.updateid;
    let bodys = {
      data: {
        resubmitCheckKey: getResubmitCheckKey(),
        id: updateid,
        _status: "Update",
        headDefine: {
          define1: "成功"
        }
      }
    };
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let url = "/yonbip/scm/salesout/single/update";
    let successcount = resopnseQuery(url, bodys);
    function getResubmitCheckKey() {
      let uuids = uuid();
      let resubmitCheckKey = replace(uuids, "-", "");
      return resubmitCheckKey;
    }
    function gettoken() {
      let func1 = extrequire("AT16560C6C08780007.rule.getToken");
      let res = func1.execute(null);
      return res.access_token;
    }
    function getHttpurl() {
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
      return httpurl;
    }
    function resopnseQuery(paramurl, bodys) {
      let header = {
        "Content-Type": "application/json;charset=UTF-8"
      };
      let httpurl = getHttpurl();
      let token = gettoken();
      let url = httpurl + paramurl + "?access_token=" + token;
      let apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.stringify(bodys));
      let singleAduitResult = JSON.parse(apiResponseRes);
      let successcount = 0;
      if (singleAduitResult.code == "200") {
        if (singleAduitResult.hasOwnProperty("data") && singleAduitResult.data.hasOwnProperty("headDefine")) {
          let headDefine = singleAduitResult.data.headDefine;
          if (headDefine.hasOwnProperty("define1")) successcount = "成功" == headDefine.define1 ? 1 : 0;
        }
      }
      return successcount;
    }
    return { successcount };
  }
}
exports({ entryPoint: MyAPIHandler });