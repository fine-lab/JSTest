let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgs = request.org;
    var orderDatas = request.orderData;
    var access_token = request.access_token;
    var saveUrl = "https://www.example.com/" + access_token;
    var writebackUrl = "https://www.example.com/" + access_token;
    var priceQueryUrl = "https://www.example.com/" + access_token;
    var resMsg = {
      code: 200,
      message: ""
    };
    var successMsg = "转单成功，转入的单据号为:";
    for (var i = 0; i < orgs.length; i++) {
      var orgId = orgs[i].id;
      for (var j = 0; j < orderDatas.length; j++) {
        var orderData = orderDatas[j];
        //客户ID = 商家id  后面作为雨帆销售订单的客户
        var bizId = orderData.bizId;
        var billId = orderData.id;
        //销售订单表头实体查询
        var res = ObjectStore.selectById("voucher.order.Order", { id: billId }); //表头数据对象
        //查询条件
        var object = { orderId: billId };
        //销售订单表体实体查询
        var resdetail = ObjectStore.selectByMap("voucher.order.OrderDetail", object); //表体数据对象
        //构造表体VO
        let details = [];
        var payMoneySum = new Big("0");
        resdetail.forEach((item) => {
          //查询订单金额
          let orderDetailPrice = ObjectStore.selectByMap("voucher.order.OrderDetailPrice", { orderDetailId: item.id });
          //转入雨帆的订单价格需要从价格表中取，取价规则= 适用范围+客户+商品+生效状态(生效)+价格模板(客户+商品 priceTemplateId=1529210753574240375)
          let query = {
            pageIndex: 1,
            pageSize: 10,
            priceTemplateId: "yourIdHere",
            status: "VALID",
            simpleVOs: [
              {
                op: "eq",
                field: "orgScope",
                value1: orgId
              },
              {
                op: "eq",
                field: "dimension.productId",
                value1: item.productId
              },
              {
                op: "eq",
                field: "dimension.agentId",
                value1: res.bizId
              }
            ]
          };
          let priceRecords = postman("post", priceQueryUrl, JSON.stringify({ "Content-Type": "application/json" }), JSON.stringify(query));
          let priceObj = JSON.parse(priceRecords);
          if (priceObj.code != "200") {
            throw new Error("所选订单：" + orderData.code + "取价错误:" + priceObj.message);
          }
          let recordList = priceObj.data.recordList;
          if (recordList.length == 0) {
            throw new Error("所选订单：" + orderData.code + "没有在雨帆价格表中匹配到任何含税单价");
          }
          //含税单价
          let recordGradients_price = recordList[0].recordGradients_price;
          //含税金额计算 = 含税单价* 计价数量
          let natSum = MoneyFormatReturnBd(recordGradients_price * item.priceQty, 2);
          //无税金额计算 = 含税金额/(1+税率);
          let natMoney = MoneyFormatReturnBd(natSum / (1 + item.taxRate / 100), 2);
          //税额=含税-无税
          let oriTax = MoneyFormatReturnBd(natSum - natMoney, 2);
          //无税单价 = 无税金额/计价数量
          let natUnitPrice = MoneyFormatReturnBd(natMoney / item.priceQty, 2);
          payMoneySum = new Big(payMoneySum).plus(new Big(natSum));
          let detail = {
            stockId: item.stockId,
            "orderDetailPrices!natSum": natSum,
            "orderDetailPrices!natMoney": natMoney,
            productId: item.productId,
            masterUnitId: item.masterUnitId,
            invExchRate: item.invExchRate,
            unitExchangeTypePrice: item.unitExchangeTypePrice,
            "orderDetailPrices!oriTax": oriTax,
            iProductAuxUnitId: item.iProductAuxUnitId,
            "orderDetailPrices!natUnitPrice": natUnitPrice,
            invPriceExchRate: item.invPriceExchRate,
            oriSum: natSum,
            "orderDetailPrices!oriMoney": natMoney,
            priceQty: item.priceQty, //计价数量
            stockOrgId: orgId,
            iProductUnitId: item.iProductUnitId,
            "orderDetailPrices!natTaxUnitPrice": recordGradients_price,
            orderProductType: item.orderProductType,
            subQty: item.subQty,
            consignTime: item.consignTime,
            taxId: item.taxId,
            qty: item.qty,
            settlementOrgId: orgId,
            oriTaxUnitPrice: recordGradients_price,
            "orderDetailPrices!natTax": oriTax,
            unitExchangeType: item.unitExchangeType,
            "orderDetailPrices!oriUnitPrice": natUnitPrice,
            bodyItem: {
              define6: "false"
            },
            _status: "Insert"
          };
          details.push(detail);
        });
        //收款计划 	voucher.order.PaymentSchedules
        let orderPayment = ObjectStore.selectByMap("voucher.order.PaymentSchedules", { mainid: billId });
        //订单金额 voucher.order.OrderPrice
        let orderPrice = ObjectStore.selectByMap("voucher.order.OrderPrice", { orderId: billId });
        //构造表头JSON报文
        let vo = {
          resubmitCheckKey: substring(uuid(), 0, 31), //幂等性设置，就传入ID试试
          salesOrgId: orgId,
          receiveAddress: res.receiveAddress,
          transactionTypeId: "yourIdHere",
          vouchdate: res.vouchdate,
          agentId: res.bizId,
          settlementOrgId: orgId,
          "orderPrices!currency": orderPrice[0].currency,
          "orderPrices!exchRate": orderPrice[0].exchRate,
          "orderPrices!exchangeRateType": orderPrice[0].exchangeRateType,
          "orderPrices!natCurrency": orderPrice[0].natCurrency,
          "orderPrices!taxInclusive": orderPrice[0].taxInclusive,
          invoiceAgentId: res.bizId,
          payMoney: payMoneySum,
          orderPayMoney: payMoneySum,
          realMoney: payMoneySum,
          orderRealMoney: payMoneySum,
          orderDetails: details,
          headItem: {
            define4: true
          },
          _status: "Insert"
        };
        const header = {
          "Content-Type": "application/json"
        };
        let body = { data: vo };
        var result = postman("post", saveUrl, JSON.stringify(header), JSON.stringify(body));
        var resp = JSON.parse(result);
        //根据销售订单生成的状态回写当前订单的报单状态(define11),明天上午再做了
        if (resp.code == "200") {
          //回写自定义11
          var definesInfo = new Array();
          let define = {
            id: billId,
            code: orderData.code,
            definesInfo: [
              {
                define11: "true",
                isHead: true,
                isFree: true
              }
            ]
          };
          definesInfo.push(define);
          let req = {
            billnum: "voucher_order",
            datas: definesInfo
          };
          let apiresp = postman("post", writebackUrl, JSON.stringify(header), JSON.stringify(req));
        } else {
          throw new Error("所选单据：" + orderData.code + "转单错误:" + resp.message);
        }
      }
    }
    return { resMsg };
  }
}
exports({ entryPoint: MyAPIHandler });