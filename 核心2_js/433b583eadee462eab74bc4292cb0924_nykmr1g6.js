let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
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
exports({
  entryPoint: MyTrigger
});