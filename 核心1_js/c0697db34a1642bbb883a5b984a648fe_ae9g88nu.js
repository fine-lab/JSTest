let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let goodsArr = [];
    let apiResponseProductSql = "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = " + request.orgId;
    let apiResponseProduct = ObjectStore.queryByYonQL(apiResponseProductSql);
    if (apiResponseProduct.length > 0) {
      for (let i = 0; i < apiResponseProduct.length; i++) {
        let firstDate = apiResponseProduct[i].firstSaleDate;
        if (typeof firstDate != "undefined") {
          let dateStart = new Date(firstDate);
          let dateEnd = new Date();
          let difValue = (dateEnd - dateStart) / (1000 * 60 * 60 * 24);
          let diffVal = Math.floor(difValue);
          let yhlb = apiResponseProduct[i].curingTypeName;
          if (diffVal < 365 && yhlb == "一般养护") {
            //查询重点养护确认单物料详情
            let mainSql = "select product_code from GT22176AT10.GT22176AT10.SY01_mainproco_son where dr = 0 and scyhrq is not null and product_code =" + apiResponseProduct[i].material;
            let mainRes = ObjectStore.queryByYonQL(mainSql);
            if (mainRes != null && mainRes.length > 0) {
              let scyhrq = mainRes[0].scyhrq;
              let date = new Date(scyhrq);
              let nowDate = new Date();
              let difValue = Math.floor((nowDate - date) / (1000 * 60 * 60 * 24));
              if (difValue < scyhrqDay) {
                isFlag = true;
                continue;
              }
            }
            let yonql = "select name,unit.id,unit.name from pc.product.Product  where  id = '" + apiResponseProduct[i].material + "'";
            let materialProInfo = ObjectStore.queryByYonQL(yonql, "productcenter");
            if (materialProInfo != null && materialProInfo.length > 0) {
              apiResponseProduct[i].unit = materialProInfo[0].unit_id;
              apiResponseProduct[i].unit_Name = materialProInfo[0].unit_Name;
              apiResponseProduct[i].materialName = materialProInfo[0].name;
              goodsArr.push(apiResponseProduct[i]);
            }
          }
        }
      }
    }
    return { goodsArr };
  }
}
exports({ entryPoint: MyAPIHandler });