let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sccess_info = [];
    //查询现存量
    let warehouseSql = "select isGoodsPosition from 	aa.warehouse.Warehouse where    id ='" + request.warehouse + "' ";
    let warehouse = ObjectStore.queryByYonQL(warehouseSql, "productcenter");
    let stockStatusSql = "select id,statusName from 	st.stockStatusRecord.stockStatusRecord where statusName ='合格' ";
    let stockStatusRecord = ObjectStore.queryByYonQL(stockStatusSql, "ustock");
    let currentStock = [];
    let currentStockSql = "";
    if (warehouse[0].isGoodsPosition) {
      currentStockSql =
        "select id ,currentqty,currentStockCharacteristic features,product from 	stock.currentstock.CurrentStockLocation where currentqty >0 and warehouse.id ='" +
        request.warehouse +
        "' and stockStatusDoc.id='" +
        stockStatusRecord[0].id +
        "' and product =  '" +
        request.p_id +
        "' and batchno =  '" +
        request.batchno +
        "' and location ='" +
        request.position +
        "'";
    } else {
      currentStockSql =
        "select id, currentqty,currentStockCharacteristic features,product  from 	stock.currentstock.CurrentStock where currentqty >0 and warehouse.id ='" +
        request.warehouse +
        "' and stockStatusDoc.id='" +
        stockStatusRecord[0].id +
        "' and product =  '" +
        request.p_id +
        "' and batchno =  '" +
        request.batchno +
        "'";
    }
    if (request.proSKU != null && request.proSKU != undefined && request.proSKU != "") {
      currentStockSql += " and  productsku ='" + proSkuCode + "'";
    }
    currentStock = ObjectStore.queryByYonQL(currentStockSql, "ustock");
    if (currentStock.length > 0) {
      //查询原厂特征模板id
      let queryTemplateInfo = "select productTemplate.id id,productTemplate.name name from pc.product.Product where id = '" + currentStock[0].product + "'";
      let template = ObjectStore.queryByYonQL(queryTemplateInfo, "productcenter")[0].id;
      //查询特征模板特征编码
      let yonql = "select featureId,featureName,featureCode,gspControl from GT22176AT10.GT22176AT10.sy01_freeFeature where drugFeatrueConfig_id.template = '" + template + "'";
      let controlRes = ObjectStore.queryByYonQL(yonql, "sy01");
      let features = request.features;
      if (features != null && features != undefined && features != "") {
        let isFeature = true;
        for (let k = 0; k < controlRes.length; k++) {
          //循环匹配特征对象中特征编码是否相同
          let featureCode = controlRes[k].featureCode;
          if (controlRes[k].gspControl == true) {
            if (
              currentStock[0].features != undefined &&
              currentStock[0].features != null &&
              currentStock[0].features.hasOwnProperty(featureCode) &&
              features.hasOwnProperty(featureCode) &&
              currentStock[0].features[featureCode] != features[featureCode]
            ) {
              isFeature = false;
              break;
            }
          }
        }
        if (isFeature) {
          //添加特征相同的gsp商品档案id
          sccess_info.push({
            statusId: stockStatusRecord[0].id,
            statusName: stockStatusRecord[0].statusName,
            currentqty: currentStock[0].currentqty
          });
        }
      } else {
        sccess_info.push({
          statusId: stockStatusRecord[0].id,
          statusName: stockStatusRecord[0].statusName,
          currentqty: currentStock[0].currentqty
        });
      }
    }
    let batchNo = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_first_in_record", {
      org_id: request.orgId,
      batchNo: request.batchno
    });
    if (batchNo.length > 0) {
      sccess_info.length > 0
        ? (sccess_info[0].batchInDate = batchNo[0].firstDay)
        : sccess_info.push({
            batchInDate: batchNo[0].firstDay
          });
    }
    return {
      sccess_info
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});