let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data[0];
    // 上游单据编码
    var srcBillNO = Data.srcBillNO;
    var id = Data.id;
    var status = param._status;
    // 查询出库仓
    let outWareSql = "select code from aa.warehouse.Warehouse where id = '" + Data.outwarehouse + "'";
    let outWareRes = ObjectStore.queryByYonQL(outWareSql, "productcenter");
    var outwareCode = outWareRes[0].code;
    if (outwareCode != "CTU256") {
      if (status == "Insert") {
        let func1 = extrequire("ST.api001.getToken");
        let res = func1.execute(require);
        let token = res.access_token;
        let headers = { "Content-Type": "application/json;charset=UTF-8" };
        let createTime = Data.createTime;
        let outorg = Data.outorg;
        let outaccount = Data.outaccount;
        let inorg = Data.inorg;
        let inaccount = Data.inaccount;
        let outorg_name = Data.outorg_name;
        let inorg_name = Data.inorg_name;
        let code = Data.code;
        let bustype = Data.bustype;
        let outwarehouse = Data.outwarehouse;
        let outwarehouse_name = Data.outwarehouse_name;
        let inwarehouse_name = Data.inwarehouse_name;
        let inwarehouse = Data.inwarehouse;
        let details = Data.details;
        let wareSql = "select code from aa.warehouse.Warehouse where id = '" + outwarehouse + "'";
        let outwarehouseRes = ObjectStore.queryByYonQL(wareSql, "productcenter");
        let outwarehouseCode = outwarehouseRes[0].code;
        if (details.length > 0) {
          let productData = {};
          let SunData = {};
          let orderLines = new Array();
          var orderMap = new Map();
          var orderdetalsMap = new Map();
          var stockStatusDocs = new Array();
          for (let j = 0; j < details.length; j++) {
            let batchInfo = {};
            let batchInfoList = new Array();
            let productMessage = details[j].product;
            let sourceautoid = details[j].sourceautoid;
            var stockStatusDoc = details[j].stockStatusDoc;
            let qty = details[j].qty;
            stockStatusDocs.push(stockStatusDoc);
            let productsku_cCode = details[j].productsku_cCode;
            let productsku_cName = details[j].productsku_cName;
            if (null != orderMap.get(sourceautoid) && undefined != orderMap.get(sourceautoid)) {
              let mapQty = orderMap.get(sourceautoid);
              let SunQty = qty + mapQty;
              orderMap.set(sourceautoid, SunQty);
            } else {
              orderMap.set(sourceautoid, qty);
              orderdetalsMap.set(sourceautoid, details[j]);
            }
          }
          if (orderMap.size > 0) {
            let count = 1;
            for (let keyID of orderMap.keys()) {
              let batchInfoList = new Array();
              for (let i = 0; i < details.length; i++) {
                let product = details[i].product;
                let batchno = details[i].batchno;
                let sourceautoid = details[i].sourceautoid;
                let qty = details[i].qty;
                let PRODATE = getPRODATE(details[i]);
                let INVALDATE = getINVALDATE(details[i]);
                let stockStatusDoc = details[i].stockStatusDoc;
                let Invoicetype = getStockStatusMap(stockStatusDocs).get(stockStatusDoc);
                if (keyID == sourceautoid) {
                  let batchInfos = {
                    batchCode: batchno,
                    inventoryType: Invoicetype,
                    batchQty: qty,
                    productDate: PRODATE,
                    expireDate: INVALDATE
                  };
                  batchInfoList.push(batchInfos);
                }
              }
              let orderinfo = {
                orderLineNo: keyID,
                planQty: orderMap.get(keyID),
                actualQty: orderMap.get(keyID),
                inventoryType: "FX",
                itemInfo: { itemCode: orderdetalsMap.get(keyID).product_cCode },
                batchInfoList: batchInfoList
              };
              orderLines.push(orderinfo);
              count++;
            }
          }
          let jsonBody = {
            omsOrderCode: srcBillNO,
            bizOrderType: "OUTBOUND",
            confirmType: 0,
            subBizOrderType: "DBCK",
            warehouseCode: outwarehouseCode,
            operationOrderLines: orderLines,
            systemType: "YS",
            status: "OUTBOUND"
          };
          let body = {
            appCode: "beiwei-oms",
            appApiCode: "dbck.confirm.interface",
            schemeCode: "bw47",
            jsonBody: jsonBody
          };
          let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(headers), JSON.stringify(body));
          let str = JSON.parse(strResponse);
          if (str.success != true) {
            throw new Error("调用OMS调出保存失败：" + str.errorMessage);
          }
        }
      }
    }
    function getPRODATE(details) {
      var producedate = details.producedate;
      var proDate = new Date(producedate);
      let Year = proDate.getFullYear();
      let Moth = proDate.getMonth() + 1 < 10 ? "0" + (proDate.getMonth() + 1) : proDate.getMonth() + 1;
      let Day = proDate.getDate() < 10 ? "0" + proDate.getDate() : proDate.getDate();
      var PRODATE = Year + "-" + Moth + "-" + Day;
      return PRODATE;
    }
    function getINVALDATE(details) {
      var invaliddate = details.invaliddate;
      var invalDate = new Date(invaliddate);
      let Years = invalDate.getFullYear();
      let Mother = invalDate.getMonth() + 1 < 10 ? "0" + (invalDate.getMonth() + 1) : invalDate.getMonth() + 1;
      let Days = invalDate.getDate() < 10 ? "0" + invalDate.getDate() : invalDate.getDate();
      var INVALDATE = Years + "-" + Mother + "-" + Days;
      return INVALDATE;
    }
    function getStockStatusMap(ids) {
      var object = {
        ids: ids
      };
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
    return {};
  }
}
exports({ entryPoint: MyTrigger });