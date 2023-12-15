let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var warehouseIds = request.warmap;
    var type = "";
    var resultlist = [];
    if (warehouseIds) {
      var map1 = warehouseIds[0];
      var orgid1 = map1.orgid;
      let body = {
        billnum: "voucher_order"
      };
      if (request.type != null && request.type == "1") {
        type = "1";
      } else {
        body.org = orgid1;
      }
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "ST", JSON.stringify(body));
      let resdataMap = {};
      let resdata = JSON.parse(apiResponse);
      if (resdata != null && resdata.code != null && resdata.code == "200") {
        let data = resdata.data;
        if (data != null) {
          for (var w = 0; w < data.length; w++) {
            var warehouseData = data[w].warehouse;
            var productData = data[w].product;
            var batchnodata = data[w].batchno;
            if (data[w].batchno == null) {
              batchnodata = "";
            }
            var key = warehouseData + "-" + productData + "-" + batchnodata;
            if (resdataMap[key] != null && resdataMap[key] != "") {
              var xiancunliang = resdataMap[key]; //现存量
              var zhanyongliang = data[w].availableqty; //被占用数量
              var newXiancunLiang = xiancunliang + zhanyongliang;
              resdataMap[key] = newXiancunLiang;
            } else {
              resdataMap[key] = data[w].availableqty;
            }
          }
        }
      } // return {resdataMap};
      var CurrentStocklsql1 =
        "select    a.productId productId ,a.stockId stockId ,a.batchNo batchNo, sum(a.subQty) subQty " +
        " from voucher.order.Order  inner join voucher.order.OrderDetail   a on  a.orderId = id  " +
        " where  (nextStatus  =  'CONFIRMORDER'  or nextStatus = 'DELIVERGOODS')   and  a.stockId != null   ";
      if (type == "") {
        CurrentStocklsql1 = CurrentStocklsql1 + " and salesOrgId = '" + orgid1 + "' ";
      }
      CurrentStocklsql1 = CurrentStocklsql1 + "  group by    a.productId ,a.stockId ,a.batchNo ";
      var materiallist = ObjectStore.queryByYonQL(CurrentStocklsql1, "udinghuo");
      let materialMap = {};
      for (var w = 0; w < materiallist.length; w++) {
        var warehouseData = materiallist[w].stockId;
        var productData = materiallist[w].productId;
        var batchnodata = materiallist[w].batchNo;
        if (materiallist[w].batchNo == null) {
          batchnodata = "";
        }
        var key = warehouseData + "-" + productData + "-" + batchnodata;
        materialMap[key] = materiallist[w].subQty;
      }
      for (var i = 0; i < warehouseIds.length; i++) {
        var map = warehouseIds[i];
        var warehouse = map.warehouse;
        var batchno = map.batchno;
        var product = map.product;
        var productname = map.productname;
        var orgid = map.orgid;
        var number = map.number;
        var weight = map.weight;
        var batchUnitid = map.batchUnitid;
        var batchPriceUnitid = map.batchPriceUnitid;
        var CurrentStocksql =
          "select warehouse,product,currentqty,currentSubQty,batchno from " +
          "stock.currentstock.CurrentStock where  currentqty >0   " +
          " and warehouse='" +
          warehouse +
          "'  and product='" +
          product +
          "'  ";
        if (batchno != null && batchno != "") {
          CurrentStocksql = CurrentStocksql + "  and batchno='" + batchno + "' ";
        }
        if (type == "") {
          CurrentStocksql = CurrentStocksql + " and org = '" + orgid + "' ";
        }
        var CurrentStocklist = ObjectStore.queryByYonQL(CurrentStocksql, "ustock");
        if (CurrentStocklist == null || CurrentStocklist.length == 0) {
          let CurrentStock = {};
          CurrentStock["warehouse"] = warehouse;
          CurrentStock["batchno"] = batchno;
          CurrentStock["product"] = product;
          CurrentStock["currentSubQty"] = 0;
          CurrentStock["currentqty"] = 0;
          CurrentStock["productname"] = productname;
          CurrentStock["code"] = 0;
          CurrentStock["msg"] = productname + "库存数量不足";
          resultlist.push(CurrentStock);
        } else {
          var dataRet = CurrentStocklist[0];
          var warehouseData = CurrentStocklist[0].warehouse;
          var batchnodata = CurrentStocklist[0].batchno;
          var productData = CurrentStocklist[0].product;
          if (CurrentStocklist[0].batchno == null) {
            batchnodata = "";
            dataRet["batchno"] = batchnodata;
          }
          var key = warehouseData + "-" + productData + "-" + batchnodata;
          if (resdataMap[key] != null) {
            var xincunl = resdataMap[key];
            if (xincunl.toString().split(".").length > 1 && xincunl.toString().split(".")[1].length > 2) {
              xincunl = xincunl.toFixed(2);
            }
            dataRet["currentqty"] = xincunl; //.toFixed(2)
          }
          if (materialMap[key] != null) {
            var currentSubQty = CurrentStocklist[0].currentSubQty;
            var xincunl = materialMap[key];
            var xiancunjian = currentSubQty - xincunl;
            if (xiancunjian.toString().split(".").length > 1 && xiancunjian.toString().split(".")[1].length > 2) {
              xiancunjian = xiancunjian.toFixed(2);
            }
            dataRet["currentSubQty"] = xiancunjian; //.toFixed(2)
          }
          dataRet["productname"] = productname; //.toFixed(2)
          if (batchUnitid == batchPriceUnitid) {
            if (weight > parseFloat(dataRet.currentqty)) {
              dataRet["code"] = 0;
              dataRet["msg"] = productname + "库存数量不足";
            } else {
              dataRet["code"] = 200;
              dataRet["msg"] = productname + "库存数量充足，可以下单";
            }
          } else {
            if (weight > parseFloat(dataRet.currentqty) || number > parseFloat(dataRet.currentSubQty)) {
              dataRet["code"] = 0;
              dataRet["msg"] = productname + "库存数量不足";
            } else {
              dataRet["code"] = 200;
              dataRet["msg"] = productname + "库存数量充足，可以下单";
            }
          }
          resultlist.push(dataRet);
        }
      }
    }
    var count = resultlist.length;
    return { resultlist, count };
  }
}
exports({ entryPoint: MyAPIHandler });