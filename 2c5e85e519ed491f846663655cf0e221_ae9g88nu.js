let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let currentInfo = [];
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //现存量查询
    let qtyUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/stock/QueryCurrentStocksByCondition";
    let qtyBody = {};
    if (request.statusName != undefined && request.statusName != "") {
      qtyBody = { org: request.org, stockStatusDoc: request.statusName };
    } else {
      qtyBody = { org: request.org };
    }
    let qtyRes = openLinker("POST", qtyUrl, apiPreAndAppCode.appCode, JSON.stringify(qtyBody));
    qtyRes = JSON.parse(qtyRes);
    let currentStockInfo = qtyRes.data;
    //查询物料
    let products = [];
    for (let i = 0; i < currentStockInfo.length; i++) {
      let product = currentStockInfo[i].product;
      products.push(product);
    }
    let str_products = products.join(",");
    let sql = "";
    if (str_products.length > 10) {
      sql = "select * from pc.product.Product  where id in (" + str_products + ")";
    } else {
      sql = "select * from pc.product.Product ";
    }
    let productInfo = ObjectStore.queryByYonQL(sql, "productcenter");
    let productRes = {};
    for (let i = 0; i < productInfo.length; i++) {
      if (!productRes.hasOwnProperty(productInfo[i].id)) {
        productRes[productInfo[i].id] = productInfo[i];
      }
    }
    //查询所有仓库
    let queryWareHouse = "select id,name  from  aa.warehouse.Warehouse";
    let warehouseList = ObjectStore.queryByYonQL(queryWareHouse, "productcenter");
    let warehouseRes = {};
    for (let i = 0; i < warehouseList.length; i++) {
      if (!warehouseRes.hasOwnProperty(warehouseList[i].id)) {
        warehouseRes[warehouseList[i].id] = warehouseList[i];
      }
    }
    //查询库存状态
    let queryWareHouseStatus = "";
    let warehouseStatusList = [];
    if (request.statusName != undefined && request.statusName != "") {
      queryWareHouseStatus = "select id,statusName from st.stockStatusRecord.stockStatusRecord where id=" + request.statusName;
      warehouseStatusList = ObjectStore.queryByYonQL(queryWareHouseStatus, "ustock");
    } else {
      queryWareHouseStatus = "select id,statusName from st.stockStatusRecord.stockStatusRecord";
      warehouseStatusList = ObjectStore.queryByYonQL(queryWareHouseStatus, "ustock");
    }
    let warehouseStatusRes = {};
    for (let i = 0; i < warehouseStatusList.length; i++) {
      if (!warehouseStatusRes.hasOwnProperty(warehouseStatusList[i].id)) {
        warehouseStatusRes[warehouseStatusList[i].id] = warehouseStatusList[i];
      }
    }
    let tempStr = "";
    //查询批次号
    let queryBatch = "select batchno,producedate,invaliddate,warehouse,product  from  st.batchno.Batchno";
    let batchInfo = ObjectStore.queryByYonQL(queryBatch, "ustock"); //客户环境:ObjectStore.queryByYonQL(queryBatch, "ustock");
    let batchRes = {};
    for (let i = 0; i < batchInfo.length; i++) {
      tempStr = batchInfo[i].product.toString() + (batchInfo[i].batchno == undefined ? "" : batchInfo[i].batchno.toString());
      if (!batchRes.hasOwnProperty(tempStr)) {
        batchRes[tempStr] = batchInfo[i];
      }
    }
    //获取组织
    let queryOrg = "select name from org.func.BaseOrg where id = " + request.org;
    let orgInfo = ObjectStore.queryByYonQL(queryOrg, "ucf-org-center");
    if (typeof currentStockInfo != "undefined") {
      for (let i = 0; i < currentStockInfo.length; i++) {
        if (currentStockInfo[i].currentqty > 0) {
          let info = {};
          info.product = currentStockInfo[i].product;
          info.product_name = productRes[currentStockInfo[i].product].name;
          info.product_code = productRes[currentStockInfo[i].product].code;
          info.bwm = productRes[currentStockInfo[i].product].extend_standard_code;
          info.package_specification = productRes[currentStockInfo[i].product].extend_package_specification;
          info.qty = currentStockInfo[i].currentqty;
          info.org = request.org;
          info.org_name = orgInfo[0].name;
          if (request.statusName != undefined && request.statusName != "") {
            info.statusId = warehouseStatusList[0].id;
            info.statusName = warehouseStatusList[0].statusName;
          } else {
            info.statusId = warehouseStatusRes[currentStockInfo[i].stockStatusDoc].id;
            info.statusName = warehouseStatusRes[currentStockInfo[i].stockStatusDoc].statusName;
          }
          info.warehouse = warehouseRes[currentStockInfo[i].warehouse].name;
          if (currentStockInfo[i].batchno != undefined && currentStockInfo[i].batchno != "" && currentStockInfo[i].warehouse != undefined && currentStockInfo[i].warehouse != "") {
            let tempBatchStr = currentStockInfo[i].product.toString() + (currentStockInfo[i].batchno == undefined ? "" : currentStockInfo[i].batchno.toString());
            if (batchRes.hasOwnProperty(tempBatchStr)) {
              info.batchno = batchRes[tempBatchStr].batchno;
              info.producedate = batchRes[tempBatchStr].producedate;
              info.invaliddate = batchRes[tempBatchStr].invaliddate;
            }
          } else {
            info.batchno = "";
          }
          currentInfo.push(info);
        }
      }
    }
    return { currentInfo };
  }
}
exports({ entryPoint: MyAPIHandler });