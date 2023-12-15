let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let header = {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    };
    let partnerKey1 = "6EJC4UA5";
    var s1 = {
      logisticID: "yourIDHere", //response.logisticID,
      logisticCompanyID: "yourIDHere"
    };
    var urlCode1 = UrlEncode(JSON.stringify(s1));
    let signStr1 = JSON.stringify(s1) + partnerKey1;
    var sign1 = MD5Encode(signStr1);
    let url1 = "https://www.example.com/" + urlCode1 + "&sign=" + sign1;
    var strResponse1 = postman("POST", url1, JSON.stringify(header), JSON.stringify(null));
    let response1 = JSON.parse(strResponse1);
    let statusType = response1.orderTraceList[0].steps;
    var country = "";
    var traceType = "";
    var city = "";
    var acceptTime = "";
    var facilityNo = "";
    var remark = "";
    var facilityName = "";
    var a1 = new Array();
    for (var i = 0; i < statusType.length; i++) {
      country = statusType[i].country;
      traceType = statusType[i].traceType;
      city = statusType[i].city;
      acceptTime = statusType[i].acceptTime;
      facilityNo = statusType[i].facilityNo;
      remark = statusType[i].remark;
      facilityName = statusType[i].facilityName;
      let map = "状态 : " + traceType + ", 时间" + acceptTime + "\n" + "快递物流信息 : " + remark + "\n\n";
      a1.push(map);
    }
    return { a1 };
  }
}
exports({ entryPoint: MyAPIHandler });