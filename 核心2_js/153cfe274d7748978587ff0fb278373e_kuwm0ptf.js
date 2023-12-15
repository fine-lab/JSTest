let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //下推数据到另一个api
    var ysresults = request.data;
    var nowdate = request.date1;
    //获取token
    let func1 = extrequire("st.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    //下推应收事项url
    var reqoraurl = "https://www.example.com/" + token;
    //修改销售出库数据状态url
    var xsckurl = "https://www.example.com/" + token;
    //查询销售出库详情url
    var xsxqurl = "https://www.example.com/" + token + "&id=";
    //传输数据类型
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    ysresults.forEach((ysresult) => {
      //拼接参数
      var body = {
        currency: ysresult.currency,
        accentity: ysresult.accountOrg,
        vouchdate: nowdate,
        billtype: 2,
        basebilltype_code: "arap_oar",
        customer: ysresult.cust,
        tradetype_code: "arap_oar_other",
        exchRate: ysresult.exchRate,
        exchangeRateType_code: "01",
        oriSum: ysresult.oriSum,
        natSum: ysresult.natSum,
        invoicetype: 1,
        oriMoney: ysresult.oriMoney,
        natMoney: ysresult.natMoney,
        _status: "Insert",
        oarDetail: [
          {
            taxRate: ysresult.taxRate,
            oriSum: ysresult.oriSum,
            oriMoney: ysresult.oriMoney,
            natMoney: ysresult.natMoney,
            natSum: ysresult.natSum,
            _status: "Insert"
          }
        ]
      };
      var listbody = {
        data: body
      };
      var strResponse = postman("Post", reqoraurl, JSON.stringify(header), JSON.stringify(listbody));
      var responseObj = JSON.parse(strResponse);
      var data;
      if ("200" == responseObj.code) {
        data = responseObj.data;
        if (data != undefined) {
          //通过接口查询参数
          var queryRes = postman("Get", xsxqurl + ysresult.id, JSON.stringify(header));
          var querybody = JSON.parse(queryRes);
          var xsckbody = querybody.data;
          xsckbody["resubmitCheckKey"] = xsckbody["id"] + "xsck";
          xsckbody["salesoutAccountingMethod"] = "invoiceConfirm";
          xsckbody["_status"] = "Update";
          xsckbody["headDefine!define1"] = "true";
          delete xsckbody.pubts;
          xsckbody.details.forEach((detail) => {
            detail["_status"] = "Update";
            delete detail.pubts;
            detail["stockUnit"] = detail["stockUnitId"];
            delete detail["stockUnitId"];
            if (detail.salesOutsSNs != null) {
              detail.salesOutsSNs.forEach((salesOutsSN) => {
                salesOutsSN["_status"] = "Update";
                delete salesOutsSN.pubts;
              });
            }
          });
          var xsckdata = {
            data: xsckbody
          };
          //修改状态
          var strResponse = postman("Post", xsckurl, JSON.stringify(header), JSON.stringify(xsckdata));
          var responseObj = JSON.parse(strResponse);
          message = responseObj.message;
        }
      }
    });
    return { message: message };
  }
}
exports({ entryPoint: MyAPIHandler });