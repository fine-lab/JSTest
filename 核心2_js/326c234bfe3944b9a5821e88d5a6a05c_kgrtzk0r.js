let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      //发送人
      var username = JSON.parse(AppContext()).currentUser.name;
      //有效性后端链接
      var EffiveAPI = "AT18DC6E5E09E00008.backDesignerFunction.getEffive";
      //接口地址后端链接
      var HttpsAPI = "AT18DC6E5E09E00008.backDesignerFunction.getHttps";
      //解析后勤策后端链接
      var ZEQCHttpAPI = "AT18DC6E5E09E00008.backDesignerFunction.getZEQCHttp";
      var header = {
        "Content-Type": "application/json"
      };
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
          var nowdate1 = getNowDate1();
          var wldate1 = getwlDate1(24);
          var attrext6 = "";
          var attrext6name = "";
          if (sodata.orderDefineCharacter != undefined) {
            attrext6 = sodata.orderDefineCharacter.attrext6;
            if (attrext6 != undefined && attrext6 != "") {
              var resattrext6 = ObjectStore.queryByYonQL("select code,randKeywords,name from pc.brand.Brand where id=" + attrext6 + "", "productcenter");
              if (resattrext6.length > 0) {
                attrext6 = resattrext6[0].code;
                attrext6name = resattrext6[0].name;
                if (resattrext6[0].randKeywords != "接口") {
                  return {};
                }
              } else {
                attrext6 = "";
                return {};
              }
            } else {
              attrext6 = "";
              return {};
            }
          } else {
            return {};
          }
          var yzck = sodata.orderDefineCharacter.CK001;
          if (yzck == "" || yzck == undefined) {
            return {};
          } else {
            var yzckurl = "https://www.example.com/" + yzck + "";
            var yzckResponse = openLinker("GET", yzckurl, "SCMSA", JSON.stringify({}));
            var yzckResponseres = JSON.parse(yzckResponse);
            if (yzckResponseres.code == "200") {
              if (yzckResponseres.data != undefined && yzckResponseres.data.defineCharacter != undefined && yzckResponseres.data.defineCharacter.A0010 == "1") {
              } else {
                return {};
              }
            } else {
              return {};
            }
          }
          //销售订单传顺丰调拨单(经销商销售订单)
          if (sodata.salesOrgId_code == "tjjt" || sodata.salesOrgId_code == "zx0101") {
            var funAPI3 = extrequire(EffiveAPI);
            var resAPI3 = funAPI3.execute("API3");
            if (resAPI3.r) {
              var ckcode = "";
              var ckid = sodata.orderDefineCharacter.CK001;
              if (ckid != "" && ckid != undefined) {
                var ckcoderes = ObjectStore.queryByYonQL("select code from aa.warehouse.Warehouse where id=" + ckid, "productcenter");
                if (ckcoderes.length > 0) {
                  ckcode = ckcoderes[0].code;
                }
              }
              var datess = new Date(sodata.vouchdate);
              var jsonsfdbd = {
                sourceOrderSn: sodata.code,
                inStationNumber: sodata.agentId_code, ///////////////
                outStationNumber: ckcode, ///////////////
                remark: sodata.memo,
                billDate: datess.toISOString(),
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
                  cLogisticsBillNo: "",
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
                },
                yongYouSaleOrderFieldVO1: {
                  resubmitCheckKey: "",
                  needCalcLines: false,
                  org: "xn02",
                  accountOrg: "xn02",
                  vouchdate: "",
                  bustype: "A08001",
                  warehouse: "",
                  memo: "",
                  othInRecordDefineCharacter: {
                    attrext6: attrext6
                  },
                  _status: "Insert",
                  othInRecords: []
                }
              };
              sodata.orderDetails.forEach((row) => {
                var transferOrderDetail = {
                  productSn: row.productCode,
                  skuNumber: row.productCode,
                  inventoryUnit: row.purUOM_Code,
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
                  stockUnit: row.purUOM_Code,
                  saleStyle: row.orderProductType,
                  oriSum: row.orderDetailPrices.natSum,
                  priceUOM: row.purUOM_Code,
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
                  taxIssueDiscount: false,
                  project: row.projectId,
                  project_code: row.projectId_code,
                  project_name: row.projectId_name
                };
                var othInRecord = {
                  product: row.productCode,
                  productsku: row.productCode,
                  batchno: "批号1",
                  producedate: nowdate1,
                  invaliddate: wldate1,
                  contactsQuantity: row.subQty,
                  contactsPieces: row.subQty,
                  qty: row.subQty,
                  unit: row.purUOM_Code,
                  subQty: row.subQty,
                  invExchRate: 1,
                  stockUnitId: row.purUOM_Code,
                  project: row.projectId_code,
                  unitExchangeType: 0,
                  autoCalcCost: true,
                  isBatchManage: true,
                  isExpiryDateManage: true,
                  memo: "",
                  _status: "Insert"
                };
                jsonsfdbd.transferOrderDetails.push(transferOrderDetail);
                jsonsfdbd.yongYouSaleOrderFieldVO.details.push(detail);
                jsonsfdbd.yongYouSaleOrderFieldVO1.othInRecords.push(othInRecord);
              });
              var funhttp3 = extrequire(HttpsAPI);
              var reshttp3 = funhttp3.execute("HttpAPI3");
              //得到接口3地址
              var http3 = reshttp3.http;
              //调用顺丰接口3
              var apiResponse3 = postman("post", http3, JSON.stringify(header), JSON.stringify(jsonsfdbd));
              var urllog3 = "https://www.example.com/";
              var bodylog3 = { fasongren: username, SrcJSON: JSON.stringify(jsonsfdbd), ToJSON: apiResponse3, Actype: 3 }; //请求参数
              var apiResponselog3 = openLinker("POST", urllog3, "SCMSA", JSON.stringify(bodylog3));
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
              var ckcode = "";
              var ckid = sodata.orderDefineCharacter.CK001;
              if (ckid != "" && ckid != undefined) {
                var ckcoderes = ObjectStore.queryByYonQL("select code from aa.warehouse.Warehouse where id=" + ckid, "productcenter");
                if (ckcoderes.length > 0) {
                  ckcode = ckcoderes[0].code;
                }
              }
              var datessa = new Date(sodata.vouchdate);
              var jsonshxs = {
                oldOrderSn: sodata.code,
                pushType: 0,
                outShopId: sodata.agentId,
                outShopName: attrext6name + "分销商门店",
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
                appointedStorageCode: ckcode, ///////////////////////////
                virtuallyWarehouseCode: ckcode,
                orderCreateTime: sodata.vouchdate,
                midCreateOrderTime: sodata.vouchdate,
                lastUpdateTime: sodata.vouchdate,
                payTime: sodata.vouchdate,
                estimatedDeliveryTime: sodata.vouchdate,
                shopSubOrders: [],
                orderAddressInfo: {
                  recipientCompany: sodata.agentId_name,
                  recipientPhone: sodata.receiveMobile,
                  recipientName: sodata.receiver,
                  detailAddress: sodata.receiveAddress,
                  province: "",
                  city: "",
                  county: "",
                  provinceCode: "",
                  cityCode: "",
                  countyCode: "",
                  recipientTel: sodata.receiveMobile
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
                  cLogisticsBillNo: "",
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
                  realNeedShipNum: row.subQty,
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
                  stockUnit: row.purUOM_Code,
                  saleStyle: row.orderProductType,
                  oriSum: row.orderDetailPrices.natSum,
                  priceUOM: row.purUOM_Code,
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
                  taxIssueDiscount: false,
                  project: row.projectId,
                  project_code: row.projectId_code,
                  project_name: row.projectId_name
                };
                jsonshxs.shopSubOrders.push(shopSubOrder);
                jsonshxs.yongYouSaleOrderFieldVO.details.push(detail);
              });
              var funhttp4 = extrequire(HttpsAPI);
              var reshttp4 = funhttp4.execute("HttpAPI4");
              var http4 = reshttp4.http;
              //调用顺丰接口4
              var apiResponse4 = postman("post", http4, JSON.stringify(header), JSON.stringify(jsonshxs));
              var urllog4 = "https://www.example.com/";
              var bodylog4 = { fasongren: username, SrcJSON: JSON.stringify(jsonshxs), ToJSON: apiResponse4, Actype: 4 }; //请求参数
              var apiResponselog4 = openLinker("POST", urllog4, "SCMSA", JSON.stringify(bodylog4));
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
    function getNowDate1() {
      //定义日期格式化函数
      var date = new Date();
      var year = date.getFullYear(); //获取年份
      var month = date.getMonth() + 1; //获取月份，从0开始计数，所以要加1
      var day = date.getDate(); //获取日期
      month = month < 10 ? "0" + month : month; //如果月份小于10，前面补0
      day = day < 10 ? "0" + day : day; //如果日期小于10，前面补0
      return year + "-" + month + "-" + day; //拼接成yyyymmdd形式字符串
    }
    function getwlDate1(number) {
      var date = localSetMonth(number);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = month > 9 ? month : "0" + month;
      day = day < 10 ? "0" + day : day;
      return year + "-" + month + "-" + day;
    }
    function getwlDate(number) {
      var date = localSetMonth(number);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = month > 9 ? month : "0" + month;
      day = day < 10 ? "0" + day : day;
      return year + "" + month + "" + day;
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