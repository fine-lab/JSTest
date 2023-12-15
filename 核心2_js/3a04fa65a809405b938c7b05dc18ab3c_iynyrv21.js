let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func_1 = extrequire("ST.backDefaultGroup.getWLdetail");
    let rows = request.rows;
    let xsck = request.xsck;
    let morphologyconversiondetail = [];
    for (var i = 0; i < rows.length; i++) {
      let row = rows[i];
      let productId = row.product + "";
      let vouchdate = xsck.vouchdate;
      let free1 = row.free1;
      let wlxqRst = func_1.execute(productId, free1, vouchdate);
      let wlxq = wlxqRst.rst;
      if (wlxq.length > 0) {
        //转换后
        let zhafter = {
          groupNumber: i + 1,
          lineType: "3",
          bomSelect: "1",
          warehouse: xsck.warehouse + "",
          product: row.product + "",
          productsku: row.productsku_cCode + "",
          mainUnitId: row.unit + "",
          stockUnitId: row.stockUnitId + "",
          invExchRate: row.invExchRate,
          stockStatusDoc: "2548990782527240",
          qty: row.qty,
          subQty: row.subQty
        };
        morphologyconversiondetail.push(zhafter);
        for (var j = 0; j < wlxq.length; j++) {
          var xq = wlxq[j];
          //转换前
          let zhbefore = {
            groupNumber: i + 1,
            lineType: "4",
            warehouse: xsck.warehouse + "",
            product: xq.bomComponentProductId + "",
            productsku: xq.ed_bom_list_userDefine001,
            mainUnitId: xq.BomComponent_bomUnit + "",
            stockUnitId: xq.bomComponent_stockUnit + "",
            invExchRate: xq.bomComponent_changeRate,
            stockStatusDoc: "2548990782527240",
            qty: row.qty * xq.BomComponent_numeratorQuantity,
            subQty: row.subQty * xq.bomComponent_stockNumeratorQuantity
          };
          morphologyconversiondetail.push(zhbefore);
        }
      }
    }
    let xtzhBody = undefined;
    if (morphologyconversiondetail.length > 0) {
      xtzhBody = {
        data: {
          org: xsck.salesOrg + "",
          businesstypeId: "yourIdHere",
          conversionType: "3",
          mcType: "3",
          vouchdate: getData(new Date(xsck.vouchdate)),
          "defines!define1": xsck.code,
          "defines!define2": xsck.id + "",
          morphologyconversiondetail: morphologyconversiondetail,
          _status: "Insert"
        }
      };
    }
    return { xtzhBody };
    function getData(date) {
      var now = new Date(xsck.vouchdate);
      //指定几个月后
      var wantDate = new Date(now.setDate(now.getDate() - 1));
      var nowstr = wantDate.getFullYear() + "-";
      if (wantDate.getMonth() + 1 < 10) {
        nowstr = nowstr + "0" + (wantDate.getMonth() + 1) + "-";
      } else {
        nowstr = nowstr + (wantDate.getMonth() + 1) + "-";
      }
      if (wantDate.getDate() < 10) {
        nowstr = nowstr + "0" + wantDate.getDate();
      } else {
        nowstr = nowstr + wantDate.getDate();
      }
      return nowstr;
    }
  }
}
exports({ entryPoint: MyAPIHandler });