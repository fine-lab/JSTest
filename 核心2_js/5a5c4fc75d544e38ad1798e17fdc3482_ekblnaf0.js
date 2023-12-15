String.prototype.format = function (args) {
  var result = this;
  if (arguments.length < 1) {
    return result;
  }
  var data = arguments;
  if (arguments.length == 1 && typeof args == "object") {
    data = args;
  }
  for (var key in data) {
    var value = data[key];
    if (undefined != value) {
      result = result.replace("{" + key + "}", value);
    }
  }
  return result;
};
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var filtration = request.filtration;
    var orgid = request.orgid;
    var productclassid = request.productclassid;
    var warehouseIds = request.warehouseIds;
    //所有仓库
    var Warehousesql = "select id,name from aa.warehouse.Warehouse";
    var Warehouselist = ObjectStore.queryByYonQL(Warehousesql, "productcenter");
    //现存量
    var CurrentStocksql = "select warehouse,product,currentqty,currentSubQty,batchno from stock.currentstock.CurrentStock where  currentqty >0 and org = '" + orgid + "'";
    var CurrentStocklist = ObjectStore.queryByYonQL(CurrentStocksql, "ustock");
    //批次
    var Batchnosql = "select  batchno,product,vendor from st.batchno.Batchno";
    var Batchnolist = ObjectStore.queryByYonQL(Batchnosql, "yonbip-scm-scmbd");
    //供应商
    var Vendorsql = "select id,nameAlias from aa.vendor.Vendor";
    var Vendorlist = ObjectStore.queryByYonQL(Vendorsql, "yssupplier");
    //仓库对应关系
    var sql = "select productId,org,productskuId,productclassId,productUnitId,warehouseId,id from st.wareandinv.WareAndInv";
    var res1 = ObjectStore.queryByYonQL(sql, "ustock");
    var Mainsql =
      "select id productId,unit productUnitId,name productName,code productCode,u.name batchPriceUnit,u.id batchPriceUnitid,u2.name batchUnit ,u2.id batchUnitid,mc.name productclassName,u3.name productUnitName,pe.assistUnit assistUnitm,u4.name assistUnitName  " +
      "from pc.product.Product " +
      "left join pc.product.ProductDetail d on id = d.productId " +
      "left join aa.product.ProductUnit u on d.batchPriceUnit = u.id " +
      "left join aa.product.ProductUnit u2 on d.batchUnit = u2.id " +
      "left join pc.cls.ManagementClass mc on mc.id = manageClass " +
      "left join aa.product.ProductUnit u3 on u3.id = unit " +
      "left join pc.product.ProductAssistUnitExchange pe on pe.productId = id " +
      "left join aa.product.ProductUnit u4 on u4.id = pe.assistUnit " +
      "where orgId = '" +
      orgid +
      "'";
    var result = Mainsql;
    if (productclassid) {
      var temp = "and manageClass = {productclassid}  ";
      result = temp.format(request);
      Mainsql += result;
    }
    if (warehouseIds) {
      var strs = "";
      for (var i = 0; i < warehouseIds.length; i++) {
        strs += warehouseIds[i] + ",";
      }
      strs = strs.substr(0, strs.length - 1);
      var temp = "and warehouseId in ({0}) ";
      result = temp.format(strs);
      Mainsql += result;
    }
    var res = ObjectStore.queryByYonQL(Mainsql, "productcenter");
    var resultlist = [];
    for (var i = 0; i < res.length; i++) {
      //批次
      var bool = true;
      for (var j = 0; j < CurrentStocklist.length; j++) {
        if (CurrentStocklist[j].warehouse == warehouseId && CurrentStocklist[j].product == productId && !res[i].hasOwnProperty("isRepeat")) {
          if (bool) {
            res[i]["currentqty"] = CurrentStocklist[j].currentqty;
            res[i]["currentSubQty"] = CurrentStocklist[j].currentSubQty == 0 ? CurrentStocklist[j].currentqty : CurrentStocklist[j].currentSubQty;
            var batchno = CurrentStocklist[j].batchno;
            if (batchno) {
              res[i]["batchno"] = batchno;
            } else {
              res[i]["batchno"] = "";
            }
            bool = false;
          } else {
            var model = JSON.parse(JSON.stringify(res[i]));
            res.push(model);
            res[res.length - 1]["currentqty"] = CurrentStocklist[j].currentqty;
            res[res.length - 1]["currentSubQty"] = CurrentStocklist[j].currentSubQty == 0 ? CurrentStocklist[j].currentqty : CurrentStocklist[j].currentSubQty;
            var batchno = CurrentStocklist[j].batchno;
            if (batchno) {
              res[res.length - 1]["batchno"] = batchno;
            } else {
              res[res.length - 1]["batchno"] = "";
            }
            res[res.length - 1]["isRepeat"] = 1;
          }
        }
      }
      if (bool && !res[i].hasOwnProperty("isRepeat")) {
        res[i]["currentqty"] = 0;
        res[i]["currentSubQty"] = 0;
        res[i]["batchno"] = "";
      }
      if (res[i].batchno != null && res[i].batchno != "") {
        for (var j = 0; j < Batchnolist.length; j++) {
          if (Batchnolist[j].batchno == res[i].batchno && Batchnolist[j].product == productId) {
            res[i]["vendor"] = Batchnolist[j].vendor;
          }
        }
        for (var j = 0; j < Vendorlist.length; j++) {
          if (Vendorlist[j].id == res[i].vendor) {
            res[i]["vendorName"] = Vendorlist[j].nameAlias;
          }
        }
      }
      if (!filtration) {
        resultlist.push(res[i]);
      } else if (res[i].productName.includes(filtration) || res[i].batchno.includes(filtration)) {
        resultlist.push(res[i]);
      }
    }
    var count = resultlist.length;
    return { resultlist, count };
  }
}
exports({ entryPoint: MyAPIHandler });