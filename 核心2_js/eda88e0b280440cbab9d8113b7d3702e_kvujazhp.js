let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let result;
    var token = request.accessToken;
    var id = request.orderId;
    var queryOrder = postman("get", "https://www.example.com/" + token + "&id=" + request.orderId, null, null);
    var queryOrderJson = JSON.parse(queryOrder);
    if (queryOrderJson.code == "200") {
      var queryOrderData = queryOrderJson.data;
      let orderDetails = [];
      queryOrderData.orderDetails.forEach((item) => {
        let newOrderDataDetalis = {
          id: item.id,
          "orderDetailPrices!natSum": item.orderDetailPrices.natSum,
          "orderDetailPrices!natMoney": item.orderDetailPrices.natMoney,
          productId: item.productId,
          "orderDetailPrices!orderDetailId": item.orderDetailPrices.orderDetailId,
          masterUnitId: item.masterUnitId,
          invExchRate: item.invExchRate,
          unitExchangeTypePrice: item.unitExchangeTypePrice,
          "orderDetailPrices!oriTax": item.orderDetailPrices.oriTax,
          iProductAuxUnitId: item.iProductAuxUnitId,
          "orderDetailPrices!natUnitPrice": item.orderDetailPrices.natUnitPrice,
          invPriceExchRate: item.invPriceExchRate,
          oriSum: item.oriSum,
          "orderDetailPrices!oriMoney": item.orderDetailPrices.oriMoney,
          priceQty: item.priceQty,
          stockOrgId: item.stockOrgId,
          iProductUnitId: item.iProductUnitId,
          "orderDetailPrices!natTaxUnitPrice": item.orderDetailPrices.natTaxUnitPrice,
          orderProductType: item.orderProductType,
          subQty: item.subQty,
          consignTime: item.consignTime,
          skuId: item.skuId,
          taxId: item.taxId,
          qty: item.qty,
          settlementOrgId: item.settlementOrgId,
          oriTaxUnitPrice: item.oriTaxUnitPrice,
          "orderDetailPrices!natTax": item.orderDetailPrices.natTax,
          unitExchangeType: item.unitExchangeType,
          "orderDetailPrices!oriUnitPrice": item.orderDetailPrices.oriUnitPrice,
          _status: "Update"
        };
        if (item.idKey) {
          newOrderDataDetalis.idKey = item.idKey;
        }
        orderDetails.push(newOrderDataDetalis);
      });
      let orderData = {
        resubmitCheckKey: queryOrderData.id,
        salesOrgId: queryOrderData.salesOrgId,
        transactionTypeId: request.transType,
        vouchdate: queryOrderData.vouchdate,
        code: queryOrderData.code,
        agentId: queryOrderData.agentId,
        settlementOrgId: queryOrderData.settlementOrgId,
        "orderPrices!currency": queryOrderData.orderPrices.currency,
        "orderPrices!exchRate": queryOrderData.orderPrices.exchRate,
        "orderPrices!exchangeRateType": queryOrderData.orderPrices.exchangeRateType,
        "orderPrices!natCurrency": queryOrderData.orderPrices.natCurrency,
        "orderPrices!taxInclusive": queryOrderData.orderPrices.taxInclusive,
        id: queryOrderData.id,
        invoiceAgentId: queryOrderData.invoiceAgentId,
        payMoney: queryOrderData.payMoney,
        "orderPrices!orderId": queryOrderData.orderPrices.orderId,
        orderDetails: orderDetails,
        _status: "Update"
      };
      let saveOeder = Object.assign(queryOrderData, orderData);
      let bodyParams = { data: saveOeder };
      var saveOrder = postman("post", "https://www.example.com/" + token, "", JSON.stringify(bodyParams));
      // 转为JSON对象
      saveOrder = JSON.parse(saveOrder);
      // 返回信息校验
      if (saveOrder.code != "200") {
        throw new Error(JSON.stringify(saveOrder.message));
      } else {
        result = saveOrder.data;
      }
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });