let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data[0];
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let func2 = extrequire("ST.api001.getToken"); //获取token
    let Res = func2.execute(require);
    let tokens = Res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "保存";
    var bustype = Data.bustype;
    let DBAPIURL = extrequire("ST.rule.PublicGetURL");
    let DBorderBody = DBAPIURL.execute(null, "kwti8du9");
    if (
      bustype != "1765484987649884168" &&
      bustype != "1765485975498129409" &&
      bustype != "1765485657655345155" &&
      bustype != "1765485331253035009" &&
      bustype != "2369198631997957" &&
      bustype != "1525755091611025411" &&
      bustype != "1525755383641538567" &&
      bustype != "1525755564049039368" &&
      bustype != "1525755727257796612" &&
      bustype != "2563202916389120"
    ) {
      var _status = Data["headItem!_status"];
      if (_status == "Insert" || _status == null) {
        let makeRule = Data.details[0].makeRuleCode;
        if (makeRule != "salereturnTosalesout") {
          let FHCKSql = "select code from aa.warehouse.Warehouse where id = '" + Data.warehouse + "'";
          let FHCKRes = ObjectStore.queryByYonQL(FHCKSql, "productcenter");
          if (FHCKRes[0].code != "00000043") {
            // 获取销售出库单数据
            function getHed(Data) {
              var warehouse = Data.warehouse;
              var warehouse_name = Data.warehouse_name;
              let func1 = extrequire("ST.api001.getToken");
              let res = func1.execute(require);
              let token = res.access_token;
              let headers = { "Content-Type": "application/json;charset=UTF-8" };
              var itemInfo = {};
              var ArrayList = new Array();
              let CKSql = "select code,bWMS from aa.warehouse.Warehouse where id = '" + warehouse + "'";
              let CKRes = ObjectStore.queryByYonQL(CKSql, "productcenter");
              var warehouse_Code = CKRes[0].code;
              let CKDefineSql = "select * from aa.warehouse.WarehouseFreeDefine where id = '" + warehouse + "'";
              let CKDefineRes = ObjectStore.queryByYonQL(CKDefineSql, "productcenter");
              var warehouse_bWMS = CKDefineRes[0].define1;
              let iLogisticId = "";
              let iLogisticId_code = "";
              let iLogisticId_name = "";
              let cLogisticsBillNo = "";
              let SNO = Data.hasOwnProperty("cLogisticsBillNo");
              if (SNO == true) {
                iLogisticId = Data.iLogisticId;
                if (null != iLogisticId && undefined != iLogisticId) {
                  let wlsql = "select corp_code from 	aa.deliverycorp.Deliverycorp where id = '" + iLogisticId + "'";
                  let wlres = ObjectStore.queryByYonQL(wlsql, "productcenter");
                  iLogisticId_code = capitalizeEveryWord(wlres[0].corp_code);
                  iLogisticId_name = Data.iLogisticId_name;
                }
                cLogisticsBillNo = Data.cLogisticsBillNo;
              }
              var logisticsInfoData = {
                deliveryMode: "2B",
                logisticsCode: iLogisticId_code,
                logisticsName: iLogisticId_name,
                driverName: iLogisticId_name,
                shippingCode: [cLogisticsBillNo]
              };
              var vouchdate = new Date(Data.vouchdate);
              let Year = vouchdate.getFullYear();
              let Moth = vouchdate.getMonth() + 1 < 10 ? "0" + (vouchdate.getMonth() + 1) : vouchdate.getMonth() + 1;
              let Day = vouchdate.getDate() < 10 ? "0" + vouchdate.getDate() : vouchdate.getDate();
              let Hour = (vouchdate.getHours() < 10 ? "0" + vouchdate.getHours() : vouchdate.getHours()) + ":";
              let Minutes = (vouchdate.getMinutes() < 10 ? "0" + vouchdate.getMinutes() : vouchdate.getMinutes()) + ":";
              let Seconds = vouchdate.getSeconds() < 10 ? "0" + vouchdate.getSeconds() : vouchdate.getSeconds();
              let GMT = Year + "-" + Moth + "-" + Day + " " + Hour + Minutes + Seconds;
              var code = Data.code;
              var org = Data.invoiceOrg;
              let apiResponse = postman("get", DBorderBody.Url + "/yonbip/digitalModel/orgunit/detail?access_token=" + token + "&id=" + URLEncoder(org), JSON.stringify(headers), null);
              let apiResponseList = JSON.parse(apiResponse);
              let orgData = apiResponseList.data;
              let orgCode = orgData.code;
              var details = Data.details;
              var ArrList = new Array();
              if (details.length > 0) {
                var orderMap = new Map();
                var orderdetalsMap = new Map();
                var orderlinenoMap = new Map();
                var stockStatusDocs = new Array();
                var orderList = new Array();
                // 订单物料+行号key
                var orderArrayList = new Array();
                var productMap = new Map();
                // 订单号Map
                var orderMaps = new Map();
                for (let o = 0; o < details.length; o++) {
                  // 源头单据号
                  var firstupcodese = details[o].firstupcode;
                  orderMaps.set(firstupcodese, details[o]);
                }
                if (orderMaps.size > 1) {
                  let orderLines = new Array();
                  for (let i = 0; i < details.length; i++) {
                    let detailsdata = new Array();
                    let PRODATE = getPRODATE(details[i]);
                    let INVALDATE = getINVALDATE(details[i]);
                    let batchInfos = {
                      batchCode: details[i].batchno,
                      inventoryType: "FX",
                      batchQty: details[i].qty,
                      productDate: PRODATE,
                      expireDate: INVALDATE
                    };
                    detailsdata.push(batchInfos);
                    let lino = 0;
                    // 销售订单子表自定义字段
                    let sqlOrder = "select * from voucher.order.OrderDetailFreeDefine where id = '" + details[i].firstsourceautoid + "'";
                    let sqlOrderRes = ObjectStore.queryByYonQL(sqlOrder, "udinghuo");
                    if (sqlOrderRes.length > 0) {
                      lino = sqlOrderRes[0].define13;
                    }
                    // 查询物料SKu
                    let SkuSQL = "select code from pc.product.ProductSKU where id = '" + details[i].productsku + "'";
                    let SkuRES = ObjectStore.queryByYonQL(SkuSQL, "productcenter");
                    let orderinfo = {
                      orderLineNo: lino,
                      omsOrderCode: details[i].firstupcode,
                      planQty: details[i].qty,
                      actualQty: details[i].qty,
                      currentActualQty: details[i].qty,
                      inventoryType: "FX",
                      itemCode: SkuRES[0].code,
                      itemInfo: { itemCode: SkuRES[0].code },
                      batchInfoList: detailsdata
                    };
                    orderLines.push(orderinfo);
                  }
                  let jsonBody = {
                    outBizOrderCode: code,
                    omsOrderCode: code,
                    deliveryOrderTime: GMT,
                    systemType: "YS",
                    deliveryOrderCode: code,
                    bizOrderType: "OUTBOUND",
                    subBizOrderType: "B2BCK",
                    logisticsInfo: logisticsInfoData,
                    ownerCode: orgCode,
                    warehouseCode: warehouse_Code,
                    operationOrderLines: orderLines,
                    status: "OUTBOUND"
                  };
                  let body = {
                    appCode: "beiwei-oms",
                    appApiCode: "standard.tobsell.merge.order.stockout.confirm",
                    schemeCode: "bw47",
                    jsonBody: jsonBody
                  };
                  console.log("第一次请求入参：" + JSON.stringify(body));
                  let header = { key: "yourkeyHere" };
                  let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
                  let str = JSON.parse(strResponse);
                  // 打印日志
                  let LogBody = {
                    data: { code: code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
                  };
                  let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(header), JSON.stringify(LogBody));
                  console.log(LogResponse);
                  if (!str.success) {
                    throw new Error("调用OMS销售出库单创建API失败！" + str.message);
                  } else {
                    return { bool: false };
                  }
                } else {
                  let orderLines = new Array();
                  for (let i = 0; i < details.length; i++) {
                    // 物料主键
                    let product = details[i].product;
                    var stockStatusDoc = details[i].stockStatusDoc;
                    // 源头单据号
                    var firstupcode = details[i].firstupcode;
                    // 上游单据id
                    var sourceid = details[i].sourceid;
                    // 源头单据行id
                    var firstsourceautoid = details[i].firstsourceautoid;
                    // 上游单据类型
                    var source = details[i].source;
                    stockStatusDocs.push(stockStatusDoc);
                    let qty = details[i].qty;
                    if (source == 2) {
                      //上游为订单时
                      // 销售订单
                      let orderSql = "select lineno,id,productId from voucher.order.OrderDetail where id = '" + firstsourceautoid + "' and productId = '" + product + "'";
                      let orderRes = ObjectStore.queryByYonQL(orderSql, "udinghuo");
                      // 销售订单子表自定义字段
                      let sqlOrder = "select define13 from voucher.order.OrderDetailFreeDefine where id = '" + firstsourceautoid + "'";
                      let sqlOrderRes = ObjectStore.queryByYonQL(sqlOrder, "udinghuo");
                      if (undefined != sqlOrderRes && sqlOrderRes.length > 0) {
                        for (let k = 0; k < sqlOrderRes.length; k++) {
                          if (undefined != orderMap.get(product + "" + firstsourceautoid) && null != orderMap.get(product + "" + firstsourceautoid)) {
                            let lineno = sqlOrderRes[0].define13 * 10;
                            orderList.push({ lineno: lineno });
                            orderlinenoMap.set(product + "" + firstsourceautoid, lineno);
                            let mapQty = orderMap.get(product + "" + firstsourceautoid);
                            let SunQty = qty + mapQty;
                            orderMap.set(product + "" + firstsourceautoid, SunQty);
                          } else {
                            let lineno = sqlOrderRes[0].define13 * 10;
                            orderList.push({ lineno: lineno });
                            orderlinenoMap.set(product + "" + firstsourceautoid, lineno);
                            orderMap.set(product + "" + firstsourceautoid, qty);
                            orderdetalsMap.set(product + "" + firstsourceautoid, details[i]);
                          }
                        }
                      } else {
                        if (undefined != orderMap.get(product + "" + firstsourceautoid) && null != orderMap.get(product + "" + firstsourceautoid)) {
                          let lineno = orderRes[0].lineno;
                          orderlinenoMap.set(product + "" + firstsourceautoid, lineno);
                          let mapQty = orderMap.get(product + "" + firstsourceautoid);
                          let SunQty = qty + mapQty;
                          orderMap.set(product + "" + firstsourceautoid, SunQty);
                          productMap.set(product + "" + firstsourceautoid, orderRes[0]);
                        } else {
                          let lineno = orderRes[0].lineno;
                          orderlinenoMap.set(product + "" + firstsourceautoid, lineno);
                          orderMap.set(product + "" + firstsourceautoid, qty);
                          orderdetalsMap.set(product + "" + firstsourceautoid, details[i]);
                          productMap.set(product + "" + firstsourceautoid, orderRes[0]);
                        }
                      }
                    } else {
                      // 销售订单
                      let orderSql = "select lineno,id from voucher.order.OrderDetail where id = '" + firstsourceautoid + "' and productId = '" + product + "'";
                      let orderRes = ObjectStore.queryByYonQL(orderSql, "udinghuo");
                      // 销售订单子表自定义字段
                      let sqlOrder = "select define13 from voucher.order.OrderDetailFreeDefine where id = '" + firstsourceautoid + "'";
                      let sqlOrderRes = ObjectStore.queryByYonQL(sqlOrder, "udinghuo");
                      if (undefined != sqlOrderRes && sqlOrderRes.length > 0) {
                        if (undefined != orderMap.get(product + "" + firstsourceautoid) && null != orderMap.get(product + "" + firstsourceautoid)) {
                          let lineno = sqlOrderRes[0].define13 * 10;
                          orderList.push({ lineno: lineno });
                          orderlinenoMap.set(product + "" + firstsourceautoid, lineno);
                          let mapQty = orderMap.get(product + "" + firstsourceautoid);
                          let SunQty = qty + mapQty;
                          orderMap.set(product + "" + firstsourceautoid, SunQty);
                        } else {
                          let lineno = sqlOrderRes[0].define13 * 10;
                          orderList.push({ lineno: lineno });
                          orderlinenoMap.set(product + "" + firstsourceautoid, lineno);
                          orderMap.set(product + "" + firstsourceautoid, qty);
                          orderdetalsMap.set(product + "" + firstsourceautoid, details[i]);
                        }
                      } else {
                        if (undefined != orderMap.get(product + "" + firstsourceautoid) && null != orderMap.get(product + "" + firstsourceautoid)) {
                          let lineno = orderRes[0].lineno;
                          orderList.push({ lineno: lineno });
                          orderlinenoMap.set(product + "" + firstsourceautoid, lineno);
                          let mapQty = orderMap.get(product + "" + firstsourceautoid);
                          let SunQty = qty + mapQty;
                          orderMap.set(product + "" + firstsourceautoid, SunQty);
                        } else {
                          let lineno = orderRes[0].lineno;
                          orderList.push({ lineno: lineno });
                          orderlinenoMap.set(product + "" + firstsourceautoid, lineno);
                          orderMap.set(product + "" + firstsourceautoid, qty);
                          orderdetalsMap.set(product + "" + firstsourceautoid, details[i]);
                        }
                      }
                    }
                  }
                  if (orderMap.size > 0) {
                    let rownum = 1;
                    for (let key1 of orderMap.keys()) {
                      let detailsdata = new Array();
                      for (let j = 0; j < details.length; j++) {
                        let product = details[j].product;
                        let batchno = details[j].batchno;
                        let firstsourceautoid1 = details[j].firstsourceautoid;
                        let qty = details[j].qty;
                        let PRODATE = getPRODATE(details[j]);
                        let INVALDATE = getINVALDATE(details[j]);
                        let stockStatusDoc = details[j].stockStatusDoc;
                        let Invoicetype = getStockStatusMap(stockStatusDocs).get(stockStatusDoc);
                        let orderKeys = productMap.get(key1);
                        if (key1 == product + "" + firstsourceautoid1) {
                          let batchInfos = {
                            batchCode: batchno,
                            inventoryType: Invoicetype,
                            batchQty: qty,
                            productDate: PRODATE,
                            expireDate: INVALDATE
                          };
                          detailsdata.push(batchInfos);
                        }
                      }
                      let orderinfo = {
                        orderLineNo: orderlinenoMap.get(key1) / 10,
                        planQty: orderMap.get(key1),
                        actualQty: orderMap.get(key1),
                        currentActualQty: orderMap.get(key1),
                        inventoryType: "FX",
                        itemCode: orderdetalsMap.get(key1).product_cCode,
                        itemInfo: { itemCode: orderdetalsMap.get(key1).product_cCode },
                        batchInfoList: detailsdata
                      };
                      orderLines.push(orderinfo);
                      rownum++;
                    }
                  }
                  let jsonBody = {
                    outBizOrderCode: firstupcode,
                    omsOrderCode: firstupcode,
                    deliveryOrderTime: GMT,
                    systemType: "YS",
                    deliveryOrderCode: code,
                    bizOrderType: "OUTBOUND",
                    subBizOrderType: "B2BCK",
                    logisticsInfo: logisticsInfoData,
                    ownerCode: orgCode,
                    warehouseCode: warehouse_Code,
                    operationOrderLines: orderLines,
                    status: "OUTBOUND"
                  };
                  let body = {
                    appCode: "beiwei-oms",
                    appApiCode: "standard.tobsell.order.stockout.confirm",
                    schemeCode: "bw47",
                    jsonBody: jsonBody
                  };
                  return {
                    body: body,
                    warehouse_bWMS: warehouse_bWMS,
                    sourceid: sourceid,
                    source: source,
                    ArrayList: ArrayList,
                    warehouse_name: warehouse_name,
                    warehouse_Code: warehouse_Code,
                    GMT: GMT,
                    code: code,
                    org: org,
                    orgCode: orgCode,
                    bool: true
                  };
                }
              }
            }
            console.log("明细2：" + JSON.stringify(Data.details));
            var item = getHed(Data);
            console.log("数据源：" + JSON.stringify(item));
            if (item.bool == true) {
              // 销售出库上游为销售发货时
              if (item.source == 1) {
                // 销售出库上游单据id
                let sourceid = item.sourceid;
                // 查询销售发货详情
                let OrderGoodsrUrl = extrequire("ST.rule.salesOrderGoods");
                let OrderGoods = OrderGoodsrUrl.execute(null, sourceid);
                // 销售发货详情接口返回值
                if (OrderGoods.code == "200") {
                  let salesOrderUrl = extrequire("ST.unit.salesOrderQuery");
                  let salesOrder = salesOrderUrl.execute(null, OrderGoods.UpID);
                  // 销售订单详情接口返回值
                  if (salesOrder.code == "200") {
                    if (
                      salesOrder.transaction == "1765416628943061001" ||
                      salesOrder.transaction == "1770398979975020553" ||
                      salesOrder.transaction == "1770398163931234308" ||
                      salesOrder.transaction == "1770394161028005895" ||
                      salesOrder.transaction == "1765427993424429066" ||
                      salesOrder.transaction == "1770395372214550529" ||
                      salesOrder.transaction == "1770393611275862022" ||
                      salesOrder.transaction == "1765429230375010308" ||
                      salesOrder.transaction == "1770415000226627589" ||
                      salesOrder.transaction == "1770394727963688967" ||
                      salesOrder.transaction == "1770397682904858630" ||
                      salesOrder.transaction == "1770398610634571784" ||
                      salesOrder.transaction == "1765429582574911489"
                    ) {
                      console.log("半成品入参：" + JSON.stringify(item.body));
                      let header = { key: "yourkeyHere" };
                      let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(item.body));
                      let str = JSON.parse(strResponse);
                      // 打印日志
                      let LogBody = {
                        data: {
                          code: Data.details[0].firstupcode,
                          success: str.success,
                          errorCode: str.errorCode,
                          errorMessage: str.errorMessage,
                          RequestDate: GetTimeReturn.expireDate,
                          operateType: operateType
                        }
                      };
                      let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + tokens, JSON.stringify(header), JSON.stringify(LogBody));
                      console.log(LogResponse);
                      if (str.success != true) {
                        throw new Error("调用OMS销售出库单创建API失败！" + str.errorMessage);
                      }
                    }
                  } else {
                    throw new Error("销售订单查询失败错误信息为：" + salesOrder.message);
                  }
                } else {
                  throw new Error("销售发货查询失败错误信息为：" + OrderGoods.message);
                }
              } else if (item.source == "2") {
                // 销售出库上游为销售订单时
                // 销售出库上游单据id
                let sourceid = item.sourceid;
                // 查询销售订单详情
                let salesOrderUrl = extrequire("ST.unit.salesOrderQuery");
                let salesOrder = salesOrderUrl.execute(null, sourceid);
                // 销售订单详情接口返回值
                if (salesOrder.code == 200) {
                  // 是否为WMS仓库
                  if (!item.warehouse_bWMS || "false" == item.warehouse_bWMS) {
                    let header = { key: "yourkeyHere" };
                    console.log("成品入参：" + JSON.stringify(item.body));
                    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(item.body));
                    let str = JSON.parse(strResponse);
                    // 打印日志
                    let LogBody = {
                      data: {
                        code: Data.details[0].firstupcode,
                        success: str.success,
                        errorCode: str.errorCode,
                        errorMessage: str.errorMessage,
                        RequestDate: GetTimeReturn.expireDate,
                        operateType: operateType
                      }
                    };
                    let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + tokens, JSON.stringify(header), JSON.stringify(LogBody));
                    console.log(LogResponse);
                    if (!str.success) {
                      throw new Error("调用OMS销售出库单创建API失败！" + str.errorMessage);
                    }
                  }
                } else {
                  throw new Error("销售订单查询失败错误信息为：" + salesOrder.message);
                }
              }
            }
          }
        }
      }
      // 获取生产日期
      function getPRODATE(details) {
        var producedate = details.producedate;
        var proDate = new Date(producedate);
        let Year = proDate.getFullYear();
        let Moth = proDate.getMonth() + 1 < 10 ? "0" + (proDate.getMonth() + 1) : proDate.getMonth() + 1;
        let Day = proDate.getDate() < 10 ? "0" + proDate.getDate() : proDate.getDate();
        var PRODATE = Year + "-" + Moth + "-" + Day;
        return PRODATE;
      }
      // 获取有效期至
      function getINVALDATE(details) {
        var invaliddate = details.invaliddate;
        var invalDate = new Date(invaliddate);
        let Years = invalDate.getFullYear();
        let Mother = invalDate.getMonth() + 1 < 10 ? "0" + (invalDate.getMonth() + 1) : invalDate.getMonth() + 1;
        let Days = invalDate.getDate() < 10 ? "0" + invalDate.getDate() : invalDate.getDate();
        var INVALDATE = Years + "-" + Mother + "-" + Days;
        return INVALDATE;
      }
      // 组装库存状态
      function getStockStatusMap(ids) {
        var object = { ids: ids };
        let stockStatumap = new Map();
        //实体查询
        var res = ObjectStore.selectBatchIds("st.stockStatusRecord.stockStatusRecord", object);
        if (undefined != res && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            var stockStatusDoc_name = res[i].statusName;
            var Invoicetype = "";
            if (stockStatusDoc_name == "合格") {
              Invoicetype = "FX";
            } else if (stockStatusDoc_name == "待检") {
              Invoicetype = "DJ";
            } else if (stockStatusDoc_name == "放行") {
              Invoicetype = "FX";
            } else if (stockStatusDoc_name == "冻结") {
              Invoicetype = "FREEZE";
            } else if (stockStatusDoc_name == "禁用") {
              Invoicetype = "DISABLE";
            } else if (stockStatusDoc_name == "不合格") {
              Invoicetype = "UN_HG";
            }
            stockStatumap.set(res[i].id, Invoicetype);
          }
        }
        return stockStatumap;
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });