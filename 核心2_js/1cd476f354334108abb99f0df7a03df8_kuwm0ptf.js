let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT65230AT76.backDefaultGroup.getApitoken");
    let resToken = func1.execute();
    let token = resToken.access_token;
    let saleOrderurl = "https://www.example.com/" + token;
    let saleOrderSaveurl = "https://www.example.com/" + token;
    let getMerchantUrl = "https://www.example.com/" + token;
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let isNext = true;
    let index = 1;
    let response = [];
    while (isNext) {
      let body = {
        pageIndex: index,
        pageSize: 10,
        nextStatusName: "CONFIRMORDER",
        isSum: "false",
        simpleVOs: [
          {
            op: "eq",
            value1: "未计提",
            field: "headFreeItem.define2"
          },
          {
            op: "eq",
            value1: "是",
            field: "headFreeItem.define1"
          }
        ]
      };
      isNext = false;
      let rst = "";
      let orderResponse = postman("POST", saleOrderurl, JSON.stringify(header), JSON.stringify(body));
      let orderresponseobj = JSON.parse(orderResponse);
      if ("200" == orderresponseobj.code) {
        rst = orderresponseobj.data;
        let recordList = rst.recordList;
        if (recordList.length > 0) {
          for (let i = 0; i < recordList.length; i++) {
            let record = recordList[i];
            let merchantResponse = postman("GET", getMerchantUrl + "&id=" + record.agentId + "&orgId=" + record.salesOrgId, JSON.stringify(header), null);
            let merchantResponseobj = JSON.parse(merchantResponse);
            let merchantCode = "";
            if ("200" == merchantResponseobj.code) {
              let merchantrst = merchantResponseobj.data;
              merchantCode = merchantrst.code;
            }
            let account_type = "";
            if (includes(record.headFreeItem.define3_name, "国内")) {
              account_type = "1";
            } else {
              account_type = "2";
            }
            let rate = record.taxRate;
            let oriSum = record.oriSum;
            let rateMoney = MoneyFormatReturnBd(((oriSum / (1 + rate / 100)) * rate) / 100, 2);
            let noRateMoney = MoneyFormatReturnBd(oriSum / (1 + rate / 100), 2);
            let bizhong = record.orderPrices.domesticCode;
            let xszzid = record.salesOrgId;
            let xszzname = record.salesOrgId_name;
            let object = {
              sale_code: record.code,
              order_date: record.vouchdate,
              money: oriSum,
              merchant: record.agentId,
              merchantCode: merchantCode,
              ccount_type: account_type,
              shuilv: rate,
              shuie: rateMoney,
              wushuijine: noRateMoney,
              bizhong: bizhong,
              BaseOrg: xszzid
            };
            let res = ObjectStore.insert("GT65230AT76.GT65230AT76.sale_accrual_h", object, "7a6a78a3");
            let objectBatch = [];
            if (typeof res.id != undefined) {
              let moneyMonth = MoneyFormatReturnBd(oriSum / 12, 2);
              let moneyMonthNoRateMoneyMonth = MoneyFormatReturnBd(moneyMonth / (1 + rate / 100), 2);
              let moneyRateMoneyMonth = moneyMonth - moneyMonthNoRateMoneyMonth;
              for (let j = 0; j < 12; j++) {
                let objectMonth = null;
                let now = new Date(record.vouchdate);
                //指定几个月后
                let wantDate = new Date(now.setMonth(now.getMonth() + j));
                let newDate = new Date(wantDate.getFullYear(), wantDate.getMonth() + 1, 0);
                let newDateStr = getData(newDate);
                if (j == 11) {
                  let moneyLastMonth = MoneyFormatReturnBd(oriSum - moneyMonth * 11, 2);
                  let moneyLastMonthNoRateMoneyMonth = MoneyFormatReturnBd(moneyLastMonth / (1 + rate / 100), 2);
                  let moneyLastRateMoneyMonth = moneyLastMonth - moneyLastMonthNoRateMoneyMonth;
                  objectMonth = {
                    voucher_date: newDateStr,
                    money: moneyLastMonth,
                    shuilv: rate,
                    wushuijine: moneyLastMonthNoRateMoneyMonth,
                    shuie: moneyLastRateMoneyMonth,
                    voucher_status: 1,
                    sale_accrual_h_id: res.id,
                    isHC: 2,
                    wlclass_code: record.productCode
                  };
                } else {
                  objectMonth = {
                    voucher_date: newDateStr,
                    money: moneyMonth,
                    shuilv: rate,
                    wushuijine: moneyMonthNoRateMoneyMonth,
                    shuie: moneyRateMoneyMonth,
                    voucher_status: 1,
                    sale_accrual_h_id: res.id,
                    isHC: 2,
                    wlclass_code: record.productCode
                  };
                }
                objectBatch.push(objectMonth);
              }
              let resBatch = ObjectStore.insertBatch("GT65230AT76.GT65230AT76.sales_split_b", objectBatch, "7a6a78a3");
              if (resBatch.length == objectBatch.length) {
                record.headFreeItem.define2 = "2551542326334976";
                record.headFreeItem.define2_name = "已计提";
                let updateBody = {
                  data: {
                    resubmitCheckKey: replace(uuid(), "-", ""),
                    salesOrgId: record.salesOrgId,
                    transactionTypeId: record.transactionTypeId,
                    code: record.code,
                    vouchdate: record.vouchdate,
                    agentId: record.agentId,
                    "orderPrices!orderId": record.orderId,
                    settlementOrgId: record.settlementOrgId,
                    "orderPrices!currency": record.orderPrices.currency,
                    "orderPrices!exchRate": record.orderPrices.exchRate,
                    "orderPrices!exchangeRateType": record.orderPrices.exchangeRateType,
                    "orderPrices!natCurrency": record.orderPrices.natCurrency,
                    "orderPrices!taxInclusive": record.orderPrices.taxInclusive,
                    invoiceAgentId: record.agentId,
                    invoiceUpcType: record.invoiceUpcType,
                    payMoney: record.oriSum,
                    headFreeItem: {
                      define2: "已计提",
                      id: record.id
                    },
                    status: 0,
                    id: record.id,
                    _status: "Update",
                    orderDetails: [
                      {
                        id: record.orderDetailId,
                        "orderDetailPrices!orderDetailId": record.orderDetailId,
                        "orderDetailPrices!natSum": record.orderDetailPrices.natSum,
                        "orderDetailPrices!natMoney": record.orderDetailPrices.natMoney,
                        productId: record.productId,
                        masterUnitId: record.masterUnitId,
                        invExchRate: record.invExchRate,
                        unitExchangeTypePrice: record.unitExchangeTypePrice,
                        "orderDetailPrices!oriTax": record.orderDetailPrices.oriTax,
                        iProductAuxUnitId: record.iProductAuxUnitId,
                        "orderDetailPrices!natUnitPrice": record.orderDetailPrices.natUnitPrice,
                        invPriceExchRate: record.invPriceExchRate,
                        oriSum: record.oriSum,
                        "orderDetailPrices!oriMoney": record.orderDetailPrices.oriMoney,
                        _status: "Update",
                        priceQty: record.priceQty,
                        stockOrgId: record.orderDetails_stockOrgId,
                        iProductUnitId: record.iProductUnitId,
                        "orderDetailPrices!natTaxUnitPrice": record.orderDetailPrices.natTaxUnitPrice,
                        orderProductType: record.orderProductType,
                        subQty: record.subQty,
                        consignTime: record.consignTime,
                        skuId: record.skuId,
                        taxRate: record.taxRate,
                        qty: record.qty,
                        settlementOrgId: record.settlementOrgId,
                        oriTaxUnitPrice: record.oriTaxUnitPrice,
                        "orderDetailPrices!natTax": record.orderDetailPrices.natTax,
                        unitExchangeType: record.unitExchangeType,
                        "orderDetailPrices!oriUnitPrice": record.orderDetailPrices.oriUnitPrice
                      }
                    ]
                  }
                };
                let orderUpdateResponse = postman("POST", saleOrderSaveurl, JSON.stringify(header), JSON.stringify(updateBody));
                let orderupdateresponseobj = JSON.parse(orderUpdateResponse);
                if ("200" != orderupdateresponseobj.code) {
                  response.push(record.code, orderupdateresponseobj.message);
                }
              }
            }
          }
        }
      }
      if (rst.pageCount > index) {
        index += 1;
      } else {
        isNext = false;
      }
    }
    function getData(date) {
      let data = "";
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      data = y + "-" + m + "-" + d;
      return data;
    }
    return { response };
  }
}
exports({ entryPoint: MyAPIHandler });