let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data;
    var ContractNo = data.xiaoshouhetongbianhao;
    var dept = data.yusuanbumenbianma;
    let auxiliary = ContractNo + "," + dept;
    let func = extrequire("GT99994AT1.api.getWayUrl");
    let funcres = func.execute(null);
    var httpurl = funcres.gatewayUrl;
    let func1 = extrequire("GT99994AT1.frontDesignerFunction.getApiToken");
    let res = func1.execute(null);
    let token = res.access_token;
    let url = httpurl + "/yonbip/fi/api/report/allAuxiliaryBalanceQuery?access_token=" + token;
    let body = {
      accbook_id: "youridHere",
      startperiod: "2022-05",
      endperiod: "2022-10",
      auxiliary: auxiliary,
      startaccsubject: "140601",
      endaccsubject: "140606"
    };
    let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    let apiResponseobj = JSON.parse(apiResponse);
    //本期发生额
    let CurrentamountMoney = 0;
    let result = [];
    if (apiResponseobj.code == "200" && apiResponseobj.data != undefined) {
      let CurrentData = apiResponseobj.data;
      let list = CurrentData.list;
      if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          let dataa = list[i];
          CurrentamountMoney += dataa.currentperiodamt_fc_debit;
        }
      }
    }
    var dataMoney = { CurrentamountMoney: CurrentamountMoney };
    return { dataMoney };
  }
}
exports({ entryPoint: MyAPIHandler });