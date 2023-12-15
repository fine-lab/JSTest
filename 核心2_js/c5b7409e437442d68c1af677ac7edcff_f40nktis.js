let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let header = {};
    let apiResponse = postman("GET", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    apiResponse = JSON.parse(apiResponse);
    throw new Error("------" + JSON.stringify(apiResponse) + "------");
    var ywdySql = "select id,code,name from org.func.FinanceOrg";
    var ywdyRes = ObjectStore.queryByYonQL(ywdySql, "ucf-org-center");
    let object = "";
    let payListData = apiResponse.LIST;
    for (var a = 0; a < payListData.length; a++) {
      let receivebillList = "";
      let payXiangqing = payListData[a].oarDetail;
      for (var b = 0; b < payXiangqing.length; b++) {
        let receivebill = {
          taxrate: payXiangqing[b].taxRate,
          orisum: payXiangqing[b].oriSum,
          orimoney: payXiangqing[b].oriMoney,
          natsum: payXiangqing[b].natSum,
          natmoney: payXiangqing[b].natMoney,
          status: payXiangqing[b]._status
        };
        receivebillList = receivebillList + JSON.stringify(receivebill) + ",";
      }
      let orgId = "";
      for (var c = 0; c < ywdyRes.length; c++) {
        if (ywdyRes[c].name == payListData[a].accentity_code) {
          orgId = ywdyRes[c].id;
        }
      }
      let payData = {
        org_id: orgId,
        vouchdate: payListData[a].vouchdate,
        tradetype_code: payListData[a].tradetype_code,
        currency: payListData[a].currency_name,
        customer_code: payListData[a].customer_code,
        exchangeratetype_code: payListData[a].exchangeRateType_code,
        exchrate: payListData[a].exchRate,
        orisum: payListData[a].oriSum,
        natsum: payListData[a].natSum,
        status: payListData[a]._status,
        matterbillList: JSON.parse("[" + receivebillList.substring(0, receivebillList.length - 1) + "]")
      };
      object = object + JSON.stringify(payData) + ",";
    }
    //批量插入
    var res = ObjectStore.insertBatch("AT18EBC24C08E00004.AT18EBC24C08E00004.use_details", JSON.parse("[" + object.substring(0, object.length - 1) + "]"), "yb83804212");
    return {};
  }
}
exports({ entryPoint: MyTrigger });