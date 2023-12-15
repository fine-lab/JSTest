let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let paramDate = param.data[0];
    let materialCodeApplySql = "select * from ISY_2.ISY_2.materialCodeApply where id = " + paramDate.id;
    let materialCodeApplyRes = ObjectStore.queryByYonQL(materialCodeApplySql, "sy01");
    let productSql = "";
    if (materialCodeApplyRes.length > 0) {
      productSql = "select id, orgId from pc.product.Product where code = '" + materialCodeApplyRes[0].materialrequisitionid + "'";
      let productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
      if (productRes != null && materialCodeApplyRes[0].code != null) {
        if (productRes.length > 0) {
          let detailSql = "select id from pc.product.ProductDetail where productId = " + productRes[0].id;
          let detailRes = ObjectStore.queryByYonQL(detailSql, "productcenter");
          let materialId = productRes[0].id;
          let orgId = productRes[0].orgId;
          let vendorList = { materialId, orgId };
          //获取商品档案详情
          let apiResponseProduct = extrequire("ISY_2.public.getProDetailFile").execute(vendorList);
          let materialInfo = apiResponseProduct.merchantInfo;
          let MaterialProductOrgsJson = [];
          if (typeof materialInfo.productOrgs != "undefined") {
            for (let i = 0; i < materialInfo.productOrgs.length; i++) {
              MaterialProductOrgsJson.push({
                id: materialInfo.productOrgs[i].id,
                rangeType: materialInfo.productOrgs[i].rangeType,
                isCreator: false,
                _status: "Update"
              });
            }
          }
          let json = {
            data: {
              detail: {
                purchaseUnit: materialInfo.detail.purchaseUnit,
                purchasePriceUnit: materialInfo.detail.purchasePriceUnit,
                stockUnit: materialInfo.detail.stockUnit,
                produceUnit: materialInfo.detail.produceUnit,
                batchPriceUnit: materialInfo.detail.batchPriceUnit,
                batchUnit: materialInfo.detail.batchUnit,
                onlineUnit: materialInfo.detail.onlineUnit,
                offlineUnit: materialInfo.detail.offlineUnit,
                requireUnit: materialInfo.detail.requireUnit,
                deliverQuantityChange: 1,
                mnemonicCode: materialCodeApplyRes[0].qagmpmaterialcode,
                _status: "Update",
                businessAttribute: materialInfo.detail.businessAttribute,
                saleChannel: materialInfo.detail.saleChannel
              },
              id: materialInfo.id,
              name: materialInfo.name,
              orgId: materialInfo.orgId,
              code: materialInfo.code,
              manageClass: materialInfo.manageClass,
              realProductAttribute: materialInfo.realProductAttribute,
              unitUseType: materialInfo.unitUseType,
              unit: materialInfo.unit,
              _status: "Update",
              productOrgs: MaterialProductOrgsJson,
              //商品分类
              productClass: materialInfo.productClass,
              productClass_Code: materialInfo.productClass_Code,
              productClass_Name: materialInfo.productClass_Name,
              manufacturer: materialCodeApplyRes[0].manufacturername,
              extend_gsp_spfl: materialCodeApplyRes[0].materialscope,
              placeOfOrigin: materialCodeApplyRes[0].manufactureraddress
            }
          };
          extrequire("ISY_2.public.saveProductFiles").execute(json);
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });