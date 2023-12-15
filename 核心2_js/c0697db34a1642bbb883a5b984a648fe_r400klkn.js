let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let curingScheme = request.curing_scheme;
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let goodsArr = [];
    //获取商品档案
    let menchantQueryPageUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/product/list";
    let bodyPage = {
      pageIndex: "1",
      pageSize: "50",
      extend_syzt: 1,
      orgId: "" + request.orgId + ""
    };
    let apiResponseProductRes = openLinker("POST", menchantQueryPageUrl, apiPreAndAppCode.appCode, JSON.stringify(bodyPage));
    apiResponseProductRes = JSON.parse(apiResponseProductRes);
    let materialProInfo = apiResponseProductRes.data.recordList;
    let apiResponseProductSql = "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = " + request.orgId;
    let apiResponseProduct = ObjectStore.queryByYonQL(apiResponseProductSql);
    let count = apiResponseProductRes.data.recordCount;
    //查询重点养护确认单物料详情
    let mainSql = "select product_code from GT22176AT10.GT22176AT10.SY01_mainproco_son where dr = 0";
    let mainRes = ObjectStore.queryByYonQL(mainSql);
    if (count <= 50) {
      if (apiResponseProduct.length > 0) {
        for (let i = 0; i < apiResponseProduct.length; i++) {
          for (let j = 0; j < materialProInfo.length; j++) {
            if (materialProInfo[j].id == apiResponseProduct[i].material) {
              apiResponseProduct[i].unit = materialProInfo[j].unit;
              apiResponseProduct[i].unit_Name = materialProInfo[j].unit_Name;
              apiResponseProduct[i].materialName = materialProInfo[j].name.zh_CN;
              let firstDate = apiResponseProduct[i].firstSaleDate;
              if (typeof firstDate != "undefined") {
                let dateStart = new Date(firstDate);
                let dateEnd = new Date();
                let difValue = (dateEnd - dateStart) / (1000 * 60 * 60 * 24);
                let diffVal = Math.floor(difValue);
                let yhlb = apiResponseProduct[i].curingTypeName;
                if (diffVal < 365 && yhlb == "一般养护") {
                  let ischonguf = 2;
                  for (let x = 0; x < goodsArr.length; x++) {
                    if (apiResponseProduct[i].material == goodsArr[x].material) {
                      ischonguf = 1;
                      break;
                    }
                  }
                  if (ischonguf == 2) {
                    goodsArr.push(apiResponseProduct[i]);
                  }
                }
              }
            }
          }
        }
      }
      for (let j = 0; j < mainRes.length; j++) {
        for (let k = 0; k < goodsArr.length; k++) {
          if (mainRes[j].product_code == goodsArr[k].material) {
            goodsArr.splice(k, 1);
            k--;
          }
        }
      }
      return { goodsArr };
    } else {
      let page = Math.ceil(count / 50);
      for (let c = 0; c < page; c++) {
        let page_index = c + 1;
        let menchantQueryPageUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/product/list";
        let bodyPage = {
          pageIndex: 1,
          pageSize: 50,
          extend_syzt: 1,
          orgId: request.orgId
        };
        let apiResponseProduct = openLinker("POST", menchantQueryPageUrl, apiPreAndAppCode.appCode, JSON.stringify(bodyPage));
        apiResponseProduct = JSON.parse(apiResponseProduct);
        let materialProInfo = apiResponseProduct.data.recordList;
        if (apiResponseProduct.length > 0) {
          for (let i = 0; i < apiResponseProduct.length; i++) {
            for (let j = 0; j < materialProInfo.length; j++) {
              if (materialProInfo[j].id == apiResponseProduct[i].material) {
                apiResponseProduct[i].unit = materialProInfo[j].unit;
                apiResponseProduct[i].unit_Name = materialProInfo[j].unit_Name;
                apiResponseProduct[i].materialName = materialProInfo[j].name.zh_CN;
                let firstDate = apiResponseProduct[i].firstSaleDate;
                if (typeof firstDate != "undefined") {
                  let dateStart = new Date(firstDate);
                  let dateEnd = new Date();
                  let difValue = (dateEnd - dateStart) / (1000 * 60 * 60 * 24);
                  let diffVal = Math.floor(difValue);
                  let yhlb = apiResponseProduct[i].curingTypeName;
                  if (diffVal < 365 && yhlb == "一般养护") {
                    let ischonguf = 2;
                    for (let x = 0; x < goodsArr.length; x++) {
                      if (apiResponseProduct[i].material == goodsArr[x].material) {
                        ischonguf = 1;
                        break;
                      }
                    }
                    if (ischonguf == 2) {
                      goodsArr.push(apiResponseProduct[j]);
                    }
                  }
                }
              }
            }
          }
        }
        for (let j = 0; j < mainRes.length; j++) {
          for (let k = 0; k < goodsArr.length; k++) {
            if (mainRes[j].product_code == goodsArr[k].material) {
              goodsArr.splice(k, 1);
              k--;
            }
          }
        }
        return { goodsArr };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });