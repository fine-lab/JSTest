let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/" + request.id;
    let apiResponse = openLinker("GET", url, "PU", JSON.stringify({}));
    var res = JSON.parse(apiResponse);
    let sampData = res.data;
    var code = "";
    for (var i = 0; i < 6; i++) {
      code += parseInt(Math.random() * 10);
    }
    let obj = {
      data: {
        resubmitCheckKey: code,
        id: sampData.id,
        bustype_code: sampData.bustype_code,
        currency_code: sampData.currency_code,
        exchRate: sampData.exchRate,
        natCurrency_code: sampData.natCurrency_code,
        extend_forecast_status: request.forecaststatus,
        exchRateType: sampData.formula_userDefine_1736292997202968580,
        invoiceVendor_code: sampData.formula_userDefine_1734158329748389891,
        org_code: sampData.formula_userDefine_1734165270415540232,
        purchaseOrders: [
          {
            purUOM_Code: sampData.purchaseOrders[0].purUOM_Code,
            id: sampData.purchaseOrders[0].id,
            taxitems_code: sampData.purchaseOrders[0].taxitems_code,
            oriSum: sampData.purchaseOrders[0].oriSum,
            oriMoney: sampData.purchaseOrders[0].oriMoney,
            oriTaxUnitPrice: sampData.purchaseOrders[0].oriTaxUnitPrice,
            oriUnitPrice: sampData.purchaseOrders[0].oriUnitPrice,
            taxRate: sampData.purchaseOrders[0].taxRate,
            priceQty: sampData.purchaseOrders[0].priceQty,
            product_cCode: sampData.purchaseOrders[0].product_cCode,
            priceUOM_Code: sampData.purchaseOrders[0].priceUOM_Code,
            qty: sampData.purchaseOrders[0].qty,
            oriTax: sampData.purchaseOrders[0].oriTax,
            subQty: sampData.purchaseOrders[0].subQty,
            unitExchangeTypePrice: sampData.purchaseOrders[0].unitExchangeTypePrice,
            unitExchangeType: sampData.purchaseOrders[0].unitExchangeType,
            unit_code: sampData.purchaseOrders[0].unit_code,
            invExchRate: sampData.purchaseOrders[0].invExchRate,
            invPriceExchRate: sampData.purchaseOrders[0].invPriceExchRate,
            natMoney: sampData.natMoney,
            natSum: sampData.natSum,
            natTax: sampData.natTax,
            natTaxUnitPrice: sampData.purchaseOrders[0].natTaxUnitPrice,
            natUnitPrice: sampData.purchaseOrders[0].natUnitPrice,
            inInvoiceOrg_code: sampData.purchaseOrders[0].inInvoiceOrg_code,
            inOrg_code: sampData.purchaseOrders[0].formula_userDefine_1736385296061169667,
            _status: "Update"
          }
        ],
        _status: "Update",
        vendor_code: sampData.vendor_code,
        vouchdate: sampData.vouchdate
      }
    };
    let urlData = "https://www.example.com/";
    let body = obj; //请求参数
    let apiResponseData = openLinker("POST", urlData, "PU", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    var resData = JSON.parse(apiResponseData);
    return { resData };
  }
}
exports({ entryPoint: MyAPIHandler });