let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let getSwitchValue = function (value) {
      if (value == undefined || value == null || value == 0 || value == "0" || value == false || value == "false") {
        return "0";
      } else {
        return "1";
      }
    };
    let lic_rep = "SY01_material_file_childList";
    let sy_rep = "sy01_material_change_reportList";
    let billObj = {
      id: param.data[0].id,
      compositions: [
        {
          name: "sy01_material_change_reportList"
        }
      ]
    };
    //实体查询
    let billInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_fcuscauditv2", billObj);
    // 不需要传值，查询已经重构过了，可以得到名称，详见 getProLicInfo
    let productInfo = {};
    let orgId = billInfo.org_id;
    let productId = billInfo.customerbillno;
    let type = billInfo.isSku.toString();
    let sku = billInfo.sku;
    if (type == "0") {
      productInfo = extrequire("GT22176AT10.publicFunction.getProLicInfo").execute({ orgId: orgId, materialId: productId }).proLicInfo;
    } else if (type == "1") {
      productInfo = extrequire("GT22176AT10.publicFunction.getProSkuLicInfo").execute({ orgId: orgId, materialId: productId, sku: sku }).proLicInfo;
    } else if (type == "2") {
      productInfo = extrequire("GT22176AT10.publicFunction.getProFeaLicInfo").execute({ orgId: orgId, materialId: productId, feature: billInfo.feature }).proLicInfo;
    }
    //其他资质及证照
    let reportInfo = [];
    let sy_report = billInfo[sy_rep];
    let updateIds = [];
    if (sy_report != undefined) {
      for (let i = 0; i < sy_report.length; i++) {
        let info = {};
        if (sy_report[i].related_id == undefined || sy_report[i].related_id == "") {
          info._status = "Insert";
        } else {
          info.id = sy_report[i].related_id;
          info._status = "Update";
          updateIds.push(sy_report[i].related_id);
        }
        info.qualifyReport = sy_report[i].report;
        info.qualifyReportName = sy_report[i].reportName;
        info.reportCode = sy_report[i].reportCode;
        info.startDate = sy_report[i].begin_date;
        info.validUntil = sy_report[i].end_date;
        info.enclosure = sy_report[i].file;
        reportInfo.push(info);
      }
    }
    let product_report = productInfo[lic_rep];
    if (product_report != undefined) {
      for (let i = 0; i < product_report.length; i++) {
        let isDelete = true;
        for (let j = 0; j < updateIds.length; j++) {
          if (product_report[i].id == updateIds[j]) {
            isDelete = false;
            break;
          }
        }
        if (isDelete) {
          reportInfo.push({ id: product_report[i].id, _status: "Delete" });
        }
      }
    }
    let updateJson = {
      id: productInfo.id,
      _status: "Update",
      changeOrderNo: billInfo.code,
      changeData: billInfo.applydate,
      materialType: billInfo.pro_type,
      materialTypeName: billInfo.materialTypeName,
      storageCondition: billInfo.storageConditions,
      storageConditionName: billInfo.storage_conditions_name,
      dosageForm: billInfo.dosageform,
      dosageFormName: billInfo.dosageform_name,
      listingHolder: billInfo.licenser,
      listingHolderName: billInfo.licenser_name,
      packingMaterial: billInfo.bc,
      packingMaterialName: billInfo.extend_bc_name,
      //单位
      mainUnit: billInfo.unit,
      //单位名称
      //内包装材料
      innerPackMaterial: billInfo.innerPackMaterial,
      //装箱包装规格
      boxPackSpec: billInfo.boxPackSpec,
      //批文有效期
      approvalValidityDate: billInfo.approvalValidityDate,
      //保质期
      expireDateNo: billInfo.shelfLife,
      //保质期单位
      expireDateUnit: billInfo.shelfLifeUnit,
      //药品生产/进口批准证明文件及其附件
      isApprovalProof: billInfo.isApprovalProof,
      //适应症或功能主治
      majorFunction: billInfo.majorFunction,
      //供货企业
      supplierCompany: billInfo.supplierCompany,
      //供货企业名称
      //药品生产批件
      isProductionProe: billInfo.isProductionProe,
      //药品质量标准
      isQualityStandard: billInfo.isQualityStandard,
      //检验报告书
      isSurveyReport: billInfo.isSurveyReport,
      //物价批文
      isPriceApproval: billInfo.isPriceApproval,
      //养护类别
      curingType: billInfo.curingtype,
      curingTypeName: billInfo.curingtype_name,
      commonNme: billInfo.extend_tym,
      specs: billInfo.specifications,
      producingArea: billInfo.produceArea,
      approvalNumber: billInfo.approvalNo,
      standardCode: billInfo.bwm,
      manufacturer: billInfo.manufacturer_name,
      commodityPerformance: billInfo.customerquality,
      qualityStandard: billInfo.quaStandard,
      prescriptionType: billInfo.cffl,
      importDrugsRegisterNo: billInfo.imregisterlicenseNo,
      gspCertificate: getSwitchValue(billInfo.isgsp1),
      drugSuppleApply: getSwitchValue(billInfo.ypbcsqpj),
      commodityDeviceRegistration: getSwitchValue(billInfo.spqxzcpj),
      biologicalCertification: getSwitchValue(billInfo.swqfhgz),
      instructions: getSwitchValue(billInfo.sms),
      commodityRegistrationApproval: getSwitchValue(billInfo.spqxzzcpj),
      importLicense: getSwitchValue(billInfo.jkxkz),
      importedMedicinalMaterials: getSwitchValue(billInfo.jkycpj),
      drugPackaging: getSwitchValue(billInfo.ypbz),
      importedBiologicalProducts: getSwitchValue(billInfo.jkswzpjybgs),
      importDrugRegistrationCertificate: getSwitchValue(billInfo.jkypzczs),
      ephedrineContaining: getSwitchValue(billInfo.hmhj),
      reportOnImportedDrugs: getSwitchValue(billInfo.jkyptgzs),
      importedDrugs: getSwitchValue(billInfo.isimporteddrugs),
      coldChainDrugs: getSwitchValue(billInfo.iscoldchain),
      injection: getSwitchValue(billInfo.isinjection),
      doubleReview: getSwitchValue(billInfo.issecacceptance),
      specialDrugs: getSwitchValue(billInfo.hanteshuyaopin),
      antitumorDrugs: getSwitchValue(billInfo.isAntitumordrugs),
      antibiotic: getSwitchValue(billInfo.isantibiotic),
      salesByPrescription: getSwitchValue(billInfo.isotcsale),
      recordNo: billInfo.recordNo,
      zyypStandard: billInfo.zyypStandard,
      zypfStandard: billInfo.zypfStandard,
      psychotropic: getSwitchValue(billInfo.psychotropic),
      radiation: getSwitchValue(billInfo.radiation),
      poison: getSwitchValue(billInfo.poison),
      narcotic: getSwitchValue(billInfo.narcotic),
      model: billInfo.model,
      registNo: billInfo.registNo,
      productLincenseNo: billInfo.productLincenseNo,
      registerName: billInfo.registerName,
      registerAddress: billInfo.registerAddress,
      agentName: billInfo.agentName,
      agentAddress: billInfo.agentAddress
    };
    updateJson[lic_rep] = reportInfo;
    let res = ObjectStore.updateById("GT22176AT10.GT22176AT10.SY01_material_file", updateJson, "775b9cd9");
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});