let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = {};
    var res = S4();
    var resubmitCheckKey = res;
    var payMoney;
    var realMoney;
    var invoiceAgentId = request.agentId;
    var orderPrices_taxInclusive = 0;
    var corpContact = request.corpContact;
    var salesOrgId = "A001";
    var transactionTypeId = "yourIdHere";
    var vouchdate = request.vouchdate;
    var agentId = request.agentId;
    var settlementOrgId = "A001";
    var orderPrices_currency = request.orderPrices_currency;
    var orderPrices_natCurrency = "CNY";
    var orderDefineCharacter_ICE00101 = request.orderDefineCharacter_ICE00101; //检测部门
    var orderDefineCharacter_ICE00102 = request.orderDefineCharacter_ICE00102;
    var orderDefineCharacter_ICE00105 = request.orderDefineCharacter_ICE00105;
    var orderDefineCharacter_ICE00106 = request.orderDefineCharacter_ICE00106;
    var orderDefineCharacter_ICE00103 = request.orderDefineCharacter_ICE00103;
    var orderDefineCharacter__ICE00104 = request.orderDefineCharacter__ICE00104;
    var memo = request.memo;
    var _status = "Insert";
    var bizFlow = "832bb879-6ff8-11ed-98bc-fa163e27a895";
    var id = request.id;
    //判断id是否存在（存在：订单变更，不存在：订单新增）
    if (id == "0" || id == null || id == undefined) {
      //获取汇率类型
      let exchangeRateType = "cfqer5om";
      let exchangeRateObject = new Object();
      exchangeRateObject.pageSize = 10;
      exchangeRateObject.pageIndex = 1;
      exchangeRateObject.externalData = {
        exchangeRateType: "cfqer5om",
        quotationDate: "2023-01-03",
        activeKey: "yourKeyHere"
      };
      //获取到汇率的列表
      let exchangeRateInfo = openLinker("POST", "https://www.example.com/", "AT1687962816100005", JSON.stringify(exchangeRateObject));
      let exchangeRateValue = 0;
      let exchangeRateList = JSON.parse(exchangeRateInfo);
      let aa = exchangeRateList.code;
      if (exchangeRateList.code == "200") {
        if (exchangeRateList.data.recordList.length > 0) {
          //得到当前的汇率
          if (orderPrices_currency == orderPrices_natCurrency) {
            exchangeRateValue = "1";
          } else {
            exchangeRateValue = exchangeRateList.data.recordList[0].exchangeRate;
          }
        }
      }
      var stockOrgId = "A001";
      var settlementOrgId = "A001";
      var consignTime = request.vouchdate;
      var invExchRate = 0;
      var invPriceExchRate = 0;
      let orderDetailsRequest = request.orderDetails;
      let orderDetails = new Array();
      //测试总金额
      for (let i = 0; i < orderDetailsRequest.length; i++) {
        let productObject = new Object();
        productObject.pageSize = 10;
        productObject.pageIndex = 1;
        productObject.code = orderDetailsRequest[i].productId;
        //获取到物料档案的列表
        let productInfo = openLinker("POST", "https://www.example.com/", "AT1687962816100005", JSON.stringify(productObject));
        let productList = JSON.parse(productInfo);
        let unitId = "";
        let unitCode = "";
        if (productList.code == "200") {
          if (productList.data.recordList.length > 0) {
            //得到当前的主计量单位Id
            unitId = productList.data.recordList[0].unit;
            //获取到物料档案的列表
            let unitInfo = openLinker("GET", "https://www.example.com/" + unitId, "AT1687962816100005", null);
            let unitList = JSON.parse(unitInfo);
            if (unitList.code == "200") {
              unitCode = unitList.data.code;
            }
          }
        }
        var item = {
          productId: orderDetailsRequest[i].productId,
          oriSum: orderDetailsRequest[i].oriSum, //含税金额
          "orderDetailPrices!natSum": (orderDetailsRequest[i].oriSum * exchangeRateValue).toFixed(6), //本币含税金额
          priceQty: orderDetailsRequest[i].priceQty,
          "orderDetailPrices!natTaxUnitPrice": ((orderDetailsRequest[i].oriSum * exchangeRateValue) / orderDetailsRequest[i].qty).toFixed(6), //本币含税单价
          subQty: orderDetailsRequest[i].subQty,
          qty: orderDetailsRequest[i].qty,
          masterUnitId: unitCode, //主计量单位
          orderProductType: orderDetailsRequest[i].orderProductType,
          taxId: "VAT6", //税率：取固定值
          "orderDetailPrices!natMoney": ((orderDetailsRequest[i].oriSum - (orderDetailsRequest[i].oriSum / (1 + 0.6)) * 0.6) * exchangeRateValue).toFixed(6), //本币无税金额
          "orderDetailPrices!oriTax": ((orderDetailsRequest[i].oriSum / (1 + 0.6)) * 0.6).toFixed(6), //税额
          iProductAuxUnitId: unitCode, //销售单位
          "orderDetailPrices!natUnitPrice": (((orderDetailsRequest[i].oriSum - (orderDetailsRequest[i].oriSum / (1 + 0.6)) * 0.6) * exchangeRateValue) / orderDetailsRequest[i].qty).toFixed(6), //本币无税单价
          "orderDetailPrices!oriMoney": (orderDetailsRequest[i].oriSum - (orderDetailsRequest[i].oriSum / (1 + 0.6)) * 0.6).toFixed(6), //无税金额
          iProductUnitId: unitCode, //计价单位
          skuId: orderDetailsRequest[i].productId,
          oriTaxUnitPrice: (orderDetailsRequest[i].oriSum / orderDetailsRequest[i].qty).toFixed(6), //含税成交价
          "orderDetailPrices!natTax": ((orderDetailsRequest[i].oriSum / (1 + 0.6)) * 0.6 * exchangeRateValue).toFixed(6), //本币税额
          "orderDetailPrices!oriUnitPrice": ((orderDetailsRequest[i].oriSum - (orderDetailsRequest[i].oriSum / (1 + 0.6)) * 0.6) / orderDetailsRequest[i].qty).toFixed(6), //无税成交价
          unitExchangeTypePrice: 0,
          unitExchangeType: 0,
          stockOrgId: stockOrgId,
          settlementOrgId: settlementOrgId,
          consignTime: consignTime,
          invExchRate: invExchRate,
          _status: "Insert",
          invPriceExchRate: invPriceExchRate
        };
        orderDetails.push(item);
        payMoney = orderDetailsRequest[i].oriSum;
        realMoney = orderDetailsRequest[i].oriSum;
      }
      var payMoney_v2 = payMoney;
      var realMoney_v2 = realMoney;
      let body = {
        data: {
          resubmitCheckKey: resubmitCheckKey,
          corpContact: corpContact,
          salesOrgId: salesOrgId,
          transactionTypeId: transactionTypeId,
          vouchdate: vouchdate,
          agentId: agentId,
          settlementOrgId: "A001",
          "orderPrices!currency": orderPrices_currency,
          "orderPrices!natCurrency": orderPrices_natCurrency,
          "orderPrices!exchRate": exchangeRateValue,
          "orderPrices!exchangeRateType": "cfqer5om",
          define1: orderDefineCharacter_ICE00101,
          orderDefineCharacter: {
            ICE00101: orderDefineCharacter_ICE00101,
            ICE00102: orderDefineCharacter_ICE00102,
            ICE00104: orderDefineCharacter__ICE00104,
            ICE00103: orderDefineCharacter_ICE00103,
            ICE00105: orderDefineCharacter_ICE00105,
            ICE00106: orderDefineCharacter_ICE00106
          },
          memo: memo,
          orderDetails: orderDetails,
          "orderPrices!taxInclusive": orderPrices_taxInclusive,
          invoiceAgentId: invoiceAgentId,
          payMoney: payMoney_v2,
          realMoney: realMoney_v2,
          _status: _status,
          bizFlow: bizFlow
        }
      };
      //调用销售订单保存接口
      let strResponseClient = openLinker("POST", "https://www.example.com/", "AT1687962816100005", JSON.stringify(body));
      var SalesOrderSave = JSON.parse(strResponseClient);
      if (SalesOrderSave.code == "200") {
        // 获取销售订单id
        var SalesOrderId = SalesOrderSave.data.id;
        let data = {};
        let body = {
          data: [
            {
              id: SalesOrderId
            }
          ]
        };
        //调用销售订单审核接口
        var SalesOrderSubmission = openLinker("POST", "https://www.example.com/", "AT1687962816100005", JSON.stringify(body));
        var Submission = JSON.parse(SalesOrderSubmission);
      }
      return { strResponseClient };
    } else {
      let data = {};
      let body = {
        data: [
          {
            id: id
          }
        ]
      };
      var OrderAbandonment = openLinker("POST", "https://www.example.com/", "AT1687962816100005", JSON.stringify(body));
      var Abandonment = JSON.parse(OrderAbandonment);
      return { message: "订单弃审成功" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });