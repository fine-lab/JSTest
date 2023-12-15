let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function filterTime(time) {
      const date = new Date(time);
      const Y = date.getFullYear();
      const M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      const D = date.getDate();
      return Y + "-" + M + "-" + D;
    }
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let body = {
      billCode: "73100030476136"
    };
    let track = {
      data: JSON.stringify(body) + "fb33d41b74820add039bfe051c09b0be"
    };
    let url = "http://123.57.144.10:9995/allt/md5AndBase64Enc";
    let md5Response = postman("POST", url, JSON.stringify(header), JSON.stringify(track));
    var sign1 = JSON.parse(md5Response);
    let sign = sign1.msg;
    let timestamp = new Date().getTime();
    //获取中通快递物流轨迹
    let header1 = {
      "Content-Type": "application/json;charset=UTF-8",
      "x-appKey": "0e6193fa003d7ee2a4b87",
      "x-datadigest": sign
    };
    let url1 = "https://www.example.com/";
    let apiResponsesa = postman("POST", url1, JSON.stringify(header1), JSON.stringify(body));
    let apiResponsesaRes = JSON.parse(apiResponsesa);
    let message = "";
    if (apiResponsesaRes.statusCode == "SYS000") {
      let datas = apiResponsesaRes.result;
      if (datas.length == 0) {
        message = "未查询到中通流程！";
        return { message };
      }
      for (var i = 0; i < datas.length; i++) {
        let data = datas[i];
        let str = "  " + filterTime(data.scanDate) + "  " + data.desc + ";  \n";
        message = message + str;
      }
      return { message };
    } else {
      throw new Error("调用中通路由查询接口异常：statusCode:" + apiResponsesaRes.statusCode + ",message:" + apiResponsesaRes.message);
    }
    return { apiResponsesaRes };
  }
}
exports({ entryPoint: MyAPIHandler });