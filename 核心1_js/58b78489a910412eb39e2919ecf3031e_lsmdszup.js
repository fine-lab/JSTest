let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let filterSchemeId = request.filterSchemeId; //养护过滤方案id
    let orgId = request.orgId; //组织id
    let tenantId = request.tenantId; //租户id脚手架使用
    let warehouseId = request.warehouseId; //仓库id
    let warehouseName = request.warehouseName; //仓库名称
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let materialFileFilterUrl = apiPreAndAppCode.apiRestPre + "/filtersScheme/materialFileFilter";
    let filterParam = { filterSchemeId: filterSchemeId, orgId: orgId, tenantId: tenantId, warehouseId: warehouseId, warehouseName: warehouseName };
    let warehouseSql = "select isGoodsPosition from 	aa.warehouse.Warehouse where    id ='" + warehouseId + "' ";
    let warehouse = ObjectStore.queryByYonQL(warehouseSql, "productcenter");
    let s = new Date().getTime();
    let stockStatusSql = "select id from 	st.stockStatusRecord.stockStatusRecord where statusName ='合格' ";
    let stockStatusRecord = ObjectStore.queryByYonQL(stockStatusSql, "ustock");
    if (warehouse[0].isGoodsPosition) {
      let currentStockLocationSql =
        "select id currentStockId, location,currentqty,batchno,product,productsku,productsku.cCode,productsku.skuName,location.name,producedate,invaliddate,currentStockCharacteristic features  from 	stock.currentstock.CurrentStockLocation where currentqty >0 and warehouse.id ='" +
        warehouseId +
        "' and stockStatusDoc.id='" +
        stockStatusRecord[0].id +
        "'  ";
      let currentStockLocation = ObjectStore.queryByYonQL(currentStockLocationSql, "ustock");
      filterParam.currentStock = currentStockLocation;
    } else {
      let currentStockSql =
        "select id currentStockId , '' location,'' location_name, currentqty,batchno,product,productsku,productsku.cCode,productsku.skuName,producedate,invaliddate,currentStockCharacteristic features  from 	stock.currentstock.CurrentStock where currentqty >0 and warehouse.id ='" +
        warehouseId +
        "' and stockStatusDoc.id='" +
        stockStatusRecord[0].id +
        "' ";
      let currentStock = ObjectStore.queryByYonQL(currentStockSql, "ustock");
      filterParam.currentStock = currentStock;
    }
    if (filterParam.currentStock == null || filterParam.currentStock == undefined || filterParam.currentStock.length == 0) {
      return { result: null };
    }
    let materialFileIds = [];
    for (let i = 0; i < filterParam.currentStock.length; i++) {
      let currentStock = filterParam.currentStock[i];
      let materialFileSql =
        "select id,freeCTH,isSku from 	GT22176AT10.GT22176AT10.SY01_material_file  where org_id ='" +
        orgId +
        "' and material='" +
        currentStock.product +
        "'   and freeCTH='" +
        currentStock.features +
        "'";
      let materialFiles = ObjectStore.queryByYonQL(materialFileSql, "sy01");
      if (currentStock.features != null && currentStock.features != undefined) {
        //有特征进行匹配
        //查询原厂特征模板id
        let queryTemplateInfo = "select productTemplate.id id,productTemplate.name name from pc.product.Product where id = '" + currentStock.product + "'";
        let template = ObjectStore.queryByYonQL(queryTemplateInfo, "productcenter")[0].id;
        //查询特征模板特征编码
        let yonql = "select featureId,featureName,featureCode,gspControl from GT22176AT10.GT22176AT10.sy01_freeFeature where drugFeatrueConfig_id.template = '" + template + "'";
        let controlRes = ObjectStore.queryByYonQL(yonql, "sy01");
        for (let j = 0; j < materialFiles.length; j++) {
          if (materialFileIds.includes(materialFiles[j].id)) {
            continue;
          }
          let isFeature = true;
          for (let k = 0; k < controlRes.length; k++) {
            //循环匹配特征对象中特征编码是否相同
            let featureCode = controlRes[k].featureCode;
            if (materialFiles[j].freeCTH != undefined && materialFiles[j].freeCTH != null && currentStock.features[featureCode] != materialFiles[j].freeCTH[featureCode]) {
              isFeature = false;
              break;
            }
          }
          if (isFeature) {
            //添加特征相同的gsp商品档案id
            materialFileIds.push(materialFiles[j].id);
            filterParam.currentStock[i].materialFileId = materialFiles[j].id;
            break;
          }
        }
      } else {
        for (let j = 0; j < materialFiles.length; j++) {
          if (materialFiles[j].freeCTH == null || (materialFiles[j].freeCTH == undefined && !materialFileIds.includes(materialFiles[j].id))) {
            materialFileIds.push(materialFiles[j].id);
            break;
          }
        }
      }
    }
    filterParam.materialFileIds = materialFileIds;
    //通过后端脚手架筛选过滤后的医药物料
    let result = postman("POST", materialFileFilterUrl, null, JSON.stringify(filterParam));
    result = JSON.parse(result);
    let e = new Date().getTime();
    if (result.code != "200") {
      throw new Error("过滤方案提取商品失败！");
    }
    let apiResponseProduct = result.list;
    //循环医药物料
    for (let i = 0; i < apiResponseProduct.length; i++) {
      //查询原厂物料属性
      let yonql = "select code,name,unit.id,unit.name from pc.product.Product  where  id = '" + apiResponseProduct[i].material + "'";
      let materialProInfo = ObjectStore.queryByYonQL(yonql, "productcenter");
      if (materialProInfo != null && materialProInfo.length > 0) {
        apiResponseProduct[i].product_name = materialProInfo[0].name;
        apiResponseProduct[i].product_code_code = materialProInfo[0].code;
      }
      if (warehouse[0].isGoodsPosition) {
        let currentStockLocationSql = "select id,currentStockCharacteristic features from 	stock.currentstock.CurrentStockLocation where id ='" + apiResponseProduct[i].currentStockId + "'  ";
        let currentStockLocation = ObjectStore.queryByYonQL(currentStockLocationSql, "ustock");
        apiResponseProduct[i].features = currentStockLocation[0].features;
      } else {
        let currentStockSql = "select id,currentStockCharacteristic features from 	stock.currentstock.CurrentStock where  id ='" + apiResponseProduct[i].currentStockId + "' ";
        let currentStock = ObjectStore.queryByYonQL(currentStockSql, "ustock");
        apiResponseProduct[i].features = currentStock[0].features;
      }
    }
    return { result: apiResponseProduct };
  }
}
exports({ entryPoint: MyAPIHandler });