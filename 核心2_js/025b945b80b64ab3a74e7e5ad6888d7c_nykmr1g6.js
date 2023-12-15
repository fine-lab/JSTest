let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let materialInfo = {};
    //查询首营商品变更审批单
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
    let materialId = res.customerbillno;
    let orgId = res.org_id;
    let vendorList = { materialId, orgId };
    //获取商品档案详情
    let apiResponseProduct = extrequire("GT22176AT10.publicFunction.getProductDetail").execute(vendorList);
    materialInfo = apiResponseProduct.merchantInfo;
    let MaterialProductOrgsJson = [];
    if (materialInfo.productOrgs != null && materialInfo.productOrgs != undefined) {
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
    let sy_report = res.sy01_material_change_reportList;
    let updateIds = [];
    if (sy_report != undefined && sy_report != null) {
      for (let i = 0; i < sy_report.length; i++) {
        let info = {};
        if (sy_report[i].related_id == undefined || sy_report[i].related_id == "") {
          info._status = "Insert";
        } else {
          info.id = sy_report[i].related_id;
          info._status = "Update";
          updateIds.push(sy_report[i].related_id);
        }
        info.extend_report = sy_report[i].report;
        info.extend_report_name = sy_report[i].report_name;
        info.extend_pzrq = sy_report[i].begin_date;
        info.extend_yxqz = sy_report[i].end_date;
        info.extend_fille = sy_report[i].file;
        reportInfo.push(info);
      }
    }
    let material_report = materialInfo.SY01_wl_cpzzList;
    if (material_report != undefined && material_report != null) {
      for (let i = 0; i < material_report.length; i++) {
        let isDelete = true;
        for (let j = 0; j < updateIds.length; j++) {
          if (material_report[i].id == updateIds[j]) {
            isDelete = false;
            break;
          }
        }
        if (isDelete) {
          reportInfo.push({ id: material_report[i].id, _status: "Delete" });
        }
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
          deliverQuantityChange: materialInfo.detail.deliverQuantityChange,
          detail_productApplyRangeId: materialInfo.detail.detail_productApplyRangeId,
          //业务属性
          businessAttribute: materialInfo.detail.businessAttribute,
          saleChannel: materialInfo.detail.saleChannel
        },
        id: materialInfo.id,
        extend_yhlb: res.curingtype,
        extend_yhlb_curingTypeName: res.curingtype_curingTypeName,
        extend_cctj: res.storageConditions,
        extend_jxqlb: res.nearType,
        extend_jx: res.dosageform,
        extend_jx_name: res.dosageform_dosagaFormName,
        extend_sysqry: res.applier,
        extend_ssxkcyr: res.licenser,
        extend_gsp_spfl: res.pro_type,
        extend_cffl: res.cffl,
        extend__sydh_change: res.code,
        extend_standard_code: res.bwm,
        extend_applydep: res.applydep,
        extend_jkyp: res.isimporteddrugs,
        extend_llyp: res.iscoldchain,
        extend_zsj: res.isinjection,
        extend_tsyp: res.hanteshuyaopin,
        extend_kzlyp: res.isAntitumordrugs,
        extend_kss: res.isantibiotic,
        extend_pcfdxs: res.isotcsale,
        extend_srfh: res.issecacceptance,
        extend_hmhj: res.hmhj,
        modelDescription: res.specifications,
        extend_tym: res.extend_tym,
        extend_imregisterlicenseNo: res.imregisterlicenseNo,
        extend_ypbcsqpj: res.ypbcsqpj,
        extend_spjxzcpj: res.spqxzcpj,
        extend_swqfhgz: res.swqfhgz,
        extend_sms: res.sms,
        extend_spqxzzcpj: res.spqxzzcpj,
        extend_jkxkz: res.jkxkz,
        extend_jkycpj: res.jkycpj,
        extend_ypbz: res.ypbz,
        extend_jkswzpjybgs: res.jkswzpjybgs,
        extend_jkypzczyy: res.jkypzczs,
        extend_jkyptgz: res.jkyptgzs,
        manufacturer: res.manufacturer_name,
        extend_spqk: res.customerquality,
        extend_scxkzdqr: res.expireDate,
        extend_zlbz: res.quaStandard,
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
        extend_bc: res.bc,
        extend_bc_packing_name: res.bc_packing_name,
        SY01_wl_cpzzList: reportInfo,
        //商品分类
        productClass: materialInfo.productClass,
        productClass_Code: materialInfo.productClass_Code,
        productClass_Name: materialInfo.productClass_Name
      }
    };
    extrequire("GT22176AT10.publicFunction.saveProduct").execute(json);
  }
}
exports({
  entryPoint: MyTrigger
});