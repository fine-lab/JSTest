let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let currentInfo = [];
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //现存量查询
    let qtyUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/stock/QueryCurrentStocksByCondition";
    let qtyBody = {};
    if (typeof request.statusName != "undefined" && request.statusName != "") {
      if (typeof request.warehouse != "undefined" && request.warehouse != "") {
        qtyBody = { org: request.org, stockStatusDoc: request.statusName, warehouse: request.warehouse };
      } else {
        qtyBody = { org: request.org, stockStatusDoc: request.statusName };
      }
    } else if (typeof request.warehouse != "undefined" && request.warehouse != "") {
      if (typeof request.statusName != "undefined" && request.statusName != "") {
        qtyBody = { org: request.org, stockStatusDoc: request.statusName, warehouse: request.warehouse };
      } else {
        qtyBody = { org: request.org, warehouse: request.warehouse };
      }
    } else {
      qtyBody = { org: request.org };
    }
    let qtyRes = openLinker("POST", qtyUrl, apiPreAndAppCode.appCode, JSON.stringify(qtyBody));
    qtyRes = JSON.parse(qtyRes);
    let currentStockInfo = qtyRes.data;
    if (JSON.stringify(currentStockInfo) == "null") {
      throw new Error("该组织没有相关库存，请检查查询条件");
    }
    //查询物料
    let products = [];
    let productClassArr = [];
    let productUnitArr = [];
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
        productClassArr.push(productInfo[i].manageClass);
        productUnitArr.push(productInfo[i].unit);
        if (typeof productInfo[i].assistUnit != "undefined" && productInfo[i].assistUnit != null) {
          productUnitArr.push(productInfo[i].assistUnit);
        }
      }
    }
    let str_productClassArr = productClassArr.join(",");
    let str_productUnitArr = productUnitArr.join(",");
    //查询物料分类
    let proClassql = "";
    if (str_productClassArr.length > 10) {
      proClassql = "select * from pc.cls.ManagementClass where id in (" + str_productClassArr + ")";
    } else {
      proClassql = "select * from pc.cls.ManagementClass";
    }
    let proClassInfo = ObjectStore.queryByYonQL(proClassql, "productcenter");
    let proClassRes = {};
    for (let i = 0; i < proClassInfo.length; i++) {
      if (!proClassRes.hasOwnProperty(proClassInfo[i].id)) {
        proClassRes[proClassInfo[i].id] = proClassInfo[i];
      }
    }
    //查询物料计量单位
    let proUnitql = "";
    if (str_productUnitArr.length > 10) {
      proUnitql = "select * from aa.product.ProductUnit where id in (" + str_productUnitArr + ")";
    } else {
      proUnitql = "select * from aa.product.ProductUnit";
    }
    let proUnitInfo = ObjectStore.queryByYonQL(proUnitql, "productcenter");
    let proUnitRes = {};
    for (let i = 0; i < proUnitInfo.length; i++) {
      if (!proUnitRes.hasOwnProperty(proUnitInfo[i].id)) {
        proUnitRes[proUnitInfo[i].id] = proUnitInfo[i];
      }
    }
    //查询GSP医药物料
    let gspSql = "";
    let lpholders = [];
    if (str_products.length > 10) {
      gspSql = "select * from GT22176AT10.GT22176AT10.SY01_material_file where material in (" + str_products + ")";
    } else {
      gspSql = "select * from GT22176AT10.GT22176AT10.SY01_material_file";
    }
    let gspProductInfo = ObjectStore.queryByYonQL(gspSql, "sy01");
    let gspProductRes = {};
    for (let i = 0; i < gspProductInfo.length; i++) {
      if (!gspProductRes.hasOwnProperty(gspProductInfo[i].id)) {
        gspProductRes[gspProductInfo[i].material] = gspProductInfo[i];
        lpholders.push(gspProductInfo[i].listingHolder);
      }
    }
    for (let i = 0; i < lpholders.length; i++) {
      if (lpholders[i] == null || typeof lpholders[i] == "undefined") {
        lpholders.splice(i, 1);
        i--;
      }
    }
    let str_lpholders = lpholders.join(",");
    //查询上市许可人
    let gsplpholderSql = "";
    if (str_lpholders.length > 10) {
      gsplpholderSql = "select * from GT22176AT10.GT22176AT10.t_sy01_lpholderv3 where id in (" + str_lpholders + ")";
    } else {
      gsplpholderSql = "select * from GT22176AT10.GT22176AT10.t_sy01_lpholderv3";
    }
    let gsplpholderInfo = ObjectStore.queryByYonQL(gsplpholderSql, "sy01");
    let gsplpholderRes = {};
    for (let i = 0; i < gsplpholderInfo.length; i++) {
      if (!gsplpholderRes.hasOwnProperty(gsplpholderInfo[i].id)) {
        gsplpholderRes[gsplpholderInfo[i].id] = gsplpholderInfo[i];
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
    //获取组织
    let queryOrg = "select name from org.func.BaseOrg where id = " + request.org;
    let orgInfo = ObjectStore.queryByYonQL(queryOrg, "ucf-org-center");
    if (typeof currentStockInfo != "undefined") {
      for (let i = 0; i < currentStockInfo.length; i++) {
        if (currentStockInfo[i].currentqty > 0) {
          let gspProObj = gspProductRes[currentStockInfo[i].product];
          if (JSON.stringify(gspProObj) != "{}" && typeof gspProObj != "undefined") {
            let info = {};
            info.product = currentStockInfo[i].product;
            info.product_name = productRes[currentStockInfo[i].product].name;
            info.product_code = productRes[currentStockInfo[i].product].code;
            if (gspProObj.hasOwnProperty("standardCode")) {
              info.bwm = gspProObj.standardCode;
            }
            info.package_specification = productRes[currentStockInfo[i].product].extend_package_specification;
            info.specification = productRes[currentStockInfo[i].product].modelDescription;
            info.productType = productRes[currentStockInfo[i].product].manageClass;
            info.productType_name = proClassRes[productRes[currentStockInfo[i].product].manageClass].name;
            info.unit = productRes[currentStockInfo[i].product].unit;
            info.unit_name = proUnitRes[productRes[currentStockInfo[i].product].unit].name;
            if (typeof productRes[currentStockInfo[i].product].assistUnit != "undefined" && productRes[currentStockInfo[i].product].assistUnit != null) {
              info.unity = productRes[currentStockInfo[i].product].assistUnit;
              info.unity_name = proUnitRes[productRes[currentStockInfo[i].product].assistUnit].name;
            }
            info.listingLicensor = gspProObj.listingHolder;
            if (typeof gspProObj.listingHolder != "undefined" && gspProObj.listingHolder != null) {
              info.listingLicensor_ip_name = gsplpholderRes[gspProObj.listingHolder].ip_name;
            }
            info.manufacturer = productRes[currentStockInfo[i].product].manufacturer;
            info.currentStockCharacteristic = currentStockInfo[i].currentStockCharacteristic; //自由项特征组
            info.availableqty = currentStockInfo[i].availableqty;
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
            info.warehouse = warehouseRes[currentStockInfo[i].warehouse].id;
            info.warehouse_name = warehouseRes[currentStockInfo[i].warehouse].name;
            //批次号
            info.batchno = currentStockInfo[i].batchno;
            info.producedate = currentStockInfo[i].producedate;
            info.invaliddate = currentStockInfo[i].invaliddate;
            currentInfo.push(info);
          }
        }
      }
    }
    return { currentInfo };
  }
}
exports({ entryPoint: MyAPIHandler });