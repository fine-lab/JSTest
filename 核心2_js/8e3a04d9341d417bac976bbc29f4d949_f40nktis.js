let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let header = {};
    let apiResponse = postman("GET", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    apiResponse = JSON.parse(apiResponse);
    var ywdySql = "select id,code,name from org.func.FinanceOrg";
    var ywdyRes = ObjectStore.queryByYonQL(ywdySql, "ucf-org-center");
    let object = "";
    let payListData = apiResponse.LIST;
    for (var a = 0; a < payListData.length; a++) {
      let receivebillList = "";
      let payXiangqing = payListData[a].ReceiveBill_b;
      for (var b = 0; b < payXiangqing.length; b++) {
        let receivebill = {
          quicktype_code: payXiangqing[b].quickType_code,
          orisum: payXiangqing[b].oriSum,
          natsum: payXiangqing[b].natSum,
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
        customer_code: payListData[a].customer_code,
        tradetype_code: payListData[a].tradetype_code,
        currency: payListData[a].currency,
        exchangeratetype_code: payListData[a].exchangeRateType_code,
        exchrate: payListData[a].exchRate,
        orisum: payListData[a].oriSum,
        natsum: payListData[a].natSum,
        status: payListData[a]._status,
        receivebillList: JSON.parse("[" + receivebillList.substring(0, receivebillList.length - 1) + "]")
      };
      object = object + JSON.stringify(payData) + ",";
    }
    //批量插入
    var res = ObjectStore.insertBatch("AT18EBC24C08E00004.AT18EBC24C08E00004.settlement_details", JSON.parse("[" + object.substring(0, object.length - 1) + "]"), "ybcaaeecc0");
    return {};
  }
}
exports({ entryPoint: MyTrigger });