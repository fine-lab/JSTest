let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let product = JSON.parse(param.requestData);
    let ownID = param.return.id;
    let request = {};
    request.uri = "/yonbip/digitalModel/product/save";
    request.body = {
      data: {
        orgId: product.org_id,
        code: product.code,
        name: {
          zh_CN: product.name
        },
        _status: "Insert",
        detail: {
          purchaseUnit: product.Unit,
          inspectionUnit: product.Unit,
          purchasePriceUnit: product.Unit,
          stockUnit: product.Unit,
          produceUnit: product.Unit,
          batchPriceUnit: product.Unit,
          batchUnit: product.Unit,
          onlineUnit: product.Unit,
          offlineUnit: product.Unit,
          requireUnit: product.Unit,
          _status: "Insert"
        },
        manageClass: product.managementClass, //物料分类
        productClass: product.productClass, //商品分类
        realProductAttribute: 1,
        unitUseType: 2,
        unit: product.Unit
      }
    };
    if (product.shortName !== undefined) {
      request.body.data.detail.shortName = product.shortName;
    }
    if (product.managementClass !== undefined) {
      request.body.data.manageClass = product.managementClass;
    }
    if (product.presentationClass !== undefined) {
      request.body.data.productClass = product.presentationClass;
    }
    if (product.modelDescription !== undefined) {
      request.body.data.detail.modelDescription = {
        zh_CN: product.modelDescription
      };
    }
    if (product.model !== undefined) {
      request.body.data.detail.model = {
        zh_CN: product.model
      };
    }
    if (product.placeOfOrigin !== undefined) {
      request.body.data.placeOfOrigin = product.placeOfOrigin;
    }
    if (product.manufacturer !== undefined) {
      request.body.data.manufacturer = product.manufacturer;
    }
    if (product.taxClass_Code !== undefined) {
      request.body.data.taxClass = product.taxClass_Code;
    }
    let func = extrequire("GT34544AT7.common.baseOpenApi");
    let sysproduct = func.execute(request);
    if (sysproduct.res.code == "200") {
      let productID = sysproduct.res.data.id;
      let productCode = sysproduct.res.data.code;
      //保存成功后回写物料ID和物料编码
      var object = { id: ownID, product: productID, productcode: productCode };
      var res = ObjectStore.updateById("GT104180AT23.GT104180AT23.Goods", object, "d10abfaf");
    } else {
      throw new Error("保存物料失败！\n" + sysproduct.res.message);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });