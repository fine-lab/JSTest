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
    let getDate = function (date) {
      if (date != undefined) {
        date = new Date(date);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        if (month.length == 1) {
          month = "0" + month;
        }
        if (day.length == 1) {
          day = "0" + day;
        }
        let dateTime = year + "-" + month + "-" + day;
        return dateTime;
      }
    };
    let update = function (res) {
      //查询养护类别
      let selectCurType = "select * from GT22176AT10.GT22176AT10.SY01_curingtypesv2 where id = '" + res.curingtype + "'";
      var curTypeRes = ObjectStore.queryByYonQL(selectCurType, "sy01")[0];
      let materialId = res.customerbillno;
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
      let reportInfo = [];
      let sy_report = res.sy01_material_other_reportList;
      if (sy_report != undefined) {
        for (let i = 0; i < sy_report.length; i++) {
          let info = {};
          info._status = "Insert";
          info.extend_report = sy_report[i].report;
          info.extend_report_name = sy_report[i].report_name;
          info.extend_pzrq = sy_report[i].begin_date;
          info.extend_yxqz = sy_report[i].end_date;
          info.extend_fille = sy_report[i].file;
          reportInfo.push(info);
        }
      }
      //查询组织形态
      let orgSql = "select name from bd.customerdoc_orgform.orgform where id = '" + orgId + "'";
      let orgInfo = ObjectStore.queryByYonQL(orgSql, "ucfbasedoc");
      let orgGSPInfo = [];
      let gspInfo = {};
      gspInfo._status = "Insert";
      gspInfo.org = orgId;
      gspInfo.org_name = orgInfo.name;
      gspInfo.isGSP = "1";
      gspInfo.isFirstMarketing = "1";
      gspInfo.sku = res.sku;
      gspInfo.skuName = res.skuName;
      orgGSPInfo.push(gspInfo);
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
          model: res.model,
          extend_is_gsp: true,
          //生产厂家
          manufacturer: res.manufacturer,
          isSku: getSwitchValue(res.is_sku),
          extend_cffl: res.cffl,
          extend_standard_code: res.bwm,
          extend_yhlb: res.curingtype,
          extend_yhlb_curingTypeName: res.curingtype_curingTypeName,
          extend_yhlb_name: res.curingTypeName,
          extend_cctj: res.storageConditions,
          extend_jxqlb: res.nearPeriodType,
          extend_jx: res.dosageform,
          extend_jx_name: res.dosageform_dosagaFormName,
          extend_sysqry: res.applier,
          extend_ssxkcyr: res.licneser,
          extend_gsp_spfl: res.customertype,
          extend_gsp_spfl_name: res.customertype_catagoryname,
          extend_applydep: res.applydep,
          extend_syrq_date: res.applydate,
          extend_zlbz: res.qualityStandard,
          extend_sydh: res.code,
          modelDescription: res.specifications,
          extend_tym: res.extend_tym,
          extend_imregisterlicenseNo: res.imregisterlicenseNo,
          extend_ypbcsqpj: res.ypbcsqpj,
          extend_spjxzcpj: res.spjxzcpj,
          extend_swqfhgz: res.swqfhgz,
          extend_sms: res.sms,
          extend_spqxzzcpj: res.spqxzzcpj,
          extend_jkxkz: res.jkxkz,
          extend_jkycpj: res.jkycpj,
          extend_ypbz: res.ypbz,
          extend_jkswzpjybgs: res.jkswzpjybgs,
          extend_jkypzczyy: res.jkypzczyy,
          extend_jkyptgz: res.jkyptgz,
          extend_spqk: res.customerquality,
          extend_llyp: res.llyp,
          extend_jkyp: res.jkyp,
          extend_zsj: res.zsj,
          extend_tsyp: res.htsypffz,
          extend_kzlyp: res.kzly,
          extend_kss: res.kss,
          extend_pcfdxs: res.pcfdss,
          extend_srfh: res.ecys,
          extend_hmhj: res.hmhj,
          extend_syzt: "1",
          placeOfOrigin: res.produceArea,
          name: materialInfo.name,
          orgId: materialInfo.orgId,
          code: materialInfo.code,
          manageClass: materialInfo.manageClass,
          realProductAttribute: materialInfo.realProductAttribute,
          unitUseType: materialInfo.unitUseType,
          unit: materialInfo.unit,
          _status: "Update",
          productOrgs: MaterialProductOrgsJson,
          extend_pzwh: res.approvalNo,
          extend_bc: res.extend_bc,
          extend_bc_packing_name: res.extend_bc_packing_name,
          SY01_wl_cpzzList: reportInfo,
          sy01_gsp_infosList: orgGSPInfo,
          //商品分类
          productClass: materialInfo.productClass,
          productClass_Code: materialInfo.productClass_Code,
          productClass_Name: materialInfo.productClass_Name,
          extendzcr: res.registerName,
          extendbah: res.recordNo,
          extendCcsx: res.ccsx,
          extendSpsx: res.spsx,
          extendOldGspType: res.oldGspType,
          extendTymZjm: res.tymZjm
        }
      };
      extrequire("GT22176AT10.publicFunction.saveProduct").execute(json);
    };
    let yonql1 =
      "select id,creator,org_id,code,applyType,applydate,applyorg,applydep,applier,purchaser,tradeprice,treatmentrange," +
      "retailprice,imregisterlicenseNo,nationalcustomertype1,customerquality,customerbillno,customername,specifications,customertype,curingtype," +
      "dosageform,storageConditions,packingunit,packagequantity,nearPeriodType,periodUnit,expireAmount,manufacturer1,produceArea,approvalNo,approvalDate," +
      "expireDate,GMPNo,authDate,qualityStandard,licneser,licneserName,purchaserOpinion,ypbcsqpj,spjxzcpj," +
      "swqfhgz,sms,spqxzzcpj,jkxkz,jkycpj,ypbz,jkswzpjybgs,hmhj,jkyptgz,jkyp,llyp,zsj,ecys,htsypffz,kzly,kss," +
      "pcfdss,cffl,manufacturer,bwm,extend_tym,extend_bc,extend_bc_name,sku,skuName,skuCode,is_sku," +
      "customertypeName,dosageformName,storageConditionsName,recordNo,zyypStandard,zypfStandard," +
      "psychotropic,radiation,poison,narcotic,areaResource,tezhengn,template,materialCode ," +
      "unit,unit.name,innerPackMaterial,boxPackSpec,shelfLife,shelfLifeUnit,approvalValidityDate,isApprovalProof,majorFunction, " +
      "isProductionProe,isQualityStandard,isSurveyReport,isPriceApproval,supplierCompany,supplierCompany.name, " +
      "model,registNo,productLincenseNo,registerName,registerAddress,agentName,agentAddress,ccsx,spsx,factory, barjstscqy " +
      ",newCuringType,firstMaintainDay,approachValidityPeriod,importantUpkeepDay,generalUpkeepDay," +
      "usage,component,character,medReminder,oldGspType,tymZjm  " +
      "from GT22176AT10.GT22176AT10.SY01_fccusauditv4 where dr = 0 and id = '" +
      param.data[0].id +
      "' and dr = 0";
    let res = ObjectStore.queryByYonQL(yonql1, "sy01")[0];
    //防止重复生成
    let validateIsInsertSql = "select id,firstBusinessOrderNo from GT22176AT10.GT22176AT10.SY01_material_file where firstBusinessOrderNo = '" + res.code + "' and dr = 0";
    let validateIsInsertRes = ObjectStore.queryByYonQL(validateIsInsertSql, "sy01");
    if (Array.isArray(validateIsInsertRes) && validateIsInsertRes.length > 0) {
      return;
    }
    //查询内容
    let yonql2 =
      "select id,report,begin_date,end_date,file,reportName,reportCode,approvalDate from GT22176AT10.GT22176AT10.sy01_material_other_report where SY01_fccusauditv4_id = '" + param.data[0].id + "'";
    res["sy01_material_other_reportList"] = ObjectStore.queryByYonQL(yonql2, "sy01");
    //查询物料档案
    let materialSql =
      "select isBatchManage,isExpiryDateManage,expireDateNo,expireDateUnit,isExpiryDateCalculationMethod  from  pc.product.ProductDetail where  productId = '" + res.customerbillno + "'";
    let materialInfo = ObjectStore.queryByYonQL(materialSql, "productcenter");
    if (materialInfo.length == 0) {
      throw new Error("此物料已经删除");
    }
    let isExpiryDateCalculationMethod;
    if (materialInfo[0].isExpiryDateCalculationMethod != undefined) {
      isExpiryDateCalculationMethod = materialInfo[0].isExpiryDateCalculationMethod.toString();
    }
    materialSql = "select placeOfOrigin,modelDescription,unit from pc.product.Product where id = '" + res.customerbillno + "'";
    let res1 = ObjectStore.queryByYonQL(materialSql, "productcenter");
    if (res1[0].unit != undefined) {
      let selectUnitNameQl = "select name from aa.product.ProductUnit where id = '" + res1[0].unit + "'";
      materialInfo[0].unitName = ObjectStore.queryByYonQL(selectUnitNameQl, "productcenter")[0].name;
    }
    materialInfo[0].placeOfOrigin = res1[0].placeOfOrigin;
    materialInfo[0].modelDescription = res1[0].modelDescription;
    if (res1[0].unit != undefined) {
      materialInfo[0].unit = res1[0].unit.toString();
    }
    //查询养护类别
    //查询GSP物料分类
    let orgId = res.org_id;
    let json = {
      //使用组织
      org_id: res.org_id,
      creator: res.creator,
      isSku: getSwitchValue(res.is_sku),
      //医药物料分类
      materialType: res.customertype,
      materialTypeName: res.customertypeName,
      //诊疗范围
      treatmentrange: res.treatmentrange,
      //物料
      material: res.customerbillno,
      materialCode: res.customername,
      materialCode1: res.materialCode,
      factory: res.factory,
      //进口药品注册证号
      importDrugsRegisterNo: res.imregisterlicenseNo,
      materialSkuCode: res.sku,
      materialSkuCode_code: res.sku_code,
      skuCode: res.skuCode,
      skuName: res.skuName,
      //首营日期
      firstSaleDate: getDate(res.applydate),
      //首营状态
      firstBattalionStatus: "1",
      //首营单号
      firstBusinessOrderNo: res.code,
      //批准文号
      approvalNumber: res.approvalNo,
      //生产厂商
      manufacturer: res.manufacturer,
      //产地
      producingArea: materialInfo[0].placeOfOrigin,
      //规格
      specs: materialInfo[0].modelDescription,
      //近效期类别
      nearEffectivePeriodType: res.nearPeriodType,
      //剂型
      dosageForm: res.dosageform,
      dosageFormName: res.dosageformName,
      //养护类别
      curingType: res.curingtype,
      //新养护类别
      newCuringType: res.newCuringType,
      firstMaintainDay: res.firstMaintainDay,
      approachValidityPeriod: res.approachValidityPeriod,
      importantUpkeepDay: res.importantUpkeepDay,
      generalUpkeepDay: res.generalUpkeepDay,
      //存储条件
      storageCondition: res.storageConditions,
      storageConditionName: res.storageConditionsName,
      //上市可持有人
      listingHolder: res.licneser,
      listingHolderName: res.licneserName,
      //包材
      packingMaterial: res.extend_bc,
      packingMaterialName: res.extend_bc_name,
      //本位码
      standardCode: res.bwm,
      //处方分类
      prescriptionType: res.cffl,
      //进口药品注册证(进口药品注册号)
      //商品性能、质量、用途、疗效
      commodityPerformance: res.customerquality,
      //质量标准
      qualityStandard: res.qualityStandard,
      //主计量:
      mainUnit: res.unit,
      mainUnitName: res.unit_name,
      //内包装材料
      innerPackMaterial: res.innerPackMaterial,
      //装箱包装规格
      boxPackSpec: res.boxPackSpec,
      //批文有效期
      approvalValidityDate: res.approvalValidityDate,
      //保质期
      expireDateNo: res.shelfLife,
      //保质期单位
      expireDateUnit: res.shelfLifeUnit,
      //药品生产/进口批准证明文件及其附件
      isApprovalProof: res.isApprovalProof,
      //适应症或功能主治
      majorFunction: res.majorFunction,
      //供货企业
      supplierCompany: res.supplierCompany,
      //供货企业名称
      supplierCompanyName: res.supplierCompany_name,
      //药品生产批件
      isProductionProe: res.isProductionProe,
      //药品质量标准
      isQualityStandard: res.isQualityStandard,
      //检验报告书
      isSurveyReport: res.isSurveyReport,
      //物价批文
      isPriceApproval: res.isPriceApproval,
      //型号
      model: res.model,
      //注册证号
      registNo: res.registNo,
      //生产许可证号
      productLincenseNo: res.productLincenseNo,
      //注册人名称
      registerName: res.registerName,
      //注册人住所/生产地址
      registerAddress: res.registerAddress,
      //代理人名称
      agentName: res.agentName,
      //代理人住所
      agentAddress: res.agentAddress,
      //单据状态
      verifystate: "0",
      //药品补充申请批件
      drugSuppleApply: getSwitchValue(res.ypbcsqpj),
      //商品/器械注册批件
      commodityDeviceRegistration: getSwitchValue(res.spjxzcpj),
      //生物签发合格证
      biologicalCertification: getSwitchValue(res.swqfhgz),
      //商品/器械再注册批件
      commodityRegistrationApproval: getSwitchValue(res.spqxzzcpj),
      //说明书
      instructions: getSwitchValue(res.sms),
      //进口许可证
      importLicense: getSwitchValue(res.jkxkz),
      //进口药材批件
      importedMedicinalMaterials: getSwitchValue(res.jkycpj),
      //进口生物制品检验报告书
      importedBiologicalProducts: getSwitchValue(res.jkswzpjybgs),
      //药品包装
      drugPackaging: getSwitchValue(res.ypbz),
      //含麻黄碱
      ephedrineContaining: getSwitchValue(res.hmhj),
      //进口药品注册证/医药产品注册证/进口药品批件
      importDrugRegistrationCertificate: getSwitchValue(res.jkypzczyy),
      //冷链药品
      coldChainDrugs: getSwitchValue(res.llyp),
      //进口药品通关证/进口药品报告书
      reportOnImportedDrugs: getSwitchValue(res.jkyptgz),
      //进口药品
      importedDrugs: getSwitchValue(res.jkyp),
      //凭处方单销售
      salesByPrescription: getSwitchValue(res.pcfdss),
      //注射剂
      injection: getSwitchValue(res.zsj),
      //双人复核
      doubleReview: getSwitchValue(res.ecys),
      //抗肿瘤药
      antitumorDrugs: getSwitchValue(res.kzly),
      //含特殊药品复方制
      specialDrugs: getSwitchValue(res.htsypffz),
      //抗生素
      antibiotic: getSwitchValue(res.kss),
      //备案人及受托生产企业
      psychotropic: getSwitchValue(res.psychotropic),
      radiation: getSwitchValue(res.radiation),
      poison: getSwitchValue(res.poison),
      narcotic: getSwitchValue(res.narcotic),
      //通用名
      commonNme: res.extend_tym,
      isBatchManage: getSwitchValue(materialInfo[0].isBatchManage),
      isExpiryDateManage: getSwitchValue(materialInfo[0].isExpiryDateManage),
      isExpiryDateCalculationMethod: isExpiryDateCalculationMethod,
      recordNo: res.recordNo,
      zyypStandard: res.zyypStandard,
      zypfStandard: res.zypfStandard,
      barjstscqy: res.barjstscqy,
      ccsx: res.ccsx,
      spsx: res.spsx,
      saleState: "1",
      template: res.template,
      treatmentrangedx: res.treatmentrangedx,
      usage: res.usage,
      component: res.component,
      character: res.character,
      medReminder: res.medReminder,
      oldGspType: res.oldGspType,
      tymZjm: res.tymZjm
    };
    if (res.tezhengn != undefined && [2, "2"].includes(res.is_sku)) {
      json["freeCTH"] = res.tezhengn;
    }
    let sy_report = res.sy01_material_other_reportList;
    let reportsArr = [];
    if (sy_report != undefined) {
      for (let i = 0; i < sy_report.length; i++) {
        //查询资质及报告档案
        let info = {
          qualifyReport: sy_report[i].report,
          qualifyReportName: sy_report[i].reportName,
          startDate: getDate(sy_report[i].begin_date),
          validUntil: getDate(sy_report[i].end_date),
          approvalDate: getDate(sy_report[i].approvalDate),
          enclosure: sy_report[i].file,
          reportCode: sy_report[i].reportCode
        };
        reportsArr.push(info);
      }
    }
    json["SY01_material_file_childList"] = reportsArr;
    try {
      update(res);
      let materialRes = ObjectStore.insert("GT22176AT10.GT22176AT10.SY01_material_file", json, "775b9cd9");
      if (materialRes.id != undefined && materialRes.id != null) {
        let selectBGTreatmentDxSql = "select fkid,treatmentrangedx from GT22176AT10.GT22176AT10.SY01_fccusauditv4_treatmentrangedx where fkid = '" + param.data[0].id + "'";
        let BGtreatmentDxRes = ObjectStore.queryByYonQL(selectBGTreatmentDxSql, "sy01");
        for (let i = 0; i < BGtreatmentDxRes.length; i++) {
          BGtreatmentDxRes[i].fkid = materialRes.id;
        }
        if (BGtreatmentDxRes.length > 0) {
          //批量插入
          ObjectStore.insertBatch("GT22176AT10.GT22176AT10.SY01_material_file_treatmentrangedx", BGtreatmentDxRes, "");
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
exports({
  entryPoint: MyTrigger
});