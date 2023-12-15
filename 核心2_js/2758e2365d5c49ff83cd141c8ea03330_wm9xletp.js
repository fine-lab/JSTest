let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //发送人
    var username = JSON.parse(AppContext()).currentUser.name;
    //有效性后端链接
    var EffiveAPI = "AT179D04BE0940000B.frontDesignerFunction.getEffive";
    //接口地址后端链接
    var HttpsAPI = "AT179D04BE0940000B.frontDesignerFunction.getHttps";
    //解析后勤策后端链接
    var ZEQCHttpAPI = "AT179D04BE0940000B.frontDesignerFunction.getZEQCHttp";
    var header = {
      "Content-Type": "application/json"
    };
    try {
      //查询销售订单数据
      var soid = param.data[0].id;
      var url = "https://www.example.com/" + soid + "";
      var apiResponse = openLinker("GET", url, "SCMSA", JSON.stringify({}));
      var retapiResponse = JSON.parse(apiResponse);
      if (retapiResponse.code == "200") {
        if (retapiResponse.data != undefined) {
          var sodata = retapiResponse.data;
          var nowdate = getNowDate();
          var wldate = getwlDate(24);
          var attrext6 = "";
          if (sodata.orderDefineCharacter != undefined) {
            attrext6 = sodata.orderDefineCharacter.attrext6;
          }
          //销售订单传顺丰调拨单(经销商销售订单)
          if (sodata.salesOrgId_code == "tjjt" || sodata.salesOrgId_code == "zx0101") {
            var funAPI3 = extrequire(EffiveAPI);
            var resAPI3 = funAPI3.execute("API3");
            if (resAPI3.r) {
              var jsonsfdbd = {
                sourceOrderSn: sodata.code,
                inStationNumber: "", ///////////////
                outStationNumber: "", ///////////////
                remark: sodata.memo,
                billDate: sodata.sendDate,
                transferOrderDetails: [],
                yongYouSaleOrderFieldVO: {
                  resubmitCheckKey: "",
                  receiveAccountingBasis: "st_salesout",
                  salesoutAccountingMethod: "invoiceConfirm",
                  accountOrg: "zx0101",
                  org: "zx01",
                  salesOrg: "zx0101",
                  invoiceOrg: "zx0101",
                  vouchdate: "",
                  bustype: "A30001",
                  warehouse: "",
                  invoiceCust: sodata.agentId_code,
                  cust: sodata.agentId_code,
                  srcBillType: "2",
                  natCurrency: "CNY",
                  currency: "CNY",
                  exchRateType: "01",
                  exchRate: 1,
                  modifyInvoiceType: "1",
                  bdInvoiceTypeCode: "4",
                  invoiceUpcType: "1",
                  invoiceTitleType: "0",
                  invoiceTitle: "", ///////////////
                  taxNum: "", ///////////////
                  bankName: "", ///////////////
                  subBankName: "", ///////////////
                  bankAccount: "", ///////////////
                  invoiceTelephone: "", ///////////////
                  invoiceAddress: "", ///////////////
                  iLogisticId: "yourIdHere",
                  sourcesys: "udinghuo",
                  salesOutDefineCharacter: {
                    attrext10: "",
                    attrext6: attrext6,
                    attrext9: "00000021"
                  },
                  _status: "Insert",
                  details: []
                }
              };
              sodata.orderDetails.forEach((row) => {
                var transferOrderDetail = {
                  productSn: row.productCode,
                  skuNumber: row.productCode,
                  inventoryUnit: row.priceUOM_Code,
                  name: row.productName,
                  transferQuantity: row.subQty,
                  unitFreePrice: row.orderDetailPrices.natTaxUnitPrice,
                  freeInStockPrice: row.orderDetailPrices.natTaxUnitPrice,
                  unitPrice: row.orderDetailPrices.oriUnitPrice,
                  free: row.taxRate,
                  totalPrice: row.orderDetailPrices.natMoney,
                  totalFreePrice: row.orderDetailPrices.natSum
                };
                var detail = {
                  _status: "Insert", //固定
                  source: "2", //固定
                  taxRate: row.taxRate, //固定
                  product: row.productCode,
                  productsku: row.productCode,
                  invExchRate: 1,
                  qty: row.subQty,
                  stockUnit: row.priceUOM_Code,
                  saleStyle: row.orderProductType,
                  oriSum: row.orderDetailPrices.natSum,
                  priceUOM: row.priceUOM_Code,
                  invPriceExchRate: 1,
                  taxUnitPriceTag: true,
                  unitExchangeType: 1,
                  orderId: soid,
                  orderDetailId: row.id,
                  orderCode: sodata.code,
                  sourceid: soid,
                  sourceautoid: row.id,
                  upcode: sodata.code,
                  makeRuleCode: "orderTosalesout", //固定
                  batchno: "批号1",
                  producedate: nowdate,
                  invaliddate: wldate,
                  taxId: "yourIdHere",
                  taxIssueDiscount: false
                };
                jsonsfdbd.transferOrderDetails.push(transferOrderDetail);
                jsonsfdbd.yongYouSaleOrderFieldVO.details.push(detail);
              });
              var funhttp3 = extrequire(HttpsAPI);
              var reshttp3 = funhttp3.execute("HttpAPI3");
              //得到接口3地址
              var http3 = reshttp3.http;
              //调用顺丰接口3
              var apiResponse3 = postman("post", http3, JSON.stringify(header), JSON.stringify(jsonsfdbd));
              var apiResponsejson3 = JSON.parse(apiResponse3);
              if (apiResponsejson3.code == "200") {
              } else {
                if (apiResponsejson3.msg == undefined) {
                  throw new Error("顺丰接口:" + sodata.code + apiResponsejson3.error);
                } else {
                  throw new Error("顺丰接口:" + sodata.code + apiResponsejson3.msg);
                }
              }
            }
          }
          if (sodata.salesOrgId_code == "TJ003" || sodata.salesOrgId_code == "xn02") {
            var funAPI4 = extrequire(EffiveAPI);
            var resAPI4 = funAPI4.execute("API4");
            if (resAPI4.r) {
              var jsonshxs = {
                oldOrderSn: sodata.code,
                pushType: 0,
                outShopId: sodata.agentId,
                outShopName: sodata.agentId_name,
                grantShopId: sodata.agentId_code,
                remarks: sodata.memo,
                businessRemarks: sodata.memo,
                orderAmount: sodata.orderPrices.payMoneyOrigTaxfree,
                discountAmount: 0,
                itemDiscountFee: 0,
                postFee: 0,
                actualPayAmount: sodata.orderPrices.payMoneyOrigTaxfree,
                arAmount: sodata.orderPrices.payMoneyOrigTaxfree,
                gotAmount: 0,
                platDiscountAmount: 0,
                commission: 0,
                shopReceivedAmount: sodata.orderPrices.payMoneyOrigTaxfree,
                logisticsName: "顺丰",
                logisticsCode: "SF",
                appointedStorageCode: "", ///////////////////////////
                orderCreateTime: sodata.sendDate,
                midCreateOrderTime: sodata.vouchdate,
                lastUpdateTime: sodata.sendDate,
                payTime: sodata.sendDate,
                estimatedDeliveryTime: sodata.sendDate,
                shopSubOrders: [],
                orderAddressInfo: {
                  recipientCompany: "",
                  recipientPhone: "",
                  recipientName: "",
                  detailAddress: "",
                  province: "",
                  city: "",
                  county: "",
                  provinceCode: "",
                  cityCode: "",
                  countyCode: "",
                  recipientTel: ""
                },
                yongYouSaleOrderFieldVO: {
                  resubmitCheckKey: "",
                  receiveAccountingBasis: "st_salesout",
                  salesoutAccountingMethod: "invoiceConfirm",
                  accountOrg: "xn02",
                  org: "xn02",
                  salesOrg: "xn02",
                  invoiceOrg: "xn02",
                  vouchdate: "",
                  bustype: "A30001",
                  warehouse: "",
                  invoiceCust: sodata.agentId_code,
                  cust: sodata.agentId_code,
                  srcBillType: "2",
                  natCurrency: "CNY",
                  currency: "CNY",
                  exchRateType: "01",
                  exchRate: 1,
                  modifyInvoiceType: "1",
                  bdInvoiceTypeCode: "4",
                  invoiceUpcType: "1",
                  invoiceTitleType: "0",
                  invoiceTitle: "",
                  taxNum: "",
                  bankName: "",
                  subBankName: "",
                  bankAccount: "",
                  invoiceTelephone: "",
                  invoiceAddress: "",
                  iLogisticId: "yourIdHere",
                  sourcesys: "udinghuo",
                  salesOutDefineCharacter: {
                    attrext10: "",
                    attrext6: attrext6,
                    attrext9: "00000021"
                  },
                  _status: "Insert",
                  details: []
                }
              };
              sodata.orderDetails.forEach((row) => {
                var shopSubOrder = {
                  platformOrderGoodsId: row.productId,
                  oldOrderSn: row.lineno,
                  itemNum: row.subQty,
                  itemId: row.productId,
                  skuId: row.productId,
                  skuCode: row.productCode,
                  itemCode: row.productCode,
                  discountPrice: row.oriTaxUnitPrice,
                  price: row.oriTaxUnitPrice,
                  discountFee: 0,
                  totalFee: row.orderDetailPrices.natSum,
                  payment: row.orderDetailPrices.natSum,
                  orderAmount: row.orderDetailPrices.natSum,
                  title: row.productName,
                  itemMessage: "",
                  skuPropertiesName: row.modelDescription,
                  dockingCode: row.productCode,
                  inventoryType: "ZP"
                };
                var detail = {
                  _status: "Insert", //固定
                  source: "2", //固定
                  taxRate: 13, //固定
                  product: row.productCode,
                  productsku: row.productCode,
                  invExchRate: 1,
                  qty: row.subQty,
                  stockUnit: row.priceUOM_Code,
                  saleStyle: row.orderProductType,
                  oriSum: row.orderDetailPrices.natSum,
                  priceUOM: row.priceUOM_Code,
                  invPriceExchRate: 1,
                  taxUnitPriceTag: true,
                  unitExchangeType: 1,
                  orderId: soid,
                  orderDetailId: row.id,
                  orderCode: sodata.code,
                  sourceid: soid,
                  sourceautoid: row.id,
                  upcode: sodata.code,
                  makeRuleCode: "orderTosalesout", //固定
                  batchno: "批号1",
                  producedate: nowdate,
                  invaliddate: wldate,
                  taxId: "yourIdHere",
                  taxIssueDiscount: false
                };
                jsonshxs.shopSubOrders.push(shopSubOrder);
                jsonshxs.yongYouSaleOrderFieldVO.details.push(detail);
              });
              var funhttp4 = extrequire(HttpsAPI);
              var reshttp4 = funhttp4.execute("HttpAPI4");
              var http4 = reshttp4.http;
              //调用顺丰接口4
              var apiResponse4 = postman("post", http4, JSON.stringify(header), JSON.stringify(jsonshxs));
              var apiResponsejson4 = JSON.parse(apiResponse4);
              if (apiResponsejson4.code == "200") {
              } else {
                if (apiResponsejson4.msg == undefined) {
                  throw new Error("顺丰接口:" + sodata.code + apiResponsejson4.error);
                } else {
                  throw new Error("顺丰接口:" + sodata.code + apiResponsejson4.msg);
                }
              }
            }
          }
        }
      } else {
        throw new Error(retapiResponse.message);
      }
    } catch (e) {
      throw new Error(e);
    }
    function getNowDate() {
      //定义日期格式化函数
      var date = new Date();
      var year = date.getFullYear(); //获取年份
      var month = date.getMonth() + 1; //获取月份，从0开始计数，所以要加1
      var day = date.getDate(); //获取日期
      month = month < 10 ? "0" + month : month; //如果月份小于10，前面补0
      day = day < 10 ? "0" + day : day; //如果日期小于10，前面补0
      return year + "" + month + "" + day; //拼接成yyyymmdd形式字符串
    }
    function getwlDate(number) {
      var date = localSetMonth(number);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = month > 9 ? month : "0" + month;
      day = day < 10 ? "0" + day : day;
      var today = year + "" + month + "" + day;
      return today;
    }
    function localSetMonth(number) {
      var date = new Date();
      const currentMonth = date.getMonth();
      // 获取传入月份的最大天数
      let tempDate1 = new Date();
      tempDate1.setDate(1);
      tempDate1.setMonth(currentMonth + 1);
      tempDate1 = new Date(tempDate1.getFullYear(), tempDate1.getMonth(), 0);
      const currentMonthMaxDate = tempDate1.getDate();
      // 获取处理后月份的最大天数
      let tempDate2 = new Date();
      tempDate2.setDate(1);
      tempDate2.setMonth(currentMonth + number + 1);
      tempDate2 = new Date(tempDate2.getFullYear(), tempDate2.getMonth(), 0);
      const afterHandlerMonthMaxDate = tempDate2.getDate();
      // 判断两个日期是否相等(就一定不会出现跳月的情况)
      if (currentMonthMaxDate === afterHandlerMonthMaxDate) {
        date.setMonth(date.getMonth() + number);
        return date;
      }
      // 如果两个月份不相等，则判断传入日期是否在月底，如果是月底则目标日期也设置为月底
      if (date.getDate() === currentMonthMaxDate) {
        tempDate2.setDate(afterHandlerMonthMaxDate);
        return tempDate2;
      }
      // 判断闰年
      if (date.getDate() >= afterHandlerMonthMaxDate) {
        tempDate2.setDate(afterHandlerMonthMaxDate);
        return tempDate2;
      }
      date.setMonth(date.getMonth() + number);
      return date;
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});