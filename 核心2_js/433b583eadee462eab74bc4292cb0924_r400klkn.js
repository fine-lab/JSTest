let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let edition = "new";
    if (edition == "new") {
      let getSwitchValue = function (isTrue) {
        if (isTrue == 1 || isTrue == "1" || isTrue == true || isTrue == "true") {
          return "1";
        } else if (isTrue == 0 || isTrue == "0" || isTrue == false || isTrue == "false") {
          return "0";
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
        var curTypeObject = { id: res.curingtype };
        var curTypeRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_curingtypesv2", curTypeObject);
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
              deliverQuantityChange: materialInfo.detail.requireUnit,
              businessAttribute: materialInfo.detail.businessAttribute,
              saleChannel: materialInfo.detail.saleChannel
            },
            id: materialInfo.id,
            extend_is_gsp: true,
            //生产厂家
            manufacturer: res.manufacturer,
            extend_cffl: res.cffl,
            extend_standard_code: res.bwm,
            extend_yhlb: res.curingtype,
            extend_yhlb_curingTypeName: res.curingtype_curingTypeName,
            extend_yhlb_name: curTypeRes.curingTypeName,
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
            productClass_Name: materialInfo.productClass_Name
          }
        };
        extrequire("GT22176AT10.publicFunction.saveProduct").execute(json);
      };
      var billObj = {
        id: param.data[0].id,
        compositions: [
          {
            name: "sy01_material_other_reportList"
          }
        ]
      };
      //实体查询
      var res = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_fccusauditv4", billObj);
      //查询物料档案
      let materialSql = "select isBatchManage,isExpiryDateManage,expireDateNo,expireDateUnit  from  pc.product.ProductDetail where productId = '" + res.customerbillno + "'";
      let materialInfo = ObjectStore.queryByYonQL(materialSql, "productcenter");
      if (materialInfo.length == 0) {
        throw new Error("此物料已经删除");
      }
      let expireDateUnit;
      if (materialInfo[0].expireDateUnit != undefined) {
        expireDateUnit = materialInfo[0].expireDateUnit.toString();
      }
      //查询养护类别
      //查询GSP物料分类
      let orgId = res.org_id;
      let json = {
        //使用组织
        org_id: res.org_id,
        //医药物料分类
        materialType: res.customertype,
        materialTypeName: res.customertypeName,
        //物料
        material: res.customerbillno,
        materialCode: res.customername,
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
        producingArea: res.produceArea,
        //规格
        specs: res.specifications,
        //近效期类别
        nearEffectivePeriodType: res.nearPeriodType,
        //剂型
        dosageForm: res.dosageform,
        dosageFormName: res.dosageformName,
        //养护类别
        curingType: res.curingtype,
        curingTypeName: res.curingTypeName,
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
        //通用名
        commonNme: res.extend_tym,
        isBatchManage: getSwitchValue(materialInfo[0].isBatchManage),
        isExpiryDateManage: getSwitchValue(materialInfo[0].isExpiryDateManage),
        expireDateNo: materialInfo[0].expireDateNo,
        expireDateUnit: expireDateUnit,
        saleState: "1"
      };
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
            enclosure: sy_report[i].file
          };
          reportsArr.push(info);
        }
      }
      json["SY01_material_file_childList"] = reportsArr;
      let materialRes = ObjectStore.insert("GT22176AT10.GT22176AT10.SY01_material_file", json, "775b9cd9");
      update(res);
    } else if (edition == "old") {
      let materialInfo = {};
      var billObj = {
        id: param.data[0].id,
        compositions: [
          {
            name: "sy01_material_other_reportList"
          }
        ]
      };
      //实体查询
      var res = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_fccusauditv4", billObj);
      //查询养护类别
      var curTypeObject = { id: res.curingtype };
      var curTypeRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_curingtypesv2", curTypeObject);
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
            deliverQuantityChange: materialInfo.detail.requireUnit,
            businessAttribute: materialInfo.detail.businessAttribute,
            saleChannel: materialInfo.detail.saleChannel
          },
          id: materialInfo.id,
          extend_is_gsp: true,
          //生产厂家
          manufacturer: res.manufacturer,
          extend_cffl: res.cffl,
          extend_standard_code: res.bwm,
          extend_yhlb: res.curingtype,
          extend_yhlb_curingTypeName: res.curingtype_curingTypeName,
          extend_yhlb_name: curTypeRes.curingTypeName,
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
          productClass_Name: materialInfo.productClass_Name
        }
      };
      extrequire("GT22176AT10.publicFunction.saveProduct").execute(json);
    }
  }
}
exports({
  entryPoint: MyTrigger
});