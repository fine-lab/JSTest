let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var billObj = {
      id: param.data[0].id,
      compositions: [
        {
          name: "sy01_material_change_reportList"
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_fcuscauditv2", billObj);
    //查询组织形态
    let orgSql = "select name from bd.customerdoc_orgform.orgform where id = '" + res.org_id + "'";
    let orgInfo = ObjectStore.queryByYonQL(orgSql, "ucfbasedoc");
    //查询物料档案
    let materialSql = "select * from pc.product.Product where id = '" + res.customerbillno + "'";
    let materialInfo = ObjectStore.queryByYonQL(materialSql, "productcenter");
    //查询养护类别
    //查询GSP物料分类
    let customerTypeObject = { id: res.pro_type };
    let customerTypeRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_custcatagoryv3", customerTypeObject);
    //查询近效期类别
    let nperiodTypeObject = { id: res.nearType };
    let nperiodTypeRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_nperiodtypesv2", nperiodTypeObject);
    //查询剂型
    let dosagaFormObject = { id: res.dosageform };
    let dosagaFormRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_dosagaformv1", dosagaFormObject);
    //查询存储条件
    let storageConditionsObject = { id: res.storageConditions };
    let storageConditionsRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_stocondv2", storageConditionsObject);
    //查询上市许可持有人
    let licneserObject = { id: res.licenser };
    let licneserRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.t_sy01_lpholderv3", licneserObject);
    //查询包材
    let packingObject = { id: res.bc };
    let packingRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.sy01_packing", packingObject);
    //查询医药物料档案
    let materialId = res.customerbillno; //product_name:物料编码
    let orgId = res.org_id;
    let customerObj = { materialId, orgId };
    let apiResponse = extrequire("GT22176AT10.publicFunction.getProLicInfo").execute(customerObj);
    let materialFileInfo = apiResponse.proLicInfo;
    let num = "";
    for (let i = 0; i < 6; i++) {
      let radom = Math.floor(Math.random() * 10);
      num += radom;
    }
    let medicineCode = "YYWL" + num;
    let json = {
      id: materialFileInfo.id,
      code: medicineCode,
      //使用组织
      org_id: res.org_id,
      org_id_name: orgInfo.name,
      //医药物料分类
      materialType: res.pro_type,
      materialType_name: getName(customerTypeRes),
      material_type_name: getName(customerTypeRes),
      //物料
      material: res.customerbillno,
      material_name: getName(materialInfo),
      //首营日期
      changeData: getDate(res.applydate),
      //首营状态
      firstBattalionStatus: "1",
      //首营单号
      changeOrderNo: res.code,
      //批准文号
      approvalNumber: res.approvalNo,
      //生产厂商
      manufacturer: res.manufacturer_name,
      //产地
      producingArea: res.produceArea,
      //规格
      specs: res.specifications,
      //近效期类别
      nearEffectivePeriodType: res.nearType,
      nearEffectivePeriodType_nearName: getName(nperiodTypeRes),
      //剂型
      dosageForm: res.dosageform,
      dosageForm_dosagaFormName: getName(dosagaFormRes),
      dosage_form_name: getName(dosagaFormRes),
      //养护类别(暂不添加)
      //存储条件
      storageCondition: res.storageConditions,
      storageCondition_storageName: getName(storageConditionsRes),
      //上市可持有人
      listingHolder: res.licenser,
      listingHolder_ip_name: getName(licneserRes),
      listing_holder_name: getName(licneserRes),
      //包材
      packingMaterial: res.bc,
      packingMaterial_packing_name: getName(packingRes),
      //本位码
      standardCode: res.bwm,
      //处方分类
      prescriptionType: res.cffl,
      //进口药品注册证(进口药品注册号)
      import_drug_registration_certificate: res.imregisterlicenseNo,
      //商品性能、质量、用途、疗效
      commodityPerformance: res.customerquality,
      //质量标准
      qualityStandard: res.quaStandard,
      //单据状态
      verifystate: "0",
      //药品补充申请批件
      drugSuppleApply: enumeration(res.ypbcsqpj),
      //商品/器械注册批件
      commodityDeviceRegistration: enumeration(res.spqxzcpj),
      //生物签发合格证
      biologicalCertification: enumeration(res.swqfhgz),
      //商品/器械再注册批件
      commodityRegistrationApproval: enumeration(res.spqxzzcpj),
      //说明书
      instructions: enumeration(res.sms),
      //进口许可证
      importLicense: enumeration(res.jkxkz),
      //进口药材批件
      importedMedicinalMaterials: enumeration(res.jkycpj),
      //进口生物制品检验报告书
      importedBiologicalProducts: enumeration(res.jkswzpjybgs),
      //药品包装
      drugPackaging: enumeration(res.ypbz),
      //含麻黄碱
      ephedrineContaining: enumeration(res.hmhj),
      //进口药品注册证/医药产品注册证/进口药品批件
      importDrugRegistrationCertificate: enumeration(res.jkypzczs),
      //冷链药品
      coldChainDrugs: enumeration(res.iscoldchain),
      //进口药品通关证/进口药品报告书
      reportOnImportedDrugs: enumeration(res.jkyptgzs),
      //进口药品
      importedDrugs: enumeration(res.isimporteddrugs),
      //凭处方单销售
      salesByPrescription: enumeration(res.isotcsale),
      //注射剂
      injection: enumeration(res.isinjection),
      //双人复核
      doubleReview: enumeration(res.issecacceptance),
      //抗肿瘤药
      antitumorDrugs: enumeration(res.isAntitumordrugs),
      //含特殊药品复方制
      specialDrugs: enumeration(res.hanteshuyaopin),
      //抗生素
      antibiotic: enumeration(res.isantibiotic),
      //通用名
      common_name: res.extend_tym
    };
    let materialRes = ObjectStore.updateById("GT22176AT10.GT22176AT10.SY01_material_file", json, "SY01_material_file");
    let sy_report = res.sy01_material_change_reportList;
    let syReportId = [];
    let info = {};
    if (sy_report != undefined) {
      for (let i = 0; i < sy_report.length; i++) {
        //查询资质及报告档案
        let otherReportObject = { id: sy_report[i].report };
        let otherReportRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.sy01_other_report", otherReportObject);
        if (sy_report[i].medicine_related_id == undefined || sy_report[i].medicine_related_id == "") {
          info = {
            qualifyReport: sy_report[i].report,
            qualifyReport_name: otherReportRes[0].name,
            startDate: getDate(sy_report[i].begin_date),
            validUntil: getDate(sy_report[i].end_date),
            enclosure: sy_report[i].file,
            SY01_material_file_childFk: materialFileInfo.id
          };
          let materialLicRes = ObjectStore.insert("GT22176AT10.GT22176AT10.SY01_material_file_child", info, "SY01_material_file_child");
        } else {
          info = {
            id: materialFileInfo.id,
            SY01_material_file_childList: [
              {
                id: sy_report[i].medicine_related_id,
                qualifyReport: sy_report[i].report,
                qualifyReport_name: otherReportRes[0].name,
                startDate: getDate(sy_report[i].begin_date),
                validUntil: getDate(sy_report[i].end_date),
                enclosure: sy_report[i].file,
                SY01_material_file_childFk: materialFileInfo.id,
                _status: "Update"
              }
            ]
          };
          let materialLicRes = ObjectStore.updateById("GT22176AT10.GT22176AT10.SY01_material_file", info, "775b9cd9");
          syReportId.push(sy_report[i].medicine_related_id);
        }
      }
    }
    let medicineReportObject = { SY01_material_file_childFk: materialFileInfo.id };
    let medicineReportRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_material_file_child", medicineReportObject);
    let mRedId = [];
    for (let i = 0; i < medicineReportRes.length; i++) {
      mRedId.push(medicineReportRes[i].id);
    }
    for (let key in mRedId) {
      if (syReportId.hasOwnProperty(key)) {
        info = {
          id: mRedId[key]
        };
        let materiaLlicRes = ObjectStore.deleteById("GT22176AT10.GT22176AT10.SY01_material_file_child", info, "SY01_material_file_child");
      }
    }
    function enumeration(isTrue) {
      if (isTrue == 1 || isTrue == "1" || isTrue == true || isTrue == "true") {
        return "1";
      } else if (isTrue == 0 || isTrue == "0" || isTrue == false || isTrue == "false") {
        return "0";
      }
    }
    function getDate(date) {
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
    }
    function getName(name) {
      if (typeof name == "object") {
        if (name == customerTypeRes) {
          return name.catagoryname;
        } else if (name == materialInfo) {
          return name.name;
        } else if (name == orgInfo) {
          return name.name;
        } else if (name == nperiodTypeRes) {
          return name.nearName;
        } else if (name == dosagaFormRes) {
          return name.dosagaFormName;
        } else if (name == storageConditionsRes) {
          return name.storageName;
        } else if (name == licneserRes) {
          return name.ip_name;
        } else if (name == packingRes) {
          return name.packing_name;
        }
      } else if (name.constructor === Array) {
        if (name == customerTypeRes) {
          return name[0].catagoryname;
        } else if (name == materialInfo) {
          return name[0].name;
        } else if (name == orgInfo) {
          return name[0].name;
        } else if (name == nperiodTypeRes) {
          return name[0].nearName;
        } else if (name == dosagaFormRes) {
          return name[0].dosagaFormName;
        } else if (name == storageConditionsRes) {
          return name[0].storageName;
        } else if (name == licneserRes) {
          return name[0].ip_name;
        } else if (name == packingRes) {
          return name[0].packing_name;
        }
      }
    }
  }
}
exports({
  entryPoint: MyTrigger
});