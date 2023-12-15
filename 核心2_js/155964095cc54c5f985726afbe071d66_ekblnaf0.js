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
    var orgid = "";
    var productclassid = request.productclassid;
    var warehouseIds = request.warehouseIds;
    if (request.orgid != null && request.orgid != "") {
      orgid = request.orgid;
    }
    //所有仓库
    var Warehousesql = "select id,name from aa.warehouse.Warehouse";
    var resultWarehousesql = Warehousesql;
    if (warehouseIds) {
      var strs = "";
      for (var i = 0; i < warehouseIds.length; i++) {
        strs += warehouseIds[i] + ",";
      }
      strs = strs.substr(0, strs.length - 1);
      var temp = " where id in ({0}) ";
      resultWarehousesql = temp.format(strs);
      Warehousesql = Warehousesql + resultWarehousesql;
    }
    var Warehouselist = ObjectStore.queryByYonQL(Warehousesql, "productcenter");
    let WarehouselistMap = {};
    for (var z = 0; z < Warehouselist.length; z++) {
      WarehouselistMap[Warehouselist[z].id] = Warehouselist[z];
    }
    //批次
    var Batchnosql = "select  batchno,product,vendor from st.batchno.Batchno";
    var Batchnolist = ObjectStore.queryByYonQL(Batchnosql, "yonbip-scm-scmbd");
    //供应商
    //仓库对应关系
    let body = {
      billnum: "voucher_order"
    };
    if (orgid != null && orgid != "") {
      body.org = orgid;
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
          var batchnodata = "";
          if (data[w].batchno != undefined && data[w].batchno != null && data[w].batchno != "") {
            batchnodata = data[w].batchno;
          } else {
            batchnodata = "默认";
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
    }
    var CurrentStocklsql1 =
      "select    a.productId productId ,a.stockId stockId ,a.batchNo batchNo1, sum(a.subQty) subQty " +
      " from voucher.order.Order  inner join voucher.order.OrderDetail   a on  a.orderId = id  " +
      " where  (nextStatus  =  'CONFIRMORDER'  or nextStatus = 'DELIVERGOODS') and  a.stockId != null    ";
    if (orgid != null && orgid != "") {
      CurrentStocklsql1 = CurrentStocklsql1 + "  and salesOrgId = '" + orgid + "'  ";
    }
    CurrentStocklsql1 = CurrentStocklsql1 + "  group by   a.productId ,a.stockId ,a.batchNo ";
    var materiallist = ObjectStore.queryByYonQL(CurrentStocklsql1, "udinghuo");
    let materialMap = {};
    for (var w = 0; w < materiallist.length; w++) {
      var warehouseData = materiallist[w].stockId;
      var productData = materiallist[w].productId;
      var batchnodata = "";
      if (materiallist[w].batchNo1 != undefined && materiallist[w].batchNo1 != null && materiallist[w].batchNo1 != "") {
        batchnodata = materiallist[w].batchNo1;
      } else {
        batchnodata = "默认";
      }
      var key = warehouseData + "-" + productData + "-" + batchnodata;
      materialMap[key] = materiallist[w].subQty;
    }
    var Mainsql =
      "select id productId,unit productUnitId,name productName,code productCode,u.name batchPriceUnit,u.id batchPriceUnitid,u2.name batchUnit ," +
      "u2.id batchUnitid,mc.name productclassName,u3.name productUnitName,pe.assistUnit assistUnitm,u4.name assistUnitName,orgId org, manageClass  productclassId " +
      "from pc.product.Product " +
      "left join pc.product.ProductDetail d on id = d.productId " +
      "left join aa.product.ProductUnit u on d.batchPriceUnit = u.id " +
      "left join aa.product.ProductUnit u2 on d.batchUnit = u2.id " +
      "left join pc.cls.ManagementClass mc on mc.id = manageClass " +
      "left join aa.product.ProductUnit u3 on u3.id = unit " +
      "left join pc.product.ProductAssistUnitExchange pe on pe.productId = id " +
      "left join aa.product.ProductUnit u4 on u4.id = pe.assistUnit " +
      "where  1=1 ";
    if (orgid != null && orgid != "") {
      Mainsql = Mainsql + "  and orgId = '" + orgid + "'  ";
    }
    let proclassListMap = {};
    var result = Mainsql;
    if (productclassid) {
      var temp = "and manageClass = {productclassid}  ";
      result = temp.format(request);
      Mainsql += result;
    } else {
      var proclasssql1 = "select  id  from  	pc.cls.ManagementClass where  parent in ('1628655679021514771','1628655679021514762')  ";
      var proclassList = ObjectStore.queryByYonQL(proclasssql1, "productcenter");
      for (var i = 0; i < proclassList.length; i++) {
        var classid = proclassList[i].id;
        proclassListMap[classid] = classid;
      }
    }
    let batchnoMap = {};
    let materialListMap = {};
    var res = ObjectStore.queryByYonQL(Mainsql, "productcenter");
    for (var i = 0; i < res.length; i++) {
      var productId = res[i].productId;
      if (!productclassid && res[i].productclassId != null && res[i].productclassId != "") {
        var classid = res[i].productclassId;
        if (proclassListMap[classid] != null) {
          materialListMap[productId] = res[i];
        }
      } else {
        materialListMap[productId] = res[i];
      }
    }
    var resultlist = [];
    //现存量
    var CurrentStocksql = "select warehouse,product,currentqty,currentSubQty,batchno from stock.currentstock.CurrentStock where  currentqty >0   ";
    if (orgid != null && orgid != "") {
      CurrentStocksql = CurrentStocksql + "  and   org = '" + orgid + "'  ";
    } else {
      CurrentStocksql = CurrentStocksql + "  and   org in ('1624180950145433604' ,'1624184918710943750') ";
    }
    var resultCurrentStocksql = CurrentStocksql;
    if (warehouseIds) {
      var strs = "";
      for (var i = 0; i < warehouseIds.length; i++) {
        strs += warehouseIds[i] + ",";
      }
      strs = strs.substr(0, strs.length - 1);
      var temp = " and warehouse in ({0}) ";
      resultCurrentStocksql = temp.format(strs);
      CurrentStocksql = CurrentStocksql + resultCurrentStocksql;
    }
    var CurrentStocklist = ObjectStore.queryByYonQL(CurrentStocksql, "ustock");
    for (var i = 0; i < CurrentStocklist.length; i++) {
      var productId = CurrentStocklist[i].product;
      if (materialListMap[productId] != null) {
        var res1 = materialListMap[productId];
        var dataMag = CurrentStocklist[i];
        dataMag["productCode"] = res1.productCode;
        dataMag["batchPriceUnit"] = res1.batchPriceUnit;
        dataMag["batchUnitid"] = res1.batchUnitid;
        dataMag["productId"] = res1.productId;
        dataMag["org"] = res1.org;
        dataMag["productclassName"] = res1.productclassName;
        dataMag["productUnitName"] = res1.productUnitName;
        dataMag["batchUnit"] = res1.batchUnit;
        dataMag["productclassId"] = res1.productclassId;
        dataMag["batchPriceUnitid"] = res1.batchPriceUnitid;
        dataMag["productName"] = res1.productName;
        dataMag["productUnitId"] = res1.productUnitId;
        dataMag["assistUnit"] = res1.assistUnit;
        dataMag["assistUnitName"] = res1.assistUnitName;
        dataMag["currentqty"] = CurrentStocklist[i].currentqty;
        dataMag["currentSubQty"] = CurrentStocklist[i].currentSubQty;
        dataMag["warehouseId"] = CurrentStocklist[i].warehouse;
        var batchno1 = "";
        if (CurrentStocklist[i].batchno != undefined && CurrentStocklist[i].batchno != null && CurrentStocklist[i].batchno != "") {
          batchno1 = CurrentStocklist[i].batchno;
          dataMag["batchno"] = batchno1;
        } else {
          batchno1 = "";
          dataMag["batchno"] = batchno1;
        }
        //仓库
        var warehouseId = dataMag.warehouseId;
        if (WarehouselistMap[warehouseId] != null && WarehouselistMap[warehouseId] != "") {
          var warehouseObj = WarehouselistMap[warehouseId];
          dataMag["warehouseName"] = warehouseObj.name;
        }
        if (batchno1 == "") {
          batchno1 = "默认";
        }
        var key = warehouseId + "-" + productId + "-" + batchno1;
        if (resdataMap[key] != null) {
          var xincunl = resdataMap[key];
          dataMag["currentqty"] = xincunl;
        }
        var flag = true;
        if (dataMag.batchPriceUnitid != dataMag.batchUnitid && materialMap[key] != null) {
          var currentSubQty = dataMag.currentSubQty;
          var xincunl = materialMap[key];
          var xiancunjian = currentSubQty - xincunl;
          if (xiancunjian.toString().split(".").length > 1 && xiancunjian.toString().split(".")[1].length > 2) {
            xiancunjian = xiancunjian.toFixed(2);
          }
          if (xiancunjian <= 0) {
            flag = false;
          }
          dataMag["currentSubQty"] = xiancunjian; //.toFixed(2)
          var currentqty = dataMag.currentqty;
          if (currentqty.toString().split(".").length > 1 && currentqty.toString().split(".")[1].length > 2) {
            currentqty = currentqty.toFixed(2);
            dataMag["currentqty"] = currentqty; //.toFixed(2)
          }
        } else {
          if (dataMag.batchPriceUnitid != dataMag.batchUnitid && dataMag.currentSubQty <= 0) {
            flag = false;
          } else {
            var currentqty = dataMag.currentqty;
            if (currentqty.toString().split(".").length > 1 && currentqty.toString().split(".")[1].length > 2) {
              currentqty = currentqty.toFixed(2);
              dataMag["currentqty"] = currentqty; //.toFixed(2)
            }
          }
        }
        if (flag) {
          if (!filtration) {
            resultlist.push(dataMag);
          } else if (dataMag.productName.includes(filtration) || batchno1.includes(filtration)) {
            resultlist.push(dataMag);
          }
        }
      }
    }
    var count = resultlist.length;
    return { resultlist, count };
  }
}
exports({ entryPoint: MyAPIHandler });