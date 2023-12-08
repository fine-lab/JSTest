let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = {};
    var res = S4();
    var resubmitCheckKey = res;
    [光标位置]
    var invoiceAgentId = request.agentId;
    var orderPrices_taxInclusive = 10;
    var corpContact = request.corpContact;
    var salesOrgId = request.salesOrgId;
    var transactionTypeId = request.transactionTypeId;
    var vouchdate = request.vouchdate;
    var agentId = request.agentId;
    var settlementOrgId = request.settlementOrgId;
    var orderPrices_currency = request.orderPrices_currency;
    var orderPrices_natCurrency = request.orderPrices_currency;
    var orderPrices_exchRate = request.orderPrices_exchRate;
    var orderPrices_exchangeRateType = "cfqer5om";
    var orderDefineCharacter_ICE00101 = request.orderDefineCharacter_ICE00101;
    var orderDefineCharacter_ICE00102 = request.orderDefineCharacter_ICE00102;
    var orderDefineCharacter_ICE00105 = request.orderDefineCharacter_ICE00105;
    var orderDefineCharacter_ICE00106 = request.orderDefineCharacter_ICE00106;
    var orderDefineCharacter_ICE00103 = request.orderDefineCharacter_ICE00103;
    var orderDefineCharacter__ICE00104 = request.orderDefineCharacter__ICE00104;
    var masterUnitId = request.masterUnitId;
    var invExchRate = request.invExchRate;
    var orderProductType = request.orderProductType;
    var memo = request.memo;
    var _status = "Insert";
    //订单子表
    var orderDetailPrices_natSum = request.orderDetails.orderDetailPrices_natSum;
    var productId = request.orderDetails.productId;
    var oriSum = request.orderDetails.oriSum;
    var priceQty = request.orderDetails.priceQty;
    var orderDetailPrices_natTaxUnitPrice = orderDetailPrices_natTaxUnitPrice;
    var subQty = request.orderDetails.subQty;
    var qty = request.orderDetails.qty;
    var taxId = request.orderDetails.taxId;
    var orderDetailPrices_natMoney = request.orderDetailPrices_natSum;
    var unitExchangeTypePrice = 0;
    var orderDetailPrices_oriTax = request.oriSum;
    var iProductAuxUnitId = request.masterUnitId;
    var orderDetailPrices_natUnitPrice = request.orderDetailPrices_natTaxUnitPrice;
    var invPriceExchRate = request.invExchRate;
    var orderDetailPrices_oriMoney = request.orderDetailPrices_natTaxUnitPrice;
    var stockOrgId = request.salesOrgId;
    var iProductUnitId = request.masterUnitId;
    var consignTime = request.vouchdate;
    var skuId = request.productId;
    var settlementOrgId = request.salesOrgId;
    var oriTaxUnitPrice = request.oriSum;
    var unitExchangeType = 0;
    var _status = "Insert";
    var orderDetailPrices_natTax = request.orderDetailPrices_natSum;
    var oriUnitPrice = request.orderDetailPrices_natSum;
    var orderDetailPrices_oriUnitPrice = request.orderDetailPrices_natSum;
    var orderDetails = {
      "orderDetailPrices!natSum": orderDetailPrices_natSum,
      productId: productId,
      oriSum: oriSum,
      priceQty: priceQty,
      "orderDetailPrices!natTaxUnitPrice": orderDetailPrices_natTaxUnitPrice,
      subQty: subQty,
      qty: qty,
      "orderDetailPrices!natMoney": orderDetailPrices_natMoney,
      unitExchangeTypePrice: unitExchangeTypePrice,
      "orderDetailPrices!oriTax": orderDetailPrices_oriTax,
      iProductAuxUnitId: iProductAuxUnitId,
      "orderDetailPrices!natUnitPrice": orderDetailPrices_natUnitPrice,
      invPriceExchRate: invPriceExchRate,
      "orderDetailPrices!oriMoney": orderDetailPrices_oriMoney,
      stockOrgId: stockOrgId,
      iProductUnitId: iProductUnitId,
      consignTime: consignTime,
      skuId: skuId,
      taxId: taxId,
      settlementOrgId: settlementOrgId,
      oriTaxUnitPrice: oriTaxUnitPrice,
      unitExchangeType: unitExchangeType,
      _status: _status,
      "orderDetailPrices!natTax": orderDetailPrices_natTax,
      oriUnitPrice: oriUnitPrice,
      "orderDetailPrices!oriUnitPrice": orderDetailPrices_oriUnitPrice,
      masterUnitId: masterUnitId,
      invExchRate: invExchRate,
      orderProductType: orderProductType
    };
    var payMoney = request.orderDetails.oriSum;
    let body = {
      data: {
        resubmitCheckKey: resubmitCheckKey,
        corpContact: corpContact,
        salesOrgId: salesOrgId,
        transactionTypeId: transactionTypeId,
        vouchdate: vouchdate,
        agentId: agentId,
        settlementOrgId: settlementOrgId,
        "orderPrices!currency": orderPrices_currency,
        "orderPrices!natCurrency": orderPrices_natCurrency,
        "orderPrices!exchRate": orderPrices_exchRate,
        "orderPrices!exchangeRateType": orderPrices_exchangeRateType,
        "orderDefineCharacter.ICE00101": orderDefineCharacter_ICE00101,
        "orderDefineCharacter.ICE00102": orderDefineCharacter_ICE00102,
        "oorderDefineCharacter.ICE00105": orderDefineCharacter_ICE00105,
        "orderDefineCharacter.ICE00106": orderDefineCharacter_ICE00106,
        "orderDefineCharacter.ICE00103": orderDefineCharacter_ICE00103,
        orderDefineCharacter__ICE00104: orderDefineCharacter__ICE00104,
        memo: memo,
        orderDetails: orderDetails,
        "orderPrices!taxInclusive": orderPrices_taxInclusive,
        invoiceAgentId: invoiceAgentId,
        payMoney: payMoney,
        _status: _status
      }
    };
    let strResponseClient = openLinker("POST", "https://www.example.com/", "AT1687962816100005", JSON.stringify(body));
    return { strResponseClient };
  }
}
exports({ entryPoint: MyAPIHandler });