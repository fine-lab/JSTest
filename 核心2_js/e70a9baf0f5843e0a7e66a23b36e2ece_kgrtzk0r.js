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
      var poid = param.data[0].id;
      var url = "https://www.example.com/" + poid + "";
      var apiResponse = openLinker("GET", url, "PU", JSON.stringify({}));
      var retapiResponse = JSON.parse(apiResponse);
      if (retapiResponse.code == "200") {
        if (retapiResponse.data != undefined) {
          var podata = retapiResponse.data;
          var nowdate = getNowDate();
          var wldate = getwlDate(24);
          var yzck = podata.arrivalOrderDefineCharacter.CK001;
          if (yzck == "" || yzck == undefined) {
            return {};
          } else {
            var yzckurl = "https://www.example.com/" + yzck + "";
            var yzckResponse = openLinker("GET", yzckurl, "PU", JSON.stringify({}));
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
          if (podata.busType == 1790569606687490052 || podata.busType == 1484124196948148241) {
            var funAPI6 = extrequire(EffiveAPI);
            var resAPI6 = funAPI6.execute("API6");
            if (resAPI6.r) {
              var CK = "";
              var attrext6 = "";
              if (podata.arrivalOrderDefineCharacter != undefined) {
                CK = podata.arrivalOrderDefineCharacter.CK001;
                if (CK != undefined && CK != "") {
                  var resCK = ObjectStore.queryByYonQL("select code from aa.warehouse.Warehouse where id=" + CK + "", "productcenter");
                  if (resCK.length > 0) {
                    CK = resCK[0].code;
                  } else {
                    CK = "";
                  }
                } else {
                  CK = "";
                }
                attrext6 = podata.arrivalOrderDefineCharacter.attrext6;
                if (attrext6 != undefined && attrext6 != "") {
                  var resattrext6 = ObjectStore.queryByYonQL("select code,randKeywords from pc.brand.Brand where id=" + attrext6 + "", "productcenter");
                  if (resattrext6.length > 0) {
                    attrext6 = resattrext6[0].code;
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
              var dates = new Date(podata.vouchdate);
              var resgys = ObjectStore.queryByYonQL("select code from aa.vendor.Vendor where id=" + podata.vendor + "", "yssupplier");
              var jsoncgdh = {
                stationNumber: CK,
                sourceOrderSn: podata.code,
                supplierNumber: resgys[0].code,
                supplierName: podata.vendor_name,
                remark: podata.memo,
                plannedWarehousingTime: dates.toISOString(),
                quantity: "", /////////////
                totalFreeAmount: "", /////////////
                totalAmount: "", /////////////
                warehousingGoodsQuantity: "", /////////////
                warehousingFreeAmount: "", /////////////
                warehousingAmount: "", /////////////
                purchaseOrderDetails: [],
                yongYouPurchaseOrderFieldVO: {
                  resubmitCheckKey: "",
                  mergeSourceData: "true",
                  needCalcLines: true,
                  calcLinesKey: "yourKeyHere",
                  vouchdate: "",
                  bustype: "A15001",
                  warehouse: "",
                  memo: "",
                  purInRecordDefineCharacter: {
                    attrext6: attrext6
                  },
                  _status: "Insert",
                  purInRecords: []
                }
              };
              var totalnum = 0;
              var totalnotax = 0;
              var totalprice = 0;
              podata.arrivalOrders.forEach((row) => {
                totalnum = totalnum + row.qty;
                totalnotax = totalnotax + row.natMoney;
                totalprice = totalprice + row.natSum;
                var purchaseOrderDetail = {
                  skuNumber: row.product_cCode,
                  purchaseCount: row.qty,
                  stockCount: row.qty,
                  unitPrice: row.natUnitPrice,
                  unitFreePrice: row.natTaxUnitPrice,
                  free: row.taxRate,
                  totalPrice: row.natMoney,
                  totalFreePrice: row.natSum,
                  qualityType: "1",
                  quality: "",
                  qualityNum: row.qty
                };
                var purInRecord = {
                  makeRuleCode: "pu_arrivalorder",
                  sourceid: poid,
                  sourceautoid: row.id,
                  batchno: "批号1",
                  producedate: nowdate,
                  qty: row.qty,
                  oriTaxUnitPrice: row.natTaxUnitPrice,
                  natTaxUnitPrice: row.natTaxUnitPrice,
                  memo: "",
                  _status: "Insert"
                };
                jsoncgdh.purchaseOrderDetails.push(purchaseOrderDetail);
                jsoncgdh.yongYouPurchaseOrderFieldVO.purInRecords.push(purInRecord);
              });
              jsoncgdh.quantity = totalnum;
              jsoncgdh.warehousingGoodsQuantity = totalnum;
              jsoncgdh.totalFreeAmount = totalprice;
              jsoncgdh.warehousingFreeAmount = totalprice;
              jsoncgdh.totalAmount = totalnotax;
              jsoncgdh.warehousingAmount = totalnotax;
              var funhttp6 = extrequire(HttpsAPI);
              var reshttp6 = funhttp6.execute("HttpAPI6");
              //得到接口6地址
              var http6 = reshttp6.http;
              //调用顺丰接口6
              var apiResponse6 = postman("post", http6, JSON.stringify(header), JSON.stringify(jsoncgdh));
              var urllog6 = "https://www.example.com/";
              var bodylog6 = { fasongren: username, SrcJSON: JSON.stringify(jsoncgdh), ToJSON: apiResponse6, Actype: 6 }; //请求参数
              var apiResponselog6 = openLinker("POST", urllog6, "PU", JSON.stringify(bodylog6));
              var apiResponsejson6 = JSON.parse(apiResponse6);
              if (apiResponsejson6.code == "200") {
              } else {
                if (apiResponsejson6.msg == undefined) {
                  throw new Error("顺丰接口:" + podata.code + apiResponsejson6.error);
                } else {
                  throw new Error("顺丰接口:" + podata.code + apiResponsejson6.msg);
                }
              }
            }
          }
          if (podata.busType == 1790569675433705474 || podata.busType == 1484124196948148379) {
            var funAPI7 = extrequire(EffiveAPI);
            var resAPI7 = funAPI7.execute("API7");
            if (resAPI7.r) {
              var CK = "";
              var attrext6 = "";
              if (podata.arrivalOrderDefineCharacter != undefined) {
                CK = podata.arrivalOrderDefineCharacter.CK001;
                if (CK != undefined && CK != "") {
                  var resCK = ObjectStore.queryByYonQL("select code from aa.warehouse.Warehouse where id=" + CK + "", "productcenter");
                  if (resCK.length > 0) {
                    CK = resCK[0].code;
                  } else {
                    CK = "";
                  }
                } else {
                  CK = "";
                }
                attrext6 = podata.arrivalOrderDefineCharacter.attrext6;
                if (attrext6 != undefined && attrext6 != "") {
                  var resattrext6 = ObjectStore.queryByYonQL("select code,randKeywords from pc.brand.Brand where id=" + attrext6 + "", "productcenter");
                  if (resattrext6.length > 0) {
                    attrext6 = resattrext6[0].code;
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
              var resgys = ObjectStore.queryByYonQL("select code from aa.vendor.Vendor where id=" + podata.vendor + "", "yssupplier");
              var dizhi = "";
              var dhno = "";
              var lxrname = "";
              var resdizhi = ObjectStore.queryByYonQL("select detailAddress,contact from aa.vendor.VendorAddress where vendor=" + podata.vendor + "", "yssupplier");
              if (resdizhi.length > 0) {
                dizhi = resdizhi[0].detailAddress;
                if (resdizhi[0].contact != undefined) {
                  var reslxr = ObjectStore.queryByYonQL("select contactname,contactmobile from aa.vendor.VendorContacts where id=" + resdizhi[0].contact + "", "yssupplier");
                  if (reslxr.length > 0) {
                    dhno = reslxr[0].contactmobile;
                    lxrname = reslxr[0].contactname;
                  }
                }
              }
              var jsoncgth = {
                sourceOrderSn: podata.code,
                stationNumber: CK,
                supplierCode: resgys[0].code,
                plannedDeliveryQuantityTotal: "",
                purchaseReturnTotalFreeAmount: "",
                actualOutboundQuantityTotal: "",
                outOfStockTotalFreeAmount: "",
                province: "",
                provinceCode: "",
                city: "",
                cityCode: "",
                county: "",
                countyCode: "",
                address: dizhi,
                receiver: lxrname,
                contactPhone: dhno,
                remark: podata.memo,
                productDetailsDTOList: [],
                yongYouPurchaseOrderFieldVO: {
                  resubmitCheckKey: "",
                  mergeSourceData: "true",
                  needCalcLines: true,
                  calcLinesKey: "yourKeyHere",
                  vouchdate: "",
                  bustype: "A15001",
                  warehouse: "",
                  memo: "备注",
                  purInRecordDefineCharacter: {
                    attrext6: attrext6
                  },
                  _status: "Insert",
                  purInRecords: []
                }
              };
              var totalnum = 0;
              var totalnotax = 0;
              var totalprice = 0;
              podata.arrivalOrders.forEach((row) => {
                totalnum = totalnum + row.qty;
                totalnotax = totalnotax + row.natMoney;
                totalprice = totalprice + row.natSum;
                var productDetailsDTO = {
                  skuNumber: row.product_cCode,
                  inventoryUnit: "",
                  plannedDeliveryQuantity: 0 - row.qty,
                  unitFreePrice: row.natTaxUnitPrice,
                  unitPrice: row.natUnitPrice,
                  free: row.taxRate,
                  totalFreePrice: 0 - MoneyFormatReturnBd(row.natTaxUnitPrice / (1 + row.taxRate / 100), 2) * row.qty,
                  totalPrice: 0 - MoneyFormatReturnBd(row.natUnitPrice / (1 + row.taxRate / 100), 2) * row.qty
                };
                var purInRecord = {
                  makeRuleCode: "pu_arrivalorder_red",
                  sourceid: poid,
                  sourceautoid: row.id,
                  batchno: "批号1",
                  producedate: nowdate,
                  qty: 0 - row.qty,
                  oriTaxUnitPrice: row.natTaxUnitPrice,
                  natTaxUnitPrice: row.natTaxUnitPrice,
                  memo: "",
                  _status: "Insert"
                };
                jsoncgth.productDetailsDTOList.push(productDetailsDTO);
                jsoncgth.yongYouPurchaseOrderFieldVO.purInRecords.push(purInRecord);
              });
              jsoncgth.plannedDeliveryQuantityTotal = 0 - totalnum;
              jsoncgth.actualOutboundQuantityTotal = 0 - totalnum;
              jsoncgth.purchaseReturnTotalFreeAmount = 0 - totalprice;
              jsoncgth.outOfStockTotalFreeAmount = 0 - totalprice;
              var funhttp7 = extrequire(HttpsAPI);
              var reshttp7 = funhttp7.execute("HttpAPI7");
              //得到接口7地址
              var http7 = reshttp7.http;
              //调用顺丰接口7
              var apiResponse7 = postman("post", http7, JSON.stringify(header), JSON.stringify(jsoncgth));
              var urllog7 = "https://www.example.com/";
              var bodylog7 = { fasongren: username, SrcJSON: JSON.stringify(jsoncgth), ToJSON: apiResponse7, Actype: 7 }; //请求参数
              var apiResponselog7 = openLinker("POST", urllog7, "PU", JSON.stringify(bodylog7));
              var apiResponsejson7 = JSON.parse(apiResponse7);
              if (apiResponsejson7.code == "200") {
              } else {
                if (apiResponsejson7.msg == undefined) {
                  throw new Error("顺丰接口:" + podata.code + apiResponsejson7.error);
                } else {
                  throw new Error("顺丰接口:" + podata.code + apiResponsejson7.msg);
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
      return year + "-" + month + "-" + day; //拼接成yyyymmdd形式字符串
    }
    function getwlDate(number) {
      var date = localSetMonth(number);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = month > 9 ? month : "0" + month;
      day = day < 10 ? "0" + day : day;
      var today = year + "-" + month + "-" + day;
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