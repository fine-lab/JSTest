let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 使用旧-物料档案保存接口：
    let data = param;
    let realProductAttribute = data.realProductAttribute;
    let productAttributexn;
    let productAttributest;
    if (realProductAttribute == 1) {
      // 实体物料
      productAttributest = data.realProductAttributeType;
    } else {
      // 虚拟物料
      productAttributexn = data.virtualProductAttribute;
    }
    var status = "Insert";
    if (data.productCharacterDef.attrext2 != undefined) {
      status = "Update";
    }
    let bodyNew = {
      data: {
        code: data.code, // 物料编码
        productClass: data.productClass, //商品分类id
        unitUseType: data.unitUseType,
        realProductAttribute: realProductAttribute,
        realProductAttributeType: productAttributest,
        virtualProductAttribute: productAttributexn,
        _status: "Update",
        orgId: data.orgId,
        unit: data.unit,
        name: {
          zh_CN: data.name.zh_CN
        },
        manageClass: data.manageClass,
        detail: {
          purchaseUnit: data.unit,
          inspectionUnit: data.unit,
          purchasePriceUnit: data.unit,
          stockUnit: data.unit,
          produceUnit: data.unit,
          batchPriceUnit: data.unit,
          batchUnit: data.unit,
          onlineUnit: data.unit,
          offlineUnit: data.unit,
          requireUnit: data.unit
        },
        productCharacterDef: {
          attrext2: context,
          id: data.id,
          _status: status
        },
        autoGenerateRangeData_: true,
        isCreator: true
      }
    };
    return { bodyNew };
  }
}
exports({ entryPoint: MyTrigger });