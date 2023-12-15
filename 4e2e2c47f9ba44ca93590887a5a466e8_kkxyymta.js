let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let getSwitchValue = function (isTrue) {
      if (isTrue == 1 || isTrue == "1" || isTrue == true || isTrue == "true") {
        return "1";
      } else if (isTrue == 0 || isTrue == "0" || isTrue == false || isTrue == "false" || isTrue == undefined) {
        return "0";
      } else if (isTrue == 2 || isTrue == "2") {
        return "2";
      }
    };
    let update = function (res) {
      let selectCurType = "select * from GT22176AT10.GT22176AT10.SY01_curingtypesv2 where id = '" + res.curingtype + "'";
      var curTypeRes = ObjectStore.queryByYonQL(selectCurType, "sy01")[0];
      let materialId = res.material;
      let orgId = res.org_id;
      let vendorList = { materialId, orgId };
      //获取商品档案详情
      let apiResponseProduct = extrequire("GT22176AT10.publicFunction.getProductDetail").execute(vendorList);
      materialInfo = apiResponseProduct.merchantInfo;
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
          extend_is_gsp: true,
          manufacturer: res.manufacturer, //生产厂家
          extend_cffl: res.prescriptionType, //处方分类
          extend_standard_code: res.standardCode, //本位码
          extend_yhlb: res.curingType, //养护类别
          extend_yhlb_curingTypeName: res.curingTypeName, //养护类别名称
          extend_yhlb_name: res.curingTypeName, //养护类别名称
          extend_cctj: res.storageCondition, //存储条件1
          extend_jxqlb: res.nearEffectivePeriodType, //近效期类型
          extend_jx: res.dosageForm, //剂型
          extend_jx_name: res.dosageFormName, //剂型名称
          extend_ssxkcyr: res.listingHolder, //上市许可持有人
          extend_ssxkcyr_ip_name: res.listingHolderName, //上市许可持有人名称
          extend_gsp_spfl: res.materialType, //医药商品分类
          extend_gsp_spfl_name: res.materialTypeName, //GSP商品分类名称
          extend_zlbz: res.qualityStandard, //质量标准
          modelDescription: res.specifications, // 规格说明
          extend_tym: res.commonNme, //通用名
          extend_imregisterlicenseNo: res.importDrugsRegisterNo, //进口药品注册号
          extend_ypbcsqpj: res.drugSuppleApply, //药品补充申请批件
          extend_spjxzcpj: res.commodityDeviceRegistration, //商品/器械注册批件
          extend_swqfhgz: res.biologicalCertification, //生物签发合格证
          extend_sms: res.instructions, //说明书
          extend_spqxzzcpj: res.commodityRegistrationApproval, //商品/器械再注册批件
          extend_jkxkz: res.importLicense, //进口许可证
          extend_jkycpj: res.importedMedicinalMaterials, //进口药材批件
          extend_ypbz: res.drugPackaging, //药品包装
          extend_jkswzpjybgs: res.importedBiologicalProducts, //进口生物制品检验报告书1
          extend_jkypzczyy: res.importDrugRegistrationCertificate, //进口药品注册证/医药产品注册证/进口药品批件
          extend_jkyptgz: res.reportOnImportedDrugs, //进口药品通关证/进口药品报告书
          extend_spqk: res.commodityPerformance, //商品性能、质量、用途、疗效情况
          extend_llyp: res.coldChainDrugs, //冷链药品
          extend_jkyp: res.importedDrugs, //进口药品
          extend_zsj: res.injection, //注射剂
          extend_tsyp: res.specialDrugs, //含特殊药品复方制剂
          extend_kzlyp: res.antitumorDrugs, //抗肿瘤药
          extend_kss: res.antibiotic, //抗生素
          extend_pcfdxs: res.salesByPrescription, //凭处方单销售
          extend_srfh: res.doubleReview, //双人复核
          extend_hmhj: res.ephedrineContaining, //含麻黄碱
          placeOfOrigin: res.producingArea, //产地
          extend_pzwh: res.approvalNumber, //批准文号
          extend_bc: res.packingMaterial, //包材
          extendzcr: res.registerName, //注册人名称
          extendbah: res.recordNo, //备案号
          registrationNo: res.registNo, //注册证号
          extendProdLicense: res.productLincenseNo //生产许可证号
        }
      };
      extrequire("GT22176AT10.publicFunction.saveProduct").execute(json);
    };
    let fieldsArray = [];
    fieldsArray.push("org_id"); //组织id
    fieldsArray.push("packageSpecification"); //包装规格
    fieldsArray.push("antibiotic"); //抗生素
    fieldsArray.push("importedBiologicalProducts"); //进口生物制品检验报告书
    fieldsArray.push("materialSkuName"); //物料SKU名称
    fieldsArray.push("instructions"); //说明书
    fieldsArray.push("ephedrineContaining"); //含麻黄碱
    fieldsArray.push("importDrugRegistrationCertificate"); //进口药品注册证/医药产品注册证/进口药品批件
    fieldsArray.push("freeCTH"); //特征
    fieldsArray.push("curingTypeName"); //养护类别名称
    fieldsArray.push("tezheng"); //特征新
    fieldsArray.push("firstBattalionStatus"); //首营状态
    fieldsArray.push("zyypStandard"); //中药饮片执行标准
    fieldsArray.push("specifications"); //规格说明
    fieldsArray.push("qualityStandard"); //质量标准
    fieldsArray.push("psychotropic"); //精神药品
    fieldsArray.push("specs"); //规格
    fieldsArray.push("freeCTHObj"); //特征ojb
    fieldsArray.push("nearEffectivePeriodType"); //近效期类别
    fieldsArray.push("commodityPerformance"); //在库养护条件及要求
    fieldsArray.push("isExpiryDateManage"); //是否效期管理
    fieldsArray.push("curingType"); //养护类别
    fieldsArray.push("listingHolder"); //上市可持有人
    fieldsArray.push("materialSkuCode"); //物料SKU编码
    fieldsArray.push("importedDrugs"); //进口药品
    fieldsArray.push("changeData"); //首营变更日期
    fieldsArray.push("expireDateNo"); //保质期
    fieldsArray.push("mainUnit"); //主计量
    fieldsArray.push("dosageForm"); //剂型
    fieldsArray.push("recordNo"); //备案号
    fieldsArray.push("importLicense"); //进口许可证
    fieldsArray.push("mainUnitName"); //主计量名称
    fieldsArray.push("packingMaterialName"); //包材名称
    fieldsArray.push("materialName"); //物料名称
    fieldsArray.push("firstBusinessOrderNo"); //首营单号
    fieldsArray.push("isExpiryDateCalculationMethod"); //有效期推算方式
    fieldsArray.push("specialDrugs"); //含特殊药品复方制
    fieldsArray.push("importDrugsRegisterNo"); //进口药品注册证号
    fieldsArray.push("skuCode"); //sku编码
    fieldsArray.push("storageCondition"); //存储条件
    fieldsArray.push("materialTypeName"); //医药物料分类名称
    fieldsArray.push("template"); //物料模板
    fieldsArray.push("dosageFormName"); //剂型名称
    fieldsArray.push("biologicalCertification"); //生物签发合格证
    fieldsArray.push("firstSaleDate"); //首营日期
    fieldsArray.push("expireDateUnit"); //保质期单位
    fieldsArray.push("storageConditionName"); //存储条件名称
    fieldsArray.push("narcotic"); //麻醉药品
    fieldsArray.push("standardCode"); //本位码
    fieldsArray.push("manufacturer"); //生产厂商
    fieldsArray.push("skuName"); //sku名称
    fieldsArray.push("listingHolder.ip_name listingHolderName"); //上市可持有人名称
    fieldsArray.push("doubleReview"); //双人复核
    fieldsArray.push("commodityDeviceRegistration"); //商品/器械注册批件
    fieldsArray.push("drugSuppleApply"); //药品补充申请批件
    fieldsArray.push("salesByPrescription"); //凭处方单销售
    fieldsArray.push("isBatchManage"); //是否批次管理
    fieldsArray.push("commodityRegistrationApproval"); //商品/器械再注册批件
    fieldsArray.push("producingArea"); //产地
    fieldsArray.push("coldChainDrugs"); //冷链药品
    fieldsArray.push("prescriptionType"); //处方分类
    fieldsArray.push("poison"); //毒性药品
    fieldsArray.push("reportOnImportedDrugs"); //进口药品通关证/进口药品报告书
    fieldsArray.push("antitumorDrugs"); //抗肿瘤药
    fieldsArray.push("materialType"); //医药物料分类
    fieldsArray.push("materialCode"); //物料编码
    fieldsArray.push("commonNme"); //通用名
    fieldsArray.push("zypfStandard"); //中药配方执行标准
    fieldsArray.push("approvalNumber"); //批准文号
    fieldsArray.push("isSku"); //是否sku维度
    fieldsArray.push("changeOrderNo"); //首营变更单号
    fieldsArray.push("drugPackaging"); //药品包装
    fieldsArray.push("material"); //物料
    fieldsArray.push("materialCode1"); //物料编码1
    fieldsArray.push("radiation"); //放射药品
    fieldsArray.push("packingMaterial"); //包材
    fieldsArray.push("importedMedicinalMaterials"); //进口药材批件
    fieldsArray.push("injection"); //注射剂
    fieldsArray.push("innerPackMaterial"); //内包装材料
    fieldsArray.push("boxPackSpec"); //装箱包装规格
    fieldsArray.push("approvalValidityDate"); //批文有效期
    fieldsArray.push("supplierCompanyName"); //供货企业名称
    fieldsArray.push("isApprovalProof"); //药品生产/进口批准证明文件及其附件
    fieldsArray.push("majorFunction"); //适应症或功能主治
    fieldsArray.push("isProductionProe"); //药品生产批件
    fieldsArray.push("isQualityStandard"); //药品质量标准
    fieldsArray.push("isSurveyReport"); //检验报告书
    fieldsArray.push("isPriceApproval"); //物价批文
    fieldsArray.push("model"); //型号
    fieldsArray.push("registNo"); //注册证号
    fieldsArray.push("productLincenseNo"); //生产许可证号
    fieldsArray.push("registerName"); //注册人名称
    fieldsArray.push("registerAddress"); //代理人住所
    fieldsArray.push("agentName"); //代理人名称
    fieldsArray.push("agentAddress"); //代理人住所
    fieldsArray.push("ccsx"); //存储属性
    fieldsArray.push("spsx"); //商品属性
    fieldsArray.push("supplierCompany"); //供货企业
    fieldsArray.push("factory"); //GSP生产厂商
    fieldsArray.push("isDualTrackPrescry"); //是否双轨处方
    fieldsArray.push("zyyp"); //中药饮片
    fieldsArray.push("containStimulant"); //含兴奋剂
    fieldsArray.push("counterProduct"); //专柜商品
    fieldsArray.push("splitSales"); //拆零销售
    fieldsArray.push("prescriptType"); //处方类型
    fieldsArray.push("treatmentrange"); //诊疗范围
    fieldsArray.push("barjstscqy"); //备案人及受托生产企业
    fieldsArray.push("isretailregist"); //是否零售登记
    fieldsArray.push("importantUpkeepDay"); //重点养护天数
    fieldsArray.push("generalUpkeepDay"); //一般养护天数
    fieldsArray.push("approachValidityPeriod"); //近效期天数
    fieldsArray.push("newCuringType"); //养护类型
    //一共111个字段
    let yonql = "select " + fieldsArray.join(",") + " from GT22176AT10.GT22176AT10.SY01_material_file where dr = 0 and id = '" + param.data[0].id + "'";
    let res = ObjectStore.queryByYonQL(yonql, "sy01")[0];
    //查询物料档案
    let materialSql = "select id from  pc.product.Product where  id = '" + res.material + "'";
    let materialInfo = ObjectStore.queryByYonQL(materialSql, "productcenter");
    if (materialInfo.length == 0) {
      throw new Error("此物料已经删除");
    }
    try {
      update(res);
    } catch (error) {
      throw new Error(error);
    }
  }
}
exports({
  entryPoint: MyTrigger
});