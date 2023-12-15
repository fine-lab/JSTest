let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var indexid = request.businessKey.indexOf("_");
    var businessKey = request.businessKey.substring(indexid + 1);
    function addMonth(date, months) {
      if (months == undefined || months == "") months = 6;
      var date = new Date(date);
      date.setMonth(date.getMonth() + months);
      return date;
    }
    function format(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    }
    //更新有效期
    var yxqdate = addMonth(new Date(), 6);
    var yxq = format(yxqdate);
    var object2 = { id: businessKey, validDate: yxq };
    var res2 = ObjectStore.updateById("GT30660AT4.GT30660AT4.advisor_cert_pre", object2);
    //实体查询
    var object = { id: businessKey };
    var res = ObjectStore.selectById("GT30660AT4.GT30660AT4.advisor_cert_pre", object);
    var pompBody = {
      yhtUserId: res.creator,
      code: res.code,
      name: res.name,
      idCard: res.idCard,
      certMode: 0,
      certLevel: res.certLevel,
      busiSerial: res.busiSerialSub,
      direction: res.direction,
      productLine: res.productLineCode,
      domain: res.domainCode,
      industry: res.industryCode,
      startTime: format(new Date()),
      endTime: res.validDate //
    };
    //调用第三方接口推送数据
    var resultRes = {};
    var hmd_contenttype = "application/json;charset=UTF-8";
    let token_url = "https://www.example.com/" + res.creator;
    let tokenResponse = postman("get", token_url, null, null);
    var tr = JSON.parse(tokenResponse);
    if (tr.code == "200") {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let pompheader = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      var resultRet = postman("post", "https://www.example.com/", JSON.stringify(pompheader), JSON.stringify(pompBody));
      resultRes = JSON.parse(resultRet);
    }
    return resultRes;
  }
}
exports({ entryPoint: MyAPIHandler });