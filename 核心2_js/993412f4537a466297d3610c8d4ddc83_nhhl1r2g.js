let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 订单实体id
    let id = request.data.id;
    let code = request.data.code;
    // 更新条件
    // 获取客户id
    let agentId = request.data.agentId;
    var rebateres = ObjectStore.queryByYonQL("select * from voucher.rebate.AmountRebate where status <> 0 and agentId = '" + agentId + "' ", "marketingbill");
    var data = request.data;
    var access_token = request.access_token;
    var resMsg;
    //客户ID = 商家id  后面作为雨帆销售订单的客户
    var bizId = data.bizId;
    var billId = data.id;
    //销售组织id
    var orgId = data.settlementOrgId;
    //销售订单表头实体查询
    var res = ObjectStore.selectById("voucher.order.Order", { id: billId }); //表头数据对象
    //销售订单表头自定义项实体查询
    var OrderDefine = ObjectStore.selectByMap("voucher.order.OrderDefine", { id: billId }); //表头数据对象
    //查询条件
    var object = { orderId: billId };
    //销售订单表体实体查询
    var resdetail = ObjectStore.selectByMap("voucher.order.OrderDetail", object); //表体数据对象
    //构造表体VO
    let details = [];
    resdetail.forEach((item) => {
      //查询订单金额
      let orderDetailPrice = ObjectStore.selectByMap("voucher.order.OrderDetailPrice", { orderDetailId: item.id });
      //销售订单表体自定义项实体查询
      var OrderDetailDefine = ObjectStore.selectByMap("voucher.order.OrderDetailDefine", { orderDetailId: item.id });
      let detail = {
        id: item.id,
        stockId: item.stockId,
        "orderDetailPrices!natSum": orderDetailPrice[0].natSum,
        "orderDetailPrices!natMoney": orderDetailPrice[0].natMoney,
        productId: item.productId,
        masterUnitId: item.masterUnitId,
        invExchRate: item.invExchRate,
        unitExchangeTypePrice: item.unitExchangeTypePrice,
        "orderDetailPrices!orderDetailId": item.id,
        "orderDetailPrices!oriTax": orderDetailPrice[0].oriTax,
        iProductAuxUnitId: item.iProductAuxUnitId,
        "orderDetailPrices!natUnitPrice": orderDetailPrice[0].natUnitPrice,
        invPriceExchRate: item.invPriceExchRate,
        oriSum: item.oriSum,
        "orderDetailPrices!oriMoney": orderDetailPrice[0].oriMoney,
        priceQty: item.priceQty,
        stockOrgId: orgId,
        iProductUnitId: item.iProductUnitId,
        "orderDetailPrices!natTaxUnitPrice": orderDetailPrice[0].natTaxUnitPrice,
        orderProductType: item.orderProductType,
        subQty: item.subQty,
        consignTime: item.consignTime,
        taxId: item.taxId,
        qty: item.qty,
        settlementOrgId: orgId,
        oriTaxUnitPrice: item.oriTaxUnitPrice,
        "orderDetailPrices!natTax": orderDetailPrice[0].natTax,
        unitExchangeType: item.unitExchangeType,
        "orderDetailPrices!oriUnitPrice": orderDetailPrice[0].oriUnitPrice,
        bodyItem: {
          orderDetailId: OrderDetailDefine[0].id,
          define6: "false"
        },
        _status: "Update"
      };
      details.push(detail);
    });
    //构造表体VO
    let rebateRecords = [];
    let rebateRecord = {
      usedMoney: 1000,
      hasDefaultInit: true,
      _id: "youridHere",
      _tableDisplayOutlineAll: false,
      rebateId_code: "UO-8280202301140128",
      rebateId: "yourIdHere",
      rebateId_rebateMoney: 5184,
      rebateId_surplusMoney: 4184,
      rebateId_useWayCode: "TOPRODUCT",
      rebateId_vouchdate: "2023-01-14 00:00:00",
      rebateId_validStartDate: "2023-01-14 00:00:00",
      rebateId_validEndDate: "2099-11-01 00:00:00",
      rebateId_originalPk: "1529210246764953628",
      rebateId_originalPk_moneyDigit: "2",
      rebateId_originalPk_code: "CNY",
      rebateId_originalPk_name: "人民币",
      _isColError: false,
      _colErrorField: "rebateId_code",
      _realtype: null,
      _entityName: null,
      _keyName: null,
      _status: "Insert",
      _parent: null
    };
    rebateRecords.push(rebateRecord);
    let rebateDetails = [
      {
        hasDefaultInit: true,
        orderDetailId: "yourIdHere",
        orderId: "yourIdHere",
        uordercorp: 2916735993630784,
        orderRebateMoney: 970.88,
        rebateId: "yourIdHere",
        rebatecode: "UO-8280202301140128",
        rebateType: "TOPRODUCT",
        orderDetailIdKey: "yourKeyHere",
        _id: "youridHere",
        _status: "Insert"
      },
      {
        hasDefaultInit: true,
        orderDetailId: "yourIdHere",
        orderId: "yourIdHere",
        uordercorp: 2916735993630784,
        orderRebateMoney: 29.12,
        rebateId: "yourIdHere",
        rebatecode: "UO-8280202301140128",
        rebateType: "TOPRODUCT",
        orderDetailIdKey: "yourKeyHere",
        _id: "youridHere",
        _status: "Insert"
      }
    ];
    //收款计划 	voucher.order.PaymentSchedules
    let orderPayment = ObjectStore.selectByMap("voucher.order.PaymentSchedules", { mainid: billId });
    //订单金额 voucher.order.OrderPrice
    let orderPrice = ObjectStore.selectByMap("voucher.order.OrderPrice", { orderId: billId });
    //构造表头JSON报文
    let vo = {
      id: id,
      code: data.code,
      resubmitCheckKey: id,
      salesOrgId: orgId,
      transactionTypeId: data.transactionTypeId,
      vouchdate: res.vouchdate,
      agentId: agentId,
      settlementOrgId: orgId,
      "orderPrices!currency": orderPrice[0].currency,
      "orderPrices!orderId": id,
      "orderPrices!exchRate": orderPrice[0].exchRate,
      "orderPrices!exchangeRateType": orderPrice[0].exchangeRateType,
      "orderPrices!natCurrency": orderPrice[0].natCurrency,
      "orderPrices!taxInclusive": orderPrice[0].taxInclusive,
      invoiceAgentId: agentId,
      payMoney: res.payMoney,
      orderPayMoney: res.orderPayMoney,
      realMoney: res.realMoney,
      orderRealMoney: res.orderRealMoney,
      orderDetails: details,
      rebateRecords: rebateRecords,
      rebateDetails: rebateDetails,
      paymentSchedules: orderPayment,
      memo: "test",
      headItem: {
        orderId: OrderDefine[0].id,
        define4: "true"
      },
      _status: "Update"
    };
    throw new Error(JSON.stringify(vo));
    const header = {
      "Content-Type": "application/json"
    };
    let body = { data: vo };
    // 销售订单修改接口调用
    resMsg = postman("post", "https://www.example.com/" + access_token, JSON.stringify(header), JSON.stringify(body));
    // 销售订单查询接口调用
    throw new Error(JSON.stringify(resMsg));
    return { resMsg };
    throw new Error(JSON.stringify(res));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });