let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const get_supper_sql = "select * from GT22176AT10.GT22176AT10.SY01_supcauditv2 where id =" + request.id;
    let baseInfo = ObjectStore.queryByYonQL(get_supper_sql);
    const vendorId = baseInfo[0].supplier;
    const vendorCode = baseInfo[0].supplier_code;
    let vendorList = { vendorId, vendorCode };
    //获取供应商档案详情
    let apiResponseSupplier = extrequire("GT22176AT10.publicFunction.getVenderDetail").execute(vendorList);
    let response_obj = apiResponseSupplier.merchantInfo;
    let extend_lincense_id = {};
    if (typeof response_obj.extend_lincenseList != "undefined") {
      for (let i = 0; i < response_obj.extend_lincenseList.length; i++) {
        let license_fw = response_obj.extend_lincenseList[i].extend_licenseScopeList;
        let fw = [];
        if (typeof license_fw != "undefined") {
          for (let j = 0; j < license_fw.length; j++) {
            fw.push(license_fw[j].id);
          }
        }
        extend_lincense_id[response_obj.extend_lincenseList[i].id] = fw;
      }
    }
    let extend_scope_id = [];
    if (typeof response_obj.attorney_authList != "undefined") {
      for (let i = 0; i < response_obj.attorney_authList.length; i++) {
        let auth_fw = response_obj.attorney_authList[i].scope_authorityList;
        let fw = [];
        if (typeof auth_fw != "undefined") {
          for (let j = 0; j < auth_fw.length; j++) {
            fw.push(auth_fw[j].id);
          }
        }
        extend_scope_id[response_obj.attorney_authList[i].id] = fw;
      }
    }
    for (let i = 0; i < response_obj.vendorOrgs.length; i++) {
      response_obj.vendorOrgs[i]._status = "Update";
    }
    let extend_lincenseList = [];
    let license_obj = {};
    let get_license_sub_res_new = [];
    let license_sub_obj = {};
    let attorney_authList = [];
    let attorney_obj = {};
    let get_weituoshu_sub_res_new = [];
    let attorney_sub_obj = {};
    //获取证照信息
    const get_license_sql = "select * from GT22176AT10.GT22176AT10.SY01_gysbgsp_xgzz where SY01_gysbgsp_id =" + request.id;
    let lincenseList = ObjectStore.queryByYonQL(get_license_sql);
    let license_relate_id = {};
    for (let i = 0; i < lincenseList.length; i++) {
      let del_flag = 1;
      //判断变更后证照关联ID是否供应商档案的证照ID
      let fw = [];
      license_obj = {};
      get_license_sub_res_new = [];
      if (lincenseList[i].relate_id) {
        license_obj._status = "Update";
        license_obj.id = lincenseList[i].relate_id;
      } else {
        license_obj._status = "Insert";
      }
      license_obj.extend_auth_type_v2 = lincenseList[i].scope_type;
      license_obj.extend_license_name = lincenseList[i].license;
      license_obj.extend_license_code = lincenseList[i].licenseNo;
      license_obj.extend_organ = lincenseList[i].licenseGiver;
      license_obj.extend_get_date = lincenseList[i].licenseBeginDate;
      license_obj.extend_end_validity_date = lincenseList[i].licenseEndDate;
      license_obj.extend_is_display = lincenseList[i].isLicenseDisplay;
      license_obj.extend_line_comment = lincenseList[i].entryRemark;
      license_obj.Vendor_id = vendorId;
      const get_license_sub_sql = "select * from GT22176AT10.GT22176AT10.SY01_gysbgsp_xgzz_l where SY01_gysbgsp_xgzz_id =" + lincenseList[i].id;
      let get_license_sub_res = ObjectStore.queryByYonQL(get_license_sub_sql);
      for (let j = 0; j < get_license_sub_res.length; j++) {
        license_sub_obj = {};
        if (get_license_sub_res[j].range_relate_id) {
          license_sub_obj._status = "Update";
          license_sub_obj.id = get_license_sub_res[j].range_relate_id;
          fw.push(get_license_sub_res[j].range_relate_id);
        } else {
          license_sub_obj._status = "Insert";
        }
        license_sub_obj.extend_scope = get_license_sub_res[j].range;
        license_sub_obj.extend_scope_id = get_license_sub_res[j].range;
        license_sub_obj.extend_pro_auth_type = get_license_sub_res[j].extend_pro_auth_type;
        license_sub_obj.extend_pro_auth_type_name = get_license_sub_res[j].extend_pro_auth_type_name;
        license_sub_obj.extend_protype_auth_type = get_license_sub_res[j].extend_protype_auth_type;
        license_sub_obj.extend_protype_auth_type_name = get_license_sub_res[j].extend_protype_auth_type_name;
        license_sub_obj.extend_dosage_auth_type = get_license_sub_res[j].extend_dosage_auth_type;
        license_sub_obj.extend_dosage_auth_type_dosagaFormName = get_license_sub_res[j].extend_dosage_auth_type_dosagaFormName;
        get_license_sub_res_new[j] = license_sub_obj;
      }
      if (lincenseList[i].relate_id) {
        license_relate_id[lincenseList[i].relate_id] = fw;
      }
      license_obj.extend_licenseScopeList = get_license_sub_res_new;
      extend_lincenseList.push(license_obj);
    }
    for (let key in extend_lincense_id) {
      if (license_relate_id.hasOwnProperty(key)) {
        for (let i = 0; i < extend_lincenseList.length; i++) {
          if (extend_lincenseList[i].hasOwnProperty("id") && extend_lincenseList[i].id == key) {
            let arr1 = license_relate_id[key];
            let arr2 = extend_lincense_id[key];
            let arr3 = arr1.filter(function (num) {
              return arr2.indexOf(num) != -1;
            });
            let arr4 = arr2.filter(function (num) {
              return arr3.indexOf(num) == -1;
            });
            for (let j = 0; j < arr4.length; j++) {
              extend_lincenseList[i].extend_licenseScopeList.push({
                id: arr4[j],
                _status: "Delete"
              });
            }
          }
        }
      } else {
        license_obj = {};
        license_obj._status = "Delete";
        license_obj.id = key;
        extend_lincenseList.push(license_obj);
      }
    }
    //获取委托书信息
    const get_weituoshu_sql = "select * from GT22176AT10.GT22176AT10.SY01_gysbgsp_sqwts where SY01_gysbgsp_id =" + request.id;
    let authList = ObjectStore.queryByYonQL(get_weituoshu_sql);
    let scope_relate_id = {};
    for (let i = 0; i < authList.length; i++) {
      let fw = [];
      attorney_obj = {};
      get_weituoshu_sub_res_new = [];
      if (authList[i].relate_id) {
        attorney_obj._status = "Update";
        attorney_obj.id = authList[i].relate_id;
      } else {
        attorney_obj._status = "Insert";
      }
      attorney_obj.extend_auth_scope = authList[i].sqtype;
      attorney_obj.extend_salesman = authList[i].saleman;
      attorney_obj.extend_id_code = authList[i].identityno;
      attorney_obj.extend_start_date = authList[i].sqbegindate;
      attorney_obj.extend_end_date = authList[i].sqenddate;
      attorney_obj.extend_is_default = authList[i].isdefault;
      attorney_obj.extend_tel = authList[i].phone;
      attorney_obj.extend_email = authList[i].email;
      attorney_obj.extend_duties = authList[i].post;
      attorney_obj.extend_area = authList[i].sqarea;
      attorney_obj.extend_disable = authList[i].isban;
      attorney_obj.Vendor_id = vendorId;
      attorney_obj.extend_attormey_type = authList[i].client_type;
      const get_weituoshu_sub_sql = "select * from GT22176AT10.GT22176AT10.SY01_gysbg_sqwt_l where SY01_gysbgsp_sqwts_id =" + authList[i].id;
      let get_weituoshu_sub_res = ObjectStore.queryByYonQL(get_weituoshu_sub_sql);
      for (let j = 0; j < get_weituoshu_sub_res.length; j++) {
        attorney_sub_obj = {};
        if (typeof get_weituoshu_sub_res[j].range_relate_id != "undefined") {
          fw.push(get_weituoshu_sub_res[j].range_relate_id);
          attorney_sub_obj._status = "Update";
          attorney_sub_obj.id = get_weituoshu_sub_res[j].range_relate_id;
        } else {
          attorney_sub_obj._status = "Insert";
        }
        attorney_sub_obj.extend_pro_auth_type = get_weituoshu_sub_res[j].extend_pro_auth_type;
        attorney_sub_obj.extend_pro_auth_type_name = get_weituoshu_sub_res[j].extend_pro_auth_type_name;
        attorney_sub_obj.extend_protype_auth_type = get_weituoshu_sub_res[j].extend_protype_auth_type;
        attorney_sub_obj.extend_protype_auth_type_name = get_weituoshu_sub_res[j].extend_protype_auth_type_name;
        attorney_sub_obj.extend_dosage_auth_type = get_weituoshu_sub_res[j].extend_dosage_auth_type;
        attorney_sub_obj.extend_dosage_auth_type_dosagaFormName = get_weituoshu_sub_res[j].extend_dosage_auth_type_dosagaFormName;
        get_weituoshu_sub_res_new[j] = attorney_sub_obj;
      }
      if (authList[i].relate_id) {
        scope_relate_id[authList[i].relate_id] = fw;
      }
      attorney_obj.scope_authorityList = get_weituoshu_sub_res_new;
      attorney_authList[i] = attorney_obj;
    }
    for (let key in extend_scope_id) {
      if (scope_relate_id.hasOwnProperty(key)) {
        for (let i = 0; i < attorney_authList.length; i++) {
          if (attorney_authList[i].hasOwnProperty("id") && attorney_authList[i].id == key) {
            let arr1 = scope_relate_id[key];
            let arr2 = extend_scope_id[key];
            let arr3 = arr1.filter(function (num) {
              return arr2.indexOf(num) != -1;
            });
            let arr4 = arr2.filter(function (num) {
              return arr3.indexOf(num) == -1;
            });
            for (let j = 0; j < arr4.length; j++) {
              attorney_authList[i].scope_authorityList.push({
                id: arr4[j],
                _status: "Delete"
              });
            }
          }
        }
      } else {
        attorney_obj = {};
        attorney_obj._status = "Delete";
        attorney_obj.id = key;
        attorney_authList.push(attorney_obj);
      }
    }
    //获取其他资质及报告
    let get_report_sql = "select * from  GT22176AT10.GT22176AT10.sy01_vendor_change_report where SY01_supcauditv2_id =" + request.id;
    let report_res = ObjectStore.queryByYonQL(get_report_sql);
    let reportInfo = [];
    let updateIds = [];
    for (let i = 0; i < report_res.length; i++) {
      let info = {};
      if (report_res[i].related_id == undefined || report_res[i].related_id == "") {
        info._status = "Insert";
      } else {
        info.id = report_res[i].related_id;
        info._status = "Update";
        updateIds.push(report_res[i].related_id);
      }
      info.extend_report = report_res[i].report;
      info.extend_report_name = report_res[i].report_name;
      info.extend_begin_date = report_res[i].begin_date;
      info.extend_end_date = report_res[i].end_date;
      info.extend_file = report_res[i].file;
      reportInfo.push(info);
    }
    let vendor_report = response_obj.extend_othersList;
    if (vendor_report != undefined) {
      for (let i = 0; i < vendor_report.length; i++) {
        let isDelete = true;
        for (let j = 0; j < updateIds.length; j++) {
          if (vendor_report[i].id == updateIds[j]) {
            isDelete = false;
            break;
          }
        }
        if (isDelete) {
          reportInfo.push({ id: vendor_report[i].id, _status: "Delete" });
        }
      }
    }
    let data = {
      data: {
        extend_first_change_no: baseInfo[0].code,
        extend_lincenseList: extend_lincenseList,
        extend_company_in_charge: baseInfo[0].echargeperson,
        extend_qc_in_charge: baseInfo[0].qchargeperson,
        extend_qc_assurance_system: baseInfo[0].qualitysystem,
        extend_gsp_supplier_catgrory: baseInfo[0].gsp_vendor_type,
        extend_import_license: baseInfo[0].importantlicense,
        extend_first_apply_staff: baseInfo[0].applier,
        extend_first_apply_deptment: baseInfo[0].applydep,
        extend_ele_supervision_code: baseInfo[0].extend_dzjgbm,
        extend_sealandticket: baseInfo[0].sealandticket,
        extend_gmp_license: baseInfo[0].gmplicense,
        extend_gsplicense: baseInfo[0].gsplicense,
        extend_purandsaleondutycer: baseInfo[0].purandsaleondutycer,
        extend_qualityguaagreement: baseInfo[0].qualityguaagreement,
        extend_purandsalecertificates: baseInfo[0].purandsalecertificates,
        extend_orgcertificate: baseInfo[0].orgcertificate,
        extend_license: baseInfo[0].license,
        extend_durg_create_licence: baseInfo[0].phaproducerlicense,
        extend_durg_jy_license: baseInfo[0].phamanagelicense,
        extend_legalpersonpaper: baseInfo[0].legalpersonpaper,
        extend_gxht: baseInfo[0].gxht,
        extend_year: baseInfo[0].ndbg,
        attorney_authList: attorney_authList,
        org: response_obj.org,
        name: response_obj.name,
        vendorclass: response_obj.vendorclass.toString(),
        country: response_obj.country,
        internalunit: response_obj.internalunit,
        contactmobile: response_obj.contactmobile,
        isCreator: response_obj.isCreator,
        isApplied: response_obj.isApplied,
        _status: "Update",
        code: response_obj.code,
        id: response_obj.id.toString(),
        masterOrgKeyField: response_obj.masterOrgKeyField,
        vendorclass_name: response_obj.vendorclass_name,
        vendorclass_code: response_obj.vendorclass_code,
        retailInvestors: response_obj.retailInvestors,
        yhttenant: response_obj.yhttenant,
        vendorApplyRangeId: response_obj.vendorApplyRangeId.toString(),
        datasource: response_obj.datasource,
        vendorApplyRange_org_name: response_obj.vendorApplyRange_org_name,
        vendorOrgs: response_obj.vendorOrgs,
        extend_othersList: reportInfo
      }
    };
    let apiResponseVendorSave = extrequire("GT22176AT10.publicFunction.saveSupper").execute(data);
    let savaVendor = apiResponseVendorSave.merchantInfo;
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });