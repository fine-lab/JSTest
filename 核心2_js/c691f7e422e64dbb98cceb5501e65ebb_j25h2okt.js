let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var mainUnitCount = "1";
    let headerList = new Array();
    for (var i = 0; i < param.length; i++) {
      let data = param[i];
      if (data.pc_productlist_userDefine001 != undefined) {
        mainUnitCount = data.pc_productlist_userDefine001;
      }
      let shelfLifeUnit = ""; //有效期单位
      let shelfLife; //有效期时间
      let productDetail = data.detail;
      //是否启用效期控制
      let shelfLifeFlag = productDetail.isExpiryDateManage != undefined ? productDetail.isExpiryDateManage : "N";
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
      let bodyMap = {
        sku: data.pc_productlist_userDefine007,
        customerId: context,
        skuDescr1: data.pc_productlist_userDefine009,
        skuDescr2: "",
        activeFlag: "Y",
        easyCode: "",
        skuGroup7: "0",
        shelfLifeFlag: shelfLifeFlag, //有效期控制
        shelfLifeUnit: shelfLifeUnit, //有效期单位
        shelfLife: shelfLife, //有效期
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
        reservedField03: data.pc_productlist_userDefine002, //主单位  1460944928342802453
        reservedField04: data.pc_productlist_userDefine003, //库存单位
        reservedField05: mainUnitCount + "", //换算率
        reservedField06: data.code, //物料编码
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
      headerList.push(bodyMap);
    }
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