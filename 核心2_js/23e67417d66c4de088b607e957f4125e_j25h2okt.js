let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param;
    var mainUnitCount = "1";
    if (data.productAssistUnitExchanges != null) {
      mainUnitCount = data.productAssistUnitExchanges[0].mainUnitCount;
    }
    // 获取计量单位code
    let func1 = extrequire("GT101792AT1.common.getUnitCodeS");
    let res = func1.execute(null, data.unit);
    //获取库存单位code
    let res2 = func1.execute(null, data.productDetail[0].stockUnit);
    var unitCode = res.res[0].code;
    var stockUnit = res2.res[0].code;
    let sku = data.code != null ? data.code : "";
    let reservedField06 = data.code != undefined ? data.code : "";
    let skuDescr1 = data.name != undefined ? data.name : "";
    let skuDescr2 = data.productDetail[0].shortName != undefined ? data.productDetail[0].shortName : "";
    let easyCode = data.productDetail[0].mnemonicCode != undefined ? data.productDetail[0].mnemonicCode : "";
    let productDetail = data.productDetail != undefined ? data.productDetail[0] : "";
    let shelfLifeUnit = ""; //有效期单位
    let shelfLife; //有效期时间
    //是否启用效期控制
    let shelfLifeFlag = productDetail.isExpiryDateManage != null ? productDetail.isExpiryDateManage : "N";
    if (shelfLifeFlag == true) {
      shelfLifeFlag = "Y";
      //有效期单位
      shelfLifeUnit = productDetail.expireDateUnit != undefined ? productDetail.expireDateUnit : "";
      if (shelfLifeUnit === 1) {
        shelfLifeUnit = "YEAR";
      } else if (shelfLifeUnit === 2) {
        shelfLifeUnit = "MONTH";
      } else {
        shelfLifeUnit = "DAY";
      }
      //有效期时间
      shelfLife = productDetail.expireDateNo != undefined ? productDetail.expireDateNo : 0;
    } else {
      shelfLifeFlag = "N";
    }
    let customerId = "";
    if (context == "1473045320098643975") {
      //依安工厂
      customerId = "yourIdHere";
    } else if (context == "1473041368737644546") {
      //克东
      customerId = "yourIdHere";
    }
    // 表体
    let bodyMap = {
      sku: sku,
      customerId: customerId,
      skuDescr1: skuDescr1,
      skuDescr2: skuDescr2,
      // 默认Y
      activeFlag: "Y",
      easyCode: easyCode,
      itemCode: "",
      skuBarcode: "",
      alternateSkuA: "",
      alternateSkuB: "",
      alternateSkuC: "",
      masterUom: "",
      innerPackQty: "",
      caseQty: "",
      breakCs: "",
      skuHigh: "", //data.height, //高
      skuLength: "", //data.length,  //长
      skuWidth: "", //data.width,  //宽
      grossWeight: "", //data.weight,  //毛重
      netWeight: "", //data.netWeight,  //净重
      tare: "", //皮重
      cube: "", //data.volume,  //体积
      price: "", //价格
      skuGroup1: "",
      skuGroup2: "",
      skuGroup3: "",
      skuGroup4: "",
      skuGroup5: "",
      skuGroup6: "",
      skuGroup7: "0",
      skuGroup8: "",
      skuGroup9: "",
      freightClass: data.pc_product_userDefine001,
      cycleClass: "",
      qtyMax: "",
      qtyMin: "",
      shelfLifeFlag: shelfLifeFlag, //有效期控制
      shelfLifeType: "",
      shelfLifeUnit: shelfLifeUnit, //有效期单位
      shelfLife: shelfLife, //有效期
      shelfLifeAlertDays: "",
      inboundLifeDays: "",
      outboundLifeDays: "",
      serialNoCatch: "Y",
      overRcvPercentage: 5,
      kitFlag: "N",
      reOrderQty: "",
      qcPoint: "",
      qcRule: "",
      firstOp: "",
      approvalNo: "",
      medicalType: "",
      medicineSpecicalControl: "",
      specialMaintenance: "",
      maintenanceReason: "",
      secondSerialNoCatch: "Y",
      printMedicineQcReport: "Y",
      reservedField01: "",
      reservedField02: data.enableAssistUnit, //是否启用辅计量标记
      reservedField03: unitCode, //主单位  1460944928342802453
      reservedField04: stockUnit, //库存单位
      reservedField05: mainUnitCount + "", //换算率
      reservedField06: reservedField06, //物料编码
      reservedField07: "0",
      reservedField08: "",
      reservedField09: "",
      reservedField10: "0",
      reservedField11: "0",
      reservedField12: "0",
      reservedField13: "",
      reservedField14: "",
      reservedField15: "",
      reservedField16: "",
      reservedField17: "N",
      reservedField18: "",
      reservedField19: "",
      reservedField20: "",
      notes: ""
    };
    let headerList = new Array();
    headerList.push(bodyMap);
    let hederData = {
      header: headerList
    };
    let body = {
      data: hederData
    };
    return { body };
  }
}
exports({ entryPoint: MyTrigger });