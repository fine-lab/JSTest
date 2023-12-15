let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var org_id = request.org_id;
    var receiveContacter = request.receiveContacter;
    var receiveContacterPhone = request.receiveContacterPhone;
    var dDate = request.dDate;
    var agentId_ID = request.agentId_ID;
    var DepartmentID = request.DepartmentID;
    var YeWuYuan_ID = request.YeWuYuan_ID;
    let body = {
      data: {
        sourceid: id, //来源单据ID
        sourceType: "developplatform.af6531a9", //来源单据类型
        resubmitCheckKey: id, //唯一值
        saleDepartmentId: DepartmentID, //销售部门id
        corpContact: YeWuYuan_ID, //销售业务员id
        salesOrgId: org_id, //销售组织id
        transactionTypeId: "yourIdHere",
        vouchdate: dDate, //单据日期
        agentId: agentId_ID, //客户id
        receiveContacter: receiveContacter, //客户联系人
        receiveContacterPhone: receiveContacterPhone, //客户联系电话
        settlementOrgId: "01",
        "orderPrices!currency": "CNY",
        "orderPrices!exchRate": 1,
        "orderPrices!exchangeRateType": "01",
        "orderPrices!natCurrency": "CNY",
        "orderPrices!taxInclusive": true,
        invoiceAgentId: "yourIdHere",
        payMoney: 0,
        stockOrgId: "01",
        orderDetails: [
          {
            sourceid: id, //来源单据ID
            sourceType: "developplatform.af6531a9", //来源单据类型
            //子表id值
            sourceautoid: 1723867433481011204,
            "orderDetailPrices!natSum": 0,
            "orderDetailPrices!natMoney": 0,
            productId: "0",
            masterUnitId: "0",
            invExchRate: 0,
            unitExchangeTypePrice: 0,
            "orderDetailPrices!oriTax": 0,
            iProductAuxUnitId: "0",
            "orderDetailPrices!natUnitPrice": 0,
            invPriceExchRate: 0,
            oriSum: 0,
            "orderDetailPrices!oriMoney": 0,
            priceQty: 0,
            stockOrgId: "01",
            iProductUnitId: "0",
            "orderDetailPrices!natTaxUnitPrice": 0,
            orderProductType: "SALE",
            subQty: 0,
            consignTime: "2023-05-20 17:12:23",
            taxId: "VAT0",
            qty: 0,
            settlementOrgId: "01",
            oriTaxUnitPrice: 0,
            "orderDetailPrices!natTax": 0,
            unitExchangeType: 0,
            "orderDetailPrices!oriUnitPrice": 0,
            _status: "Insert"
          }
        ],
        _status: "Insert"
      }
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT37846AT3", JSON.stringify(body));
    var result = JSON.parse(apiResponse);
    var psndocid = result.data.id;
    return { apiResponse: apiResponse, id: psndocid };
  }
}
exports({ entryPoint: MyAPIHandler });