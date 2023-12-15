let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let materialId = request.materialId;
    let orgId = request.orgId;
    let skuId = request.skuId;
    let infoFieldsArray = [];
    infoFieldsArray.push("id"); //id
    infoFieldsArray.push("code"); //物料名称
    infoFieldsArray.push("materialType"); //商品分类
    infoFieldsArray.push("materialType.catagoryname materialTypeName"); //商品分类
    infoFieldsArray.push("template"); //物料模板
    infoFieldsArray.push("template.name templateName"); //物料模板名称
    infoFieldsArray.push("storageCondition"); //存储条件
    infoFieldsArray.push("storageCondition.storageName storageConditionName"); //存储条件
    infoFieldsArray.push("dosageForm"); //剂型
    infoFieldsArray.push("dosageForm.dosagaFormName dosageFormName"); //剂型
    infoFieldsArray.push("listingHolder"); //上市许可持有人
    infoFieldsArray.push("listingHolder.ip_name listingHolderName"); //上市许可持有人
    infoFieldsArray.push("nearEffectivePeriodType"); //近效期类别
    infoFieldsArray.push("nearEffectivePeriodType.nearName nearName"); //近效期类别
    infoFieldsArray.push("packingMaterial"); //包材
    infoFieldsArray.push("packingMaterial.packing_name packingMaterialName"); //包材
    infoFieldsArray.push("curingType"); //养护类别
    infoFieldsArray.push("curingType.curingTypeName curingTypeName"); //养护类别
    infoFieldsArray.push("commonNme"); //通用名
    infoFieldsArray.push("specs"); //规格
    infoFieldsArray.push("producingArea"); //产地
    infoFieldsArray.push("approvalNumber"); //批准文号
    infoFieldsArray.push("standardCode"); //本位码
    infoFieldsArray.push("manufacturer"); //生产厂商
    infoFieldsArray.push("commodityPerformance"); //商品性能、质量、用途、疗效
    infoFieldsArray.push("qualityStandard"); //质量标准
    infoFieldsArray.push("prescriptionType"); //处方分类
    infoFieldsArray.push("drugSuppleApply"); //药品补充申请批件
    infoFieldsArray.push("commodityDeviceRegistration"); //商品/器械注册批件
    infoFieldsArray.push("biologicalCertification"); //生物签发合格证
    infoFieldsArray.push("instructions"); //说明书
    infoFieldsArray.push("commodityRegistrationApproval"); //商品/器械再注册批件
    infoFieldsArray.push("importLicense"); //进口许可证
    infoFieldsArray.push("importedMedicinalMaterials"); //进口药材批件
    infoFieldsArray.push("drugPackaging"); //药品包装
    infoFieldsArray.push("importedBiologicalProducts"); //进口生物制品检验报告书
    infoFieldsArray.push("importDrugRegistrationCertificate"); //进口药品注册证/医药陈品注册证/进口药品报告书
    infoFieldsArray.push("ephedrineContaining"); //含麻黄碱
    infoFieldsArray.push("reportOnImportedDrugs"); //进口药品通关证/进口药品报告书
    infoFieldsArray.push("importedDrugs"); //进口药品
    infoFieldsArray.push("coldChainDrugs"); //冷链药品
    infoFieldsArray.push("injection"); //注射
    infoFieldsArray.push("doubleReview"); //二次验收
    infoFieldsArray.push("specialDrugs"); //含特殊药品复方制
    infoFieldsArray.push("antitumorDrugs"); //抗肿瘤药
    infoFieldsArray.push("antibiotic"); //抗生素
    infoFieldsArray.push("salesByPrescription"); //凭处方单销售
    infoFieldsArray.push("importDrugsRegisterNo"); //凭处方单销售
    infoFieldsArray.push("recordNo"); //凭处方单销售
    infoFieldsArray.push("zyypStandard"); //凭处方单销售
    infoFieldsArray.push("zypfStandard"); //凭处方单销售
    infoFieldsArray.push("model"); //型号
    infoFieldsArray.push("registNo"); //注册证号
    infoFieldsArray.push("productLincenseNo"); //生产许可证号
    infoFieldsArray.push("registerName"); //注册人名称
    infoFieldsArray.push("registerAddress"); //注册人地址
    infoFieldsArray.push("agentName"); //代理人
    infoFieldsArray.push("agentAddress"); //代理人地址
    infoFieldsArray.push("psychotropic"); //精神药品
    infoFieldsArray.push("radiation"); //放射药品
    infoFieldsArray.push("poison"); //毒性药品
    infoFieldsArray.push("narcotic"); //麻醉药品
    infoFieldsArray.push("mainUnit"); //单位
    infoFieldsArray.push("mainUnit.name mainUnitName"); //单位名称
    infoFieldsArray.push("innerPackMaterial"); //内包装材料
    infoFieldsArray.push("boxPackSpec"); //装箱包装规格
    infoFieldsArray.push("expireDateNo"); //保质期
    infoFieldsArray.push("expireDateUnit"); //保质期单位
    infoFieldsArray.push("approvalValidityDate"); //批文有效期
    infoFieldsArray.push("majorFunction"); //适应症或功能主治
    infoFieldsArray.push("supplierCompany"); //供货企业
    infoFieldsArray.push("supplierCompany.name supplierCompanyName"); //供货企业
    infoFieldsArray.push("isApprovalProof"); //药品生产/进口批准证明文件及其附件
    infoFieldsArray.push("isProductionProe"); //药品生产批件
    infoFieldsArray.push("isQualityStandard"); //药品质量标准
    infoFieldsArray.push("isSurveyReport"); //检验报告书
    infoFieldsArray.push("isPriceApproval"); //检验报告书
    infoFieldsArray.push("ccsx"); //存储属性
    infoFieldsArray.push("spsx"); //商品属性
    let sql =
      "select " +
      infoFieldsArray.join(",") +
      " from GT22176AT10.GT22176AT10.SY01_material_file  where org_id = " +
      orgId +
      " and material = " +
      materialId +
      " and firstBattalionStatus = '1' and dr = 0 and enable = '1' ";
    if (skuId != undefined && skuId != null) {
      sql = sql + " and materialSkuCode = " + skuId;
    }
    let res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });