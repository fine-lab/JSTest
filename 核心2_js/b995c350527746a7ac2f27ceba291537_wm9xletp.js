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
      var soid = param.data[0].id;
      var url = "https://www.example.com/" + soid + "";
      var apiResponse = openLinker("GET", url, "SCMSA", JSON.stringify({}));
      var retapiResponse = JSON.parse(apiResponse);
      if (retapiResponse.code == "200") {
        if (retapiResponse.data != undefined) {
          var sodata = retapiResponse.data;
          var nowdate = getNowDate();
          var wldate = getwlDate(24);
        }
        if (sodata.salesOrgId_code == "tjjt" || sodata.salesOrgId_code == "zx0101") {
          if (sodata.transactionTypeId_code == "RET03" || sodata.transactionTypeId_code == "RET002") {
            if (sodata.saleReturnSourceType == "NONE") {
              var funAPI5 = extrequire(EffiveAPI);
              var resAPI5 = funAPI5.execute("API5");
              if (resAPI5.r) {
                var attrext6 = "";
                if (sodata.salereturnDefineCharacter != undefined) {
                  attrext6 = sodata.salereturnDefineCharacter.attrext6;
                }
                var jsonsoth = {
                  orderId: sodata.code,
                  remark: "",
                  refundAmount: sodata.totalMoney,
                  refundItemList: [],
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
                    invoiceCust: sodata.invoiceAgentId_code,
                    cust: sodata.invoiceAgentId_code,
                    srcBillType: "3",
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
                sodata.saleReturnDetails.forEach((row) => {
                  var refundItem = {
                    sku: row.productId,
                    itemNum: row.qty,
                    itemUnit: row.qtyName,
                    retailPrice: row.salePrice,
                    actualPrice: row.salePrice,
                    specificName: row.modelDescription,
                    skuNumber: row.productCode,
                    sysItemCode: row.productCode,
                    sysItemName: row.productName,
                    sysSkuCode: row.productCode,
                    numberOfApplication: row.qty,
                    returnQuantity: row.qty,
                    applyAmount: row.natSum,
                    discountAmount: "0",
                    planRefundAmount: row.natSum
                  };
                  var details = {
                    _status: "Insert",
                    source: "3",
                    taxRate: 13,
                    product: row.productCode,
                    productsku: row.productCode,
                    invExchRate: 1,
                    qty: row.qty,
                    stockUnit: row.iProductAuxUnitId,
                    saleStyle: row.orderProductType,
                    oriSum: row.natSum,
                    priceUOM: row.iProductAuxUnitId,
                    invPriceExchRate: 1,
                    taxUnitPriceTag: true,
                    unitExchangeType: 1,
                    orderId: soid,
                    orderDetailId: row.id,
                    orderCode: sodata.code,
                    sourceid: soid,
                    sourceautoid: row.id,
                    upcode: sodata.code,
                    makeRuleCode: "salereturnTosalesout",
                    batchno: "批号1",
                    producedate: nowdate,
                    invaliddate: wldate,
                    taxId: "yourIdHere",
                    taxIssueDiscount: false
                  };
                  jsonsoth.refundItemList.push(refundItem);
                  jsonsoth.yongYouSaleOrderFieldVO.details.push(details);
                });
                var funhttp5 = extrequire(HttpsAPI);
                var reshttp5 = funhttp5.execute("HttpAPI5");
                //得到接口5地址
                var http5 = reshttp5.http;
                //调用顺丰接口5
                var apiResponse5 = postman("post", http5, JSON.stringify(header), JSON.stringify(jsonsoth));
                var apiResponsejson5 = JSON.parse(apiResponse5);
                if (apiResponsejson5.code == "200") {
                } else {
                  if (apiResponsejson5.msg == undefined) {
                    throw new Error("顺丰接口:" + sodata.code + apiResponsejson5.error);
                  } else {
                    throw new Error("顺丰接口:" + sodata.code + apiResponsejson5.msg);
                  }
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