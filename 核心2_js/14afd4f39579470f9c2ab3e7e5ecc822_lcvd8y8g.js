let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取租户所在数据中心域名
    let hqym = "https://www.example.com/";
    let apiResponse = openLinker("GET", hqym, "SCMSA", JSON.stringify({}));
    let result = JSON.parse(apiResponse);
    let url = result.data.gatewayUrl + "/yonbip/sd/voucherorder/singleSave";
    //前端函数传的数据
    let data1 = request.data;
    let data2 = [];
    let a;
    let apiResponse2;
    let resultdata;
    for (var d in data1) {
      let orderDetails = [
        {
          "orderDetailPrices!natSum": data1[d]["售价小计"],
          "orderDetailPrices!natMoney": data1[d]["售价小计"],
          productId: data1[d]["sku编码"],
          masterUnitId: "LF01",
          invExchRate: 0,
          unitExchangeTypePrice: 0,
          "orderDetailPrices!oriTax": 0,
          iProductAuxUnitId: "LF01",
          "orderDetailPrices!natUnitPrice": data1[d]["售价"],
          invPriceExchRate: 1,
          oriSum: data1[d]["售价小计"],
          "orderDetailPrices!oriMoney": data1[d]["售价小计"],
          priceQty: data1[d]["数量"],
          stockOrgId: "1010",
          iProductUnitId: "LF01",
          "orderDetailPrices!natTaxUnitPrice": data1[d]["售价"],
          orderProductType: "SALE",
          subQty: data1[d]["数量"],
          consignTime: data1[d]["单据日期"],
          skuId: data1[d]["sku编码"],
          taxId: "VAT0",
          qty: data1[d]["数量"],
          settlementOrgId: data1[d]["销售组织"],
          oriTaxUnitPrice: data1[d]["售价"],
          "orderDetailPrices!natTax": 0,
          unitExchangeType: 0,
          "orderDetailPrices!oriUnitPrice": data1[d]["售价"],
          _status: "Insert"
        }
      ];
      a = {
        resubmitCheckKey: data1[d]["采购单号"],
        salesOrgId: data1[d]["销售组织"],
        transactionTypeId: data1[d]["交易类型"],
        vouchdate: data1[d]["单据日期"],
        agentId: data1[d]["客户"],
        settlementOrgId: data1[d]["销售组织"],
        corpContact: data1[d]["销售业务员"],
        saleDepartmentId: data1[d]["销售部门"],
        "orderPrices!currency": data1[d]["本币"],
        "orderPrices!exchRate": 1,
        "orderPrices!exchangeRateType": "01",
        "orderPrices!natCurrency": data1[d]["本币"],
        "orderPrices!taxInclusive": true,
        invoiceAgentId: data1[d]["开票客户"],
        invoiceUpcType: data1[d]["发票类型"],
        payMoney: data1[d]["售价小计"],
        _status: "Insert",
        orderDetails: orderDetails
      };
      let aa = { data: a };
      resultdata = JSON.stringify(aa);
      apiResponse2 = openLinker("POST", url, "SCMSA", resultdata); //TODO：注意填写应用编码(请看注意事项)
    }
    return { apiResponse2 };
  }
}
exports({ entryPoint: MyAPIHandler });