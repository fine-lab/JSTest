let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //发送人
    var username = JSON.parse(AppContext()).currentUser.name;
    //有效性后端链接
    var EffiveAPI = "AT179D04BE0940000B.frontDesignerFunction.getEffive";
    //接口地址后端链接
    var HttpsAPI = "AT179D04BE0940000B.frontDesignerFunction.getHttps";
    //解析后勤策后端链接
    var ZEQCHttpAPI = "AT179D04BE0940000B.frontDesignerFunction.getZEQCHttp";
    var header = {
      "Content-Type": "application/json"
    };
    try {
      var soid = param.data[0].id;
      var url = "https://www.example.com/" + soid + "";
      var apiResponse = openLinker("GET", url, "ST", JSON.stringify({}));
      var retapiResponse = JSON.parse(apiResponse);
      if (retapiResponse.code == "200") {
        if (retapiResponse.data != undefined) {
          var sodata = retapiResponse.data;
          if (sodata.accountOrg == 1899113867352320 || sodata.salesOrgId_code == 2830809192386816) {
            var funAPI12 = extrequire(EffiveAPI);
            var resAPI12 = funAPI12.execute("API12");
            if (resAPI12.r) {
              var srcno = "";
              srcno = sodata.srcBillNO;
              sodata.details.forEach((row) => {
                if (srcno != "" && srcno != undefined) {
                  srcno = row.upcode;
                }
              });
              var qcinsert = {
                sent_no: srcno
              };
              if (srcno == "") {
                throw new Error("勤策接口:订单号为空");
              }
              var funhttp12 = extrequire(HttpsAPI);
              var reshttp12 = funhttp12.execute("HttpAPI12");
              var http12 = reshttp12.http;
              //获取顺丰接口1地址
              var funhttpqc12 = extrequire(ZEQCHttpAPI);
              var reshttpqc12 = funhttpqc12.execute(http12, qcinsert);
              var getdizhi = reshttpqc12.di;
              //调用勤策接口1
              var apiResponse12 = postman("post", getdizhi, JSON.stringify(header), JSON.stringify(qcinsert));
              var apiResponsejson12 = JSON.parse(apiResponse12);
              if (apiResponsejson12.return_code == "0") {
              } else {
                throw new Error("勤策接口:" + sodata.code + apiResponsejson12.return_msg);
              }
            }
          }
        }
      } else {
        throw new Error(retapiResponse.message);
      }
    } catch (e) {
      throw new Error(e);
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});