let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param;
    var materOuts = Data.data[0].materOuts;
    let OutMap = new Map();
    let QtyMap = new Map();
    let stockStatusDocs = new Array();
    for (let i = 0; i < materOuts.length; i++) {
      let productID = materOuts[i].product;
      let qty = materOuts[i].qty;
      let stockStatusDoc = materOuts[i].stockStatusDoc;
      stockStatusDocs.push(stockStatusDoc);
      if (undefined != OutMap.get(productID) && null != OutMap.get(productID)) {
        let OldQty = QtyMap.get(productID);
        let NewQty = OldQty + qty;
        QtyMap.set(productID, NewQty);
      } else {
        OutMap.set(productID, materOuts[i]);
        QtyMap.set(productID, qty);
      }
    }
    let orderLines = new Array();
    if (OutMap.size > 0) {
      let rownum = 1;
      for (let key1 of OutMap.keys()) {
        let detailsdata = new Array();
        for (let j = 0; j < materOuts.length; j++) {
          let product = materOuts[j].product;
          let batchnoScusse = materOuts[j].hasOwnProperty("batchno");
          let batchno = "";
          let PRODATE = "";
          let INVALDATE = "";
          if (batchnoScusse == true) {
            batchno = materOuts[j].batchno;
            PRODATE = getPRODATE(materOuts[j]);
            INVALDATE = getINVALDATE(materOuts[j]);
          }
          let qty = materOuts[j].qty;
          var Stock = materOuts[j].stockStatusDoc;
          let Invoicetype = getStockStatusMap(stockStatusDocs).get(Stock);
          if (key1 == product) {
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
        let proSKUSQL = "select code from pc.product.ProductSKU where id = '" + OutMap.get(key1).productsku + "'";
        var proSKURES = ObjectStore.queryByYonQL(proSKUSQL, "productcenter");
        let orderinfo = {
          planQty: QtyMap.get(key1),
          actualQty: QtyMap.get(key1),
          currentActualQty: QtyMap.get(key1),
          itemInfo: { itemCode: proSKURES[0].code },
          inventoryType: getStockStatusMap(stockStatusDocs).get(Stock),
          batchInfos: detailsdata
        };
        orderLines.push(orderinfo);
        rownum++;
      }
    }
    // 业务单元查询
    let OrgSQL = "select code from org.func.BaseOrg where id = '" + Data.data[0].org + "'";
    let OrgRES = ObjectStore.queryByYonQL(OrgSQL, "ucf-org-center");
    // 仓库档案查询
    let HouseSQL = "select code from aa.warehouse.Warehouse where id ='" + Data.data[0].warehouse + "'";
    let HouseRES = ObjectStore.queryByYonQL(HouseSQL, "productcenter");
    let body = {
      appCode: "beiwei-oms",
      appApiCode: "ys.push.clck.order",
      schemeCode: "bw47",
      jsonBody: {
        outBizOrderCode: Data.data[0].code,
        bizOrderType: "OUTBOUND",
        subBizOrderType: "CLCK",
        ownerCode: OrgRES[0].code,
        warehouseCode: HouseRES[0].code,
        channelCode: "DEFAULT",
        orderLines: orderLines,
        orderSource: "PLATFORM_SYNC"
      }
    };
    return { body: body };
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