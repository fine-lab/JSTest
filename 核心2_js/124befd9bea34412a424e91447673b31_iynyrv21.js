let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //列表页面销售出库推形态转换
    //获取销售出库
    let rows = request.rows;
    let func_1 = extrequire("ST.backDefaultGroup.getWLdetail");
    let rst = [];
    let response = [];
    for (var k = 0; k < rows.length; k++) {
      let row = rows[k];
      //获取销售出库详情
      let getxsckUrl = "https://www.example.com/" + row.id;
      let xsckDetailResponse = openLinker("GET", getxsckUrl, "ST", null);
      let xsckResponseobj = JSON.parse(xsckDetailResponse);
      if ("200" == xsckResponseobj.code) {
        let data = xsckResponseobj.data;
        let details = data.details;
        if (details.length > 0) {
          let morphologyconversiondetail = [];
          for (var i = 0; i < details.length; i++) {
            let detail = details[i];
            let productId = detail.product + "";
            let vouchdate = row.vouchdate;
            let free1 = detail.free1;
            let wlxqRst = undefined;
            wlxqRst = func_1.execute(productId, free1, vouchdate);
            //转换后
            let wlxq = wlxqRst.rst;
            if (wlxq.length > 0) {
              //转换后
              let zhafter = {
                groupNumber: i + 1,
                lineType: "3",
                warehouse: row.warehouse + "",
                product: detail.product + "",
                productsku: detail.productsku + "",
                mainUnitId: detail.unit + "",
                stockUnitId: detail.stockUnitId + "",
                invExchRate: detail.invExchRate,
                qty: detail.qty,
                subQty: detail.subQty
              };
              morphologyconversiondetail.push(zhafter);
              for (var j = 0; j < wlxq.length; j++) {
                var xq = wlxq[j];
                //转换前
                let zhbefore = {
                  groupNumber: i + 1,
                  lineType: "4",
                  warehouse: row.warehouse + "",
                  product: xq.bomComponentProductId + "",
                  productsku: xq.ed_bom_list_userDefine001,
                  mainUnitId: xq.BomComponent_bomUnit + "",
                  stockUnitId: xq.bomComponent_stockUnit + "",
                  invExchRate: xq.bomComponent_changeRate,
                  qty: row.qty * xq.BomComponent_numeratorQuantity,
                  subQty: row.subQty * xq.bomComponent_stockNumeratorQuantity
                };
                morphologyconversiondetail.push(zhbefore);
              }
            }
          }
          var now = new Date(row.vouchdate);
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
          let xtzhBody = {
            data: {
              org: row.salesOrg + "",
              businesstypeId: "yourIdHere",
              conversionType: "3",
              mcType: "3",
              vouchdate: nowstr,
              "defines!define1": row.code,
              "defines!define2": row.id + "",
              morphologyconversiondetail: morphologyconversiondetail,
              _status: "Insert"
            }
          };
          let func_2 = extrequire("ST.backDefaultGroup.addXTZH");
          let savextzh = func_2.execute(xtzhBody);
          let savextzhRst = savextzh.rst;
          let addResult = {
            resCode: savextzhRst.code,
            code: row.code,
            message: savextzhRst.message
          };
          rst.push(addResult);
        }
      }
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });