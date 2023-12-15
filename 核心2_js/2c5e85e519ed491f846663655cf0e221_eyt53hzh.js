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
    let sql = "select * from pc.product.Product";
    let productInfo = ObjectStore.queryByYonQL(sql, "productcenter");
    //查询所有仓库
    let queryWareHouse = "select id,name  from  aa.warehouse.Warehouse";
    let warehouseList = ObjectStore.queryByYonQL(queryWareHouse, "productcenter");
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
    //查询批次号
    let queryBatch = "select batchno,producedate,invaliddate,warehouse,product  from  st.batchno.Batchno";
    let batchInfo = ObjectStore.queryByYonQL(queryBatch, "ustock"); //客户环境:ObjectStore.queryByYonQL(queryBatch, "ustock");
    //获取组织
    let queryOrg = "select name from org.func.BaseOrg where id = " + request.org;
    let orgInfo = ObjectStore.queryByYonQL(queryOrg, "ucf-org-center");
    if (typeof currentStockInfo != "undefined") {
      for (let i = 0; i < currentStockInfo.length; i++) {
        if (currentStockInfo[i].currentqty > 0) {
          let info = {};
          info.product = currentStockInfo[i].product;
          for (let j = 0; j < productInfo.length; j++) {
            if (currentStockInfo[i].product == productInfo[j].id) {
              info.product_name = productInfo[j].name;
              info.product_code = productInfo[j].code;
              info.bwm = productInfo[j].extend_standard_code;
              info.package_specification = productInfo[j].extend_package_specification;
              break;
            }
          }
          info.qty = currentStockInfo[i].currentqty;
          info.org = request.org;
          info.org_name = orgInfo[0].name;
          if (request.statusName != undefined && request.statusName != "") {
            info.statusName = warehouseStatusList[0].statusName;
          } else {
            for (let j = 0; j < warehouseStatusList.length; j++) {
              if (currentStockInfo[i].stockStatusDoc == warehouseStatusList[j].id) {
                info.statusName = warehouseStatusList[j].statusName;
                break;
              }
            }
          }
          for (let j = 0; j < warehouseList.length; j++) {
            if (currentStockInfo[i].warehouse == warehouseList[j].id) {
              info.warehouse = warehouseList[j].name;
              break;
            }
          }
          if (currentStockInfo[i].batchno != undefined && currentStockInfo[i].batchno != "" && currentStockInfo[i].warehouse != undefined && currentStockInfo[i].warehouse != "") {
            for (let j = 0; j < batchInfo.length; j++) {
              if (currentStockInfo[i].batchno == batchInfo[j].batchno && currentStockInfo[i].product == batchInfo[j].product) {
                info.batchno = batchInfo[j].batchno;
                info.producedate = batchInfo[j].producedate;
                info.invaliddate = batchInfo[j].invaliddate;
                break;
              }
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