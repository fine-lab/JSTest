let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let infoUrl = "https://www.example.com/" + request.tenantId;
    let apiResponseinfo = postman("GET", infoUrl, null, null); //TODO：注意填写应用编码(请看注意事项)
    var info = JSON.parse(apiResponseinfo);
    let url = info.data.gatewayUrl + "/yonbip/sd/voucherorder/detail?id=" + request.code;
    let apiResponse = openLinker("GET", url, "SCMSA", JSON.stringify({}));
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
        salesOrgId: sampData.salesOrgId,
        transactionTypeId: sampData.transactionTypeId,
        vouchdate: sampData.vouchdate,
        code: sampData.code,
        "rebateSum!usedMoney": sampData.rebateSum.usedMoney,
        "rebateSum!orderId": sampData.rebateSum.orderId,
        settlementOrgId: sampData.settlementOrgId,
        sendDate: sampData.sendDate,
        agentId: sampData.agentId,
        exchRateDate: sampData.exchRateDate,
        "orderPrices!currency": sampData.orderPrices.currency,
        "orderPrices!exchRate": sampData.orderPrices.exchRate,
        "orderPrices!exchangeRateType": sampData.orderPrices.exchangeRateType,
        "orderPrices!natCurrency": sampData.orderPrices.natCurrency,
        "orderPrices!taxInclusive": sampData.orderPrices.taxInclusive,
        invoiceAgentId: sampData.invoiceAgentId,
        modifyInvoiceType: sampData.modifyInvoiceType,
        payMoney: sampData.payMoney,
        orderPayMoney: sampData.orderPayMoney,
        "orderPrices!payMoneyDomesticTaxfree": sampData.orderPrices.payMoneyDomesticTaxfree,
        "orderPrices!orderPayMoneyDomesticTaxfree": sampData.orderPrices.orderPayMoneyDomesticTaxfree,
        "orderPrices!orderId": sampData.orderPrices.orderId,
        agentId_code: sampData.orderPrices.agentId_code,
        extend_forecast_status: request.forecaststatus,
        nextStatusName: sampData.nextStatusName,
        nextStatus: sampData.nextStatus,
        orderDetails: [
          {
            unitExchangeType: sampData.orderDetails[0].unitExchangeType,
            subQty: sampData.orderDetails[0].subQty,
            invPriceExchRate: sampData.orderDetails[0].invPriceExchRate,
            id: sampData.orderDetails[0].id,
            "orderDetailPrices!particularlyMoneyDomesticTaxfree": sampData.orderDetails[0].orderDetailPrices.particularlyMoneyDomesticTaxfree,
            "orderDetailPrices!natSum": sampData.orderDetails[0].orderDetailPrices.natSum,
            "orderDetailPrices!natMoney": sampData.orderDetails[0].orderDetailPrices.natMoney,
            productId: sampData.orderDetails[0].productId,
            "orderDetailPrices!orderDetailId": sampData.orderDetails[0].orderDetailPrices.orderDetailId,
            masterUnitId: sampData.orderDetails[0].masterUnitId,
            planIdForDeliveryArr: sampData.orderDetails[0].planIdForDeliveryArr,
            invExchRate: sampData.orderDetails[0].invExchRate,
            unitExchangeTypePrice: sampData.orderDetails[0].unitExchangeTypePrice,
            "orderDetailPrices!saleCost_orig_taxfree": sampData.orderDetails[0].orderDetailPrices.saleCost_orig_taxfree,
            "orderDetailPrices!oriTax": sampData.orderDetails[0].orderDetailPrices.oriTax,
            iProductAuxUnitId: sampData.orderDetails[0].iProductAuxUnitId,
            "orderDetailPrices!promotionMoneyOrigTaxfree": sampData.orderDetails[0].orderDetailPrices.promotionMoneyOrigTaxfree,
            "orderDetailPrices!natUnitPrice": sampData.orderDetails[0].orderDetailPrices.natUnitPrice,
            stockOrgId_code: sampData.orderDetails[0].stockOrgId_code,
            oriSum: sampData.orderDetails[0].oriSum,
            "orderDetailPrices!oriMoney": sampData.orderDetails[0].orderDetailPrices.oriMoney,
            priceQty: sampData.orderDetails[0].priceQty,
            stockOrgId: sampData.orderDetails[0].stockOrgId,
            iProductUnitId: sampData.orderDetails[0].iProductUnitId,
            "orderDetailPrices!natTaxUnitPrice": sampData.orderDetails[0].orderDetailPrices.natTaxUnitPrice,
            orderProductType: sampData.orderDetails[0].orderProductType,
            consignTime: sampData.orderDetails[0].consignTime,
            taxCode: sampData.orderDetails[0].taxCode,
            taxId: sampData.orderDetails[0].taxId,
            qty: sampData.orderDetails[0].qty,
            unit_Precision: sampData.orderDetails[0].unit_Precision,
            settlementOrgId_code: sampData.orderDetails[0].settlementOrgId_code,
            oriTaxUnitPrice: sampData.orderDetails[0].oriTaxUnitPrice,
            settlementOrgId: sampData.orderDetails[0].settlementOrgId,
            "orderDetailPrices!lineDiscountMoney": sampData.orderDetails[0].orderDetailPrices.lineDiscountMoney,
            "orderDetailPrices!natTax": sampData.orderDetails[0].orderDetailPrices.natTax,
            "orderDetailPrices!particularlyMoneyDomestic": sampData.orderDetails[0].orderDetailPrices.particularlyMoneyDomestic,
            "orderDetailPrices!oriUnitPrice": sampData.orderDetails[0].orderDetailPrices.oriUnitPrice,
            salesOrgId: sampData.orderDetails[0].salesOrgId,
            _status: "Update"
          }
        ],
        _status: "Update"
      }
    };
    let urlData = info.data.gatewayUrl + "/yonbip/sd/voucherorder/singleSave";
    let body = obj; //请求参数
    let apiResponseData = openLinker("POST", urlData, "SCMSA", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    var resData = JSON.parse(apiResponseData);
    return { resData };
  }
}
exports({ entryPoint: MyAPIHandler });