let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let func1 = extrequire("ST.api001.getToken"); //获取token
    let res = func1.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "删除";
    for (let i = 0; i < param.data.length; i++) {
      // 交易类型
      let bustypeSql = "select code from bd.bill.TransType where id = '" + param.data[i].bustype + "'";
      var bustypeRes = ObjectStore.queryByYonQL(bustypeSql, "transtype");
      console.log("交易类型：" + bustypeRes.code);
      let ids = [param.data[i].id];
      if (getOtherOutRecoeds(ids)[0].srcBillType != "3") {
        // 组织单元
        let OrgSQL = "select code from org.func.BaseOrg where id = '" + getOtherOutRecoeds(ids)[0].org + "'";
        let OrgRES = ObjectStore.queryByYonQL(OrgSQL, "ucf-org-center");
        // 仓库档案
        let warehouseSQL = "select code from aa.warehouse.Warehouse where id = '" + getOtherOutRecoeds(ids)[0].warehouse + "'";
        let warehouseRES = ObjectStore.queryByYonQL(warehouseSQL, "productcenter");
        let iLogisticId = "";
        let iLogisticId_code = "";
        let iLogisticId_name = "";
        let cLogisticsBillNo = "";
        // 快递单号
        let SNO = getOtherOutRecoeds(ids)[0].hasOwnProperty("cLogisticsBillNo");
        if (SNO == true) {
          iLogisticId = getOtherOutRecoeds(ids)[0].iLogisticId;
          if (null != iLogisticId && undefined != iLogisticId) {
            let wlsql = "select corp_code from 	aa.deliverycorp.Deliverycorp where id = '" + iLogisticId + "'";
            let wlres = ObjectStore.queryByYonQL(wlsql, "productcenter");
            iLogisticId_code = capitalizeEveryWord(wlres[0].corp_code);
            iLogisticId_name = getOtherOutRecoeds(ids)[0].iLogisticId_name;
          }
          cLogisticsBillNo = getOtherOutRecoeds(ids)[0].cLogisticsBillNo;
        }
        // 快递信息
        var logisticsInfoData = {
          deliveryMode: "2B",
          logisticsCode: iLogisticId_code,
          logisticsName: iLogisticId_name,
          driverName: iLogisticId_name,
          shippingCode: [cLogisticsBillNo]
        };
        // 销售出库子表
        let details = getOtherOutRecoeds(ids)[0].details;
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
        console.log("来源是否合单：" + orderMaps.size);
        if (orderMaps.size > 1) {
          let orderLines = new Array();
          for (let i = 0; i < details.length; i++) {
            let detailsdata = new Array();
            let PRODATE = getPRODATE(details[i]);
            let INVALDATE = getINVALDATE(details[i]);
            let batchInfos = {
              batchCode: details[i].batchno,
              inventoryType: "FX",
              quantity: details[i].qty,
              productDate: PRODATE,
              expireDate: INVALDATE
            };
            detailsdata.push(batchInfos);
            let lino = 0;
            // 销售订单
            let orderSql = "select lineno,id,productId from voucher.order.OrderDetail where id = '" + details[i].firstsourceautoid + "'";
            let orderRes = ObjectStore.queryByYonQL(orderSql, "udinghuo");
            if (orderRes.length > 0) {
              lino = orderRes[0].lineno;
            }
            // 物料SKU
            let SKUSQL = "select code from pc.product.ProductSKU where id ='" + details[i].productsku + "'";
            let SKURES = ObjectStore.queryByYonQL(SKUSQL, "productcenter");
            // 明细参数
            let orderinfo = {
              orderLineNo: lino / 10,
              omsOrderCode: details[i].firstupcode,
              currentActualQty: details[i].qty,
              planQty: details[i].qty,
              actualQty: details[i].qty,
              inventoryType: "FX",
              itemCode: SKURES[0].code,
              itemInfo: { itemCode: SKURES[0].code },
              batchInfos: detailsdata
            };
            orderLines.push(orderinfo);
          }
          // 请求体
          let body = {
            appCode: "beiwei-oms",
            appApiCode: "ys.del.b2bck.order.interface",
            schemeCode: "bw47",
            jsonBody: {
              outBizOrderCode: getOtherOutRecoeds(ids)[0].code,
              omsOrderCode: firstupcode,
              purchaseOrderCode: getOtherOutRecoeds(ids)[0].srcBillNO,
              bizOrderType: "OUTBOUNO",
              subBizOrderType: "B2BCK",
              ownerCode: OrgRES[0].code,
              warehouseCode: warehouseRES[0].code,
              logisticsInfo: logisticsInfoData,
              orderLines: orderLines,
              orderSource: "YS",
              channelCode: "DEFAULT"
            }
          };
          console.log("合单请求入参：" + JSON.stringify(body));
          let header = { key: "yourkeyHere" };
          let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
          console.log("合单请求返回数据：" + strResponse);
          let str = JSON.parse(strResponse);
          // 打印日志
          let LogBody = {
            data: {
              code: getOtherOutRecoeds(ids)[0].code,
              success: str.success,
              errorCode: str.errorCode,
              errorMessage: str.errorMessage,
              RequestDate: GetTimeReturn.expireDate,
              operateType: operateType
            }
          };
          let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(header), JSON.stringify(LogBody));
          console.log(LogResponse);
          if (!str.success) {
            if (str.errorCode != "A1000") {
              throw new Error("调用OMS销售出库单删除API失败！" + str.errorMessage);
            }
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
            console.log("销售出库明细行数据：" + JSON.stringify(details[i]));
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
                    quantity: qty,
                    productDate: PRODATE,
                    expireDate: INVALDATE
                  };
                  detailsdata.push(batchInfos);
                }
              }
              let SKUSQL = "select code from pc.product.ProductSKU where id ='" + orderdetalsMap.get(key1).productsku + "'";
              let SKURES = ObjectStore.queryByYonQL(SKUSQL, "productcenter");
              let orderinfo = {
                orderLineNo: orderlinenoMap.get(key1) / 10,
                omsOrderCode: orderdetalsMap.get(key1).firstupcode,
                planQty: orderMap.get(key1),
                actualQty: orderMap.get(key1),
                currentActualQty: orderMap.get(key1),
                inventoryType: "FX",
                itemCode: SKURES[0].code,
                itemInfo: { itemCode: SKURES[0].code },
                batchInfos: detailsdata
              };
              orderLines.push(orderinfo);
              rownum++;
            }
          }
          let jsonBody = {
            appCode: "beiwei-oms",
            appApiCode: "ys.del.b2bck.order.interface",
            schemeCode: "bw47",
            jsonBody: {
              outBizOrderCode: getOtherOutRecoeds(ids)[0].code,
              omsOrderCode: firstupcode,
              purchaseOrderCode: getOtherOutRecoeds(ids)[0].srcBillNO,
              bizOrderType: "OUTBOUNO",
              subBizOrderType: "B2BCK",
              ownerCode: OrgRES[0].code,
              warehouseCode: warehouseRES[0].code,
              logisticsInfo: logisticsInfoData,
              orderLines: orderLines,
              orderSource: "YS",
              channelCode: "DEFAULT"
            }
          };
          console.log("非合单情况请求入参：" + JSON.stringify(jsonBody));
          let header = { key: "yourkeyHere" };
          let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(jsonBody));
          console.log("非合单情况请求返回数据：" + strResponse);
          let str = JSON.parse(strResponse);
          // 打印日志
          let LogBody = {
            data: {
              code: getOtherOutRecoeds(ids)[0].code,
              success: str.success,
              errorCode: str.errorCode,
              errorMessage: str.errorMessage,
              RequestDate: GetTimeReturn.expireDate,
              operateType: operateType
            }
          };
          let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(header), JSON.stringify(LogBody));
          console.log(LogResponse);
          if (!str.success) {
            if (str.errorCode != "A1000") {
              throw new Error("调用OMS销售出库单删除API失败！" + str.errorMessage);
            }
          }
        }
      }
    }
    return {};
    function getOtherOutRecoeds(ids) {
      var object = {
        ids: ids,
        compositions: [
          {
            name: "details"
          }
        ]
      };
      return ObjectStore.selectBatchIds("st.salesout.SalesOut", object);
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
}
exports({ entryPoint: MyTrigger });