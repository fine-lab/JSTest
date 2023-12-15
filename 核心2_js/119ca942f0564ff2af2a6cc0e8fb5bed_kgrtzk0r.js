let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      //发送人
      var username = JSON.parse(AppContext()).currentUser.name;
      //有效性后端链接
      var EffiveAPI = "AT18DC6E5E09E00008.backDesignerFunction.getEffive";
      //接口地址后端链接
      var HttpsAPI = "AT18DC6E5E09E00008.backDesignerFunction.getHttps";
      //解析后勤策后端链接
      var ZEQCHttpAPI = "AT18DC6E5E09E00008.backDesignerFunction.getZEQCHttp";
      var header = {
        "Content-Type": "application/json"
      };
      var qcdh = {
        cmCode: "ZXMD20230800000010",
        cmName: "",
        distSendNo: "FH20231103000002",
        sendTime: "2023-11-03 10:38:00",
        logNo: "SF1000012345678",
        logState: ""
      };
      var funhttp13 = extrequire(HttpsAPI);
      var reshttp13 = funhttp13.execute("HttpAPI13");
      var http13 = reshttp13.http;
      //获取顺丰接口1地址
      var funhttpqc13 = extrequire(ZEQCHttpAPI);
      var reshttpqc13 = funhttpqc13.execute(http13, qcdh);
      var getdizhi = reshttpqc13.di;
      //调用勤策接口1
      var apiResponse13 = postman("post", getdizhi, JSON.stringify(header), JSON.stringify(qcdh));
      var urllog13 = "https://www.example.com/";
      var bodylog13 = { fasongren: username, SrcJSON: JSON.stringify(qcdh), ToJSON: apiResponse13, Actype: 13 }; //请求参数
      var apiResponselog13 = openLinker("POST", urllog13, "ST", JSON.stringify(bodylog13));
      var apiResponsejson13 = JSON.parse(apiResponse13);
      if (apiResponsejson13.return_code == "0") {
      } else {
        throw new Error("勤策接口:" + apiResponsejson13.return_msg);
      }
    } catch (e) {
      throw new Error(e);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });