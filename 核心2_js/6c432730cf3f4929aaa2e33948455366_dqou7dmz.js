let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取租户所在数据中心域名
    let hqym = "https://www.example.com/";
    let apiResponse = openLinker("GET", hqym, "SDOC", JSON.stringify({}));
    let result = JSON.parse(apiResponse);
    //调用接口
    let url = result.data.gatewayUrl + "/yonbip/sd/voucherorder/singleSave";
    //前端函数传的数据
    let data1 = request.data;
    //解析json数据
    let data2 = [];
    let data = [];
    let a;
    for (var d in data1) {
      let value = data1[d];
      let orderDetails = [
        {
          "orderDetailPrices!natSum": value.payment,
          "orderDetailPrices!natMoney": value.payment,
          productId: value.tradevouch_web_userDefine003,
          masterUnitId: "yourIdHere",
          invExchRate: 0,
          unitExchangeTypePrice: 0,
          "orderDetailPrices!oriTax": 0,
          iProductAuxUnitId: "yourIdHere",
          "orderDetailPrices!natUnitPrice": value.payment,
          invPriceExchRate: 1,
          oriSum: value.payment,
          "orderDetailPrices!oriMoney": value.payment,
          priceQty: value.num,
          stockOrgId: value.tradevouch_web_userDefine001,
          iProductUnitId: "yourIdHere",
          "orderDetailPrices!natTaxUnitPrice": value.payment,
          orderProductType: "SALE",
          subQty: value.num,
          consignTime: value.pubts,
          skuId: value.tradevouch_web_userDefine003,
          taxId: "VAT0",
          qty: value.num,
          settlementOrgId: value.tradevouch_web_userDefine001,
          oriTaxUnitPrice: value.payment,
          "orderDetailPrices!natTax": 0,
          unitExchangeType: 0,
          "orderDetailPrices!oriUnitPrice": value.payment,
          _status: "Insert"
        }
      ];
      a = {
        resubmitCheckKey: value.id + "",
        salesOrgId: value.tradevouch_web_userDefine001,
        transactionTypeId: "yourIdHere",
        vouchdate: value.create_time,
        agentId: "yourIdHere",
        settlementOrgId: value.tradevouch_web_userDefine001,
        "orderPrices!currency": "CNY",
        "orderPrices!exchRate": 1,
        "orderPrices!exchangeRateType": "01",
        "orderPrices!natCurrency": "CNY",
        "orderPrices!taxInclusive": true,
        invoiceAgentId: "yourIdHere",
        invoiceUpcType: 0,
        payMoney: value.payment,
        _status: "Insert",
        orderDetails: orderDetails
      };
    }
    let aa = { data: a };
    let resultdata = JSON.stringify(aa);
    let apiResponse2 = openLinker("POST", url, "SDOC", resultdata); //TODO：注意填写应用编码(请看注意事项)
    throw new Error(apiResponse2);
    return { apiResponse2 };
  }
}
exports({ entryPoint: MyAPIHandler });