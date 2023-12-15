let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(accounting_period, xmCode) {
    let func = extrequire("GT99994AT1.api.getWayUrl");
    let funcres = func.execute(null);
    var httpurl = funcres.gatewayUrl;
    let func1 = extrequire("GT99994AT1.frontDesignerFunction.getApiToken");
    let res = func1.execute(null);
    let token = res.access_token;
    let getBalanceUrl = httpurl + "/yonbip/fi/api/report/allAuxiliaryBalanceQuery?access_token=" + token;
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    let resultList = [];
    let page = 1;
    let balancebody = {
      //账簿固定测试
      accbook_id: "youridHere",
      startperiod: accounting_period,
      endperiod: accounting_period,
      startaccsubject: "140601",
      endaccsubject: "140605",
      page: 1,
      pageSize: 200
    };
    //期末余额
    let BalanceMoney = 0;
    //本期发生额
    let CurrentamountMoney = 0;
    let isEnd = true;
    while (true) {
      let BalanceResponse = postman("POST", getBalanceUrl, JSON.stringify(header), JSON.stringify(balancebody));
      let Balanceresponseobj = JSON.parse(BalanceResponse);
      let result = [];
      if ("200" == Balanceresponseobj.code) {
        let BalanceRst = Balanceresponseobj.data;
        let list = BalanceRst.list;
        resultList.push(list);
        let pages = parseInt((BalanceRst.total + 200 - 1) / 200);
        if (balancebody.page < pages) {
          balancebody.page += 1;
        } else {
          isEnd = false;
        }
      }
    }
    return { resultList };
    if (resultList.length > 0) {
      for (var i = 0; i < list.length; i++) {
        let data = list[i];
        let axiliaryItems = data.axiliaryItems;
        if (axiliaryItems.length > 0) {
          for (var j = 0; j < axiliaryItems.length; j++) {
            let Items = axiliaryItems[j];
            if (Items.axiliaryCode == "0002") {
              if (Items.items.project_code == xmCode) {
                BalanceMoney += data.closingbalance_oc_debit;
                CurrentamountMoney += data.currentperiodamt_fc_debit;
              }
            }
          }
        }
      }
    }
    var dataMoney = {
      BalanceMoney: BalanceMoney,
      CurrentamountMoney: CurrentamountMoney
    };
    return { dataMoney };
  }
}
exports({ entryPoint: MyAPIHandler });