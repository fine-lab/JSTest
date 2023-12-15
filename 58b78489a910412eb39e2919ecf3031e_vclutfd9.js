let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 时间格式化方法
    var dateFormat = function (date, format) {
      if (date == null || date == undefined || date == "") {
        return "";
      }
      date = new Date(date);
      var o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "H+": date.getHours() + 8, //hour+8小时
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
      };
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return format;
    };
    let filterSchemeId = request.filterSchemeId; //养护过滤方案id
    let orgId = request.orgId; //组织id
    // 获取当前任务的租户ID
    let tenantId = ObjectStore.user().tenantId;
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
        "select id currentStockId, location,currentqty,batchno, product,productsku,productsku.cCode,productsku.skuName,location.name,producedate,invaliddate,currentStockCharacteristic features  from 	stock.currentstock.CurrentStockLocation where currentqty >0 and warehouse.id ='" +
        warehouseId +
        "' and stockStatusDoc.id='" +
        stockStatusRecord[0].id +
        "'  ";
      let currentStockLocation = ObjectStore.queryByYonQL(currentStockLocationSql, "ustock");
      filterParam.currentStock = currentStockLocation;
    } else {
      let currentStockSql =
        "select id currentStockId , '' location,'' location_name, currentqty,batchno, product,productsku,productsku.cCode,productsku.skuName,producedate,invaliddate,currentStockCharacteristic features  from 	stock.currentstock.CurrentStock where currentqty >0  and warehouse.id ='" +
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
      let materialFileSql = "select id,freeCTH,isSku from 	GT22176AT10.GT22176AT10.SY01_material_file  where org_id ='" + orgId + "' and material='" + currentStock.product + "'";
      let materialFiles = ObjectStore.queryByYonQL(materialFileSql, "sy01");
      if (JSON.stringify(materialFiles) == "{}" || materialFiles.length == 0) {
        continue;
      }
      if (currentStock.features != null && currentStock.features != undefined && materialFiles[0].isSku == 2) {
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
            //只匹配敏感特征
            if (controlRes[k].gspControl == true) {
              let featureCode = controlRes[k].featureCode;
              if (materialFiles[j].freeCTH != undefined && materialFiles[j].freeCTH != null && currentStock.features[featureCode] != materialFiles[j].freeCTH[featureCode]) {
                isFeature = false;
                break;
              }
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
          if (!materialFileIds.includes(materialFiles[j].id)) {
            materialFileIds.push(materialFiles[j].id);
            break;
          }
        }
      }
    }
    if (materialFileIds.length == 0) {
      return { result: [] };
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
      let yonql = "select code,name,unit.id,unit.name as unitName from pc.product.Product  where  id = '" + apiResponseProduct[i].material + "'";
      let materialProInfo = ObjectStore.queryByYonQL(yonql, "productcenter");
      if (materialProInfo != null && materialProInfo.length > 0) {
        apiResponseProduct[i].product_name = materialProInfo[0].name;
        apiResponseProduct[i].product_unit_name = materialProInfo[0].unitName;
        apiResponseProduct[i].product_code_code = materialProInfo[0].code;
      }
      let batchnoSql =
        "select id,define1,define2,define3,define4,define5 from st.batchno.Batchno where product='" + apiResponseProduct[i].material + "' and batchno = '" + apiResponseProduct[i].batchno + "' ";
      let batchnoList = ObjectStore.queryByYonQL(batchnoSql, "yonbip-scm-scmbd");
      if (batchnoList != null && batchnoList.length > 0) {
        apiResponseProduct[i].batchno_define1 = batchnoList[0].define1;
        apiResponseProduct[i].batchno_define2 = batchnoList[0].define2;
        apiResponseProduct[i].batchno_define3 = batchnoList[0].define3;
        apiResponseProduct[i].batchno_define4 = batchnoList[0].define4;
        apiResponseProduct[i].batchno_define5 = batchnoList[0].define5;
        apiResponseProduct[i].batch = batchnoList[0].id;
      }
      //查询原厂物料属性
      let curingTypeYonql = "select curingTypeName  from   GT22176AT10.GT22176AT10.SY01_curingtypesv2  where  id = '" + apiResponseProduct[i].curingType + "'";
      let curingTypeInfo = ObjectStore.queryByYonQL(curingTypeYonql);
      if (curingTypeInfo != null && curingTypeInfo.length > 0) {
        apiResponseProduct[i].curingType_curingTypeName = curingTypeInfo[0].curingTypeName;
      }
      apiResponseProduct[i].produce_date_show = dateFormat(apiResponseProduct[i].produce_date_show, "yyyy-MM-dd");
      apiResponseProduct[i].valid_until_show = dateFormat(apiResponseProduct[i].valid_until_show, "yyyy-MM-dd");
      delete apiResponseProduct[i].id;
      if (warehouse[0].isGoodsPosition) {
        let currentStockLocationSql = "select id,currentStockCharacteristic features from 	stock.currentstock.CurrentStockLocation where id ='" + apiResponseProduct[i].currentStockId + "'  ";
        let currentStockLocation = ObjectStore.queryByYonQL(currentStockLocationSql, "ustock");
        apiResponseProduct[i].features = currentStockLocation[0].features;
      } else {
        let currentStockSql = "select id,currentStockCharacteristic features from 	stock.currentstock.CurrentStock where  id ='" + apiResponseProduct[i].currentStockId + "' ";
        let currentStock = ObjectStore.queryByYonQL(currentStockSql, "ustock");
        apiResponseProduct[i].features = currentStock[0].features;
      }
      if (apiResponseProduct[i].features != undefined) {
        delete apiResponseProduct[i].features.currentStockUid;
        delete apiResponseProduct[i].features.id;
      }
    }
    return { result: apiResponseProduct };
  }
}
exports({ entryPoint: MyAPIHandler });