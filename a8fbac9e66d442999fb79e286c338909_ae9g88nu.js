let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.orgId;
    let warehouseDate = [];
    let materialInfoSum = [];
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //现存量查询
    let qtyUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/stock/QueryCurrentStocksByCondition";
    let qtyBody = {};
    let qtyRes = openLinker("POST", qtyUrl, apiPreAndAppCode.appCode, JSON.stringify(qtyBody));
    qtyRes = JSON.parse(qtyRes);
    let materialInfo = qtyRes.data;
    let batchno = [];
    let product = [];
    let warehouse = [];
    if (typeof materialInfo != "undefined") {
      if (materialInfo.length > 0) {
        for (let i = 0; i < materialInfo.length; i++) {
          if (materialInfo[i].currentqty > 0) {
            //查询物料信息
            let materialId = materialInfo[i].product;
            let sql = "select * from pc.product.Product where id=" + materialId;
            let productInfo = ObjectStore.queryByYonQL(sql, "productcenter");
            if (productInfo.length > 0) {
              for (let j = 0; j < productInfo.length; j++) {
                if (productInfo[j].extend_is_gsp == 1 || productInfo[j].extend_is_gsp == "1" || productInfo[j].extend_is_gsp == true || productInfo[j].extend_is_gsp == "true") {
                  materialInfoSum.push({
                    product: materialInfo[i].product,
                    qty: materialInfo[i].currentqty,
                    bwm: productInfo[j].extend_standard_code,
                    package_specification: productInfo[j].extend_package_specification,
                    batchno: materialInfo[i].batchno
                  });
                  product.push(materialInfo[i].product);
                  warehouse.push(materialInfo[i].warehouse);
                  if (materialInfo[i].batchno !== null) {
                    batchno.push(materialInfo[i].batchno);
                  }
                }
              }
            }
          }
        }
      }
    }
    //批次号查询
    let inventoryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/batchno/report/list";
    let inventoryBody = {
      pageSize: "100",
      pageIndex: "1"
    };
    let inventoryRes = openLinker("POST", inventoryUrl, apiPreAndAppCode.appCode, JSON.stringify(inventoryBody));
    inventoryRes = JSON.parse(inventoryRes);
    let inventoryInfo = inventoryRes.data.recordList;
    if (inventoryInfo.length > 0) {
      for (let p = 0; p < inventoryInfo.length; p++) {
        for (let m = 0; m < materialInfoSum.length; m++) {
          if (inventoryInfo[p].product == materialInfoSum[m].product && inventoryInfo[p].batchno == materialInfoSum[m].batchno && inventoryInfo[p].warehouse == materialInfoSum[m].warehouse) {
            if (inventoryInfo[p].org_name == "佛山双鹤药业有限责任公司") {
              warehouseDate.push({
                qty: materialInfoSum[m].qty,
                bwm: materialInfoSum[m].bwm,
                package_specification: materialInfoSum[m].package_specification,
                batchno: materialInfoSum[m].batchno,
                producedate: inventoryInfo[p].producedate,
                invaliddate: inventoryInfo[p].invaliddate
              });
            }
          }
        }
      }
    }
    return { warehouseDate };
  }
}
exports({ entryPoint: MyAPIHandler });