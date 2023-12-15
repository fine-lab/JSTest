let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT13741AT37.api.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var deptId = request;
    var requrl = "https://www.example.com/" + token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    var ybresult = request.data;
    var date1 = request.date1;
    var buyData = new Array();
    ybresult.forEach((data) => {
      let income = data.salemoneysalemoney;
      if ((income = 0)) {
        income = data.vipincomevipincome;
      }
      var body = {
        currency: "G001ZM0000DEFAULTCURRENCT00000000001",
        accentity_code: "0101005",
        vouchdate: date1,
        billtype: 2,
        basebilltype_code: "arap_oar",
        tradetype_code: "arap_oar_other",
        customer_code: "N1005",
        exchRate: 1,
        exchangeRateType_code: "01",
        oriSum: income,
        invoicetype: 1,
        natSum: income,
        orderno: data.dayclosecode,
        caobject: 1,
        oriMoney: income,
        natMoney: income,
        oarDetail: [
          {
            hasDefaultInit: true,
            _status: "Insert",
            oriMoney: income,
            natMoney: income,
            taxRate: 0,
            natSum: income,
            oriSum: income,
            orderno: data.dayclosecode
          }
        ],
        _status: "Insert"
      };
      buyData.push(body);
    });
    var listbody = {
      data: buyData
    };
    var strResponse = postman("Post", requrl, JSON.stringify(header), JSON.stringify(listbody));
    var responseObj = JSON.parse(strResponse);
    var data;
    if ("200" == responseObj.code) {
      data = responseObj.data;
      if (data != undefined) {
        let infos = data.infos;
        infos.forEach((info) => {
          let billcodeno = info.orderno;
          var query_sql = "select id,issendora from GT13741AT37.GT13741AT37.dayclosebill where dayclosecode = '" + billcodeno + "'";
          var query_res = ObjectStore.queryByYonQL(query_sql);
          let closeBillObject = { id: query_res[0].id, issendora: "Y" };
          ObjectStore.updateById("GT13741AT37.GT13741AT37.dayclosebill", closeBillObject);
        });
      }
    }
    return { res: responseObj.message };
  }
}
exports({ entryPoint: MyAPIHandler });