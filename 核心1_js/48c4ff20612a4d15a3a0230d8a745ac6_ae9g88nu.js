let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestDataObject = JSON.parse(param.requestData);
    const v_id = requestDataObject.supplier;
    //查询供应商列表api获取vendorApplyRangeId
    const param_vendor_list = { pageIndex: "1", pageSize: "10", code: requestDataObject.supplier_code };
    let vendor_list_url;
    if (window.location.href.indexOf("dbox.yyuap.com") > -1) {
      vendor_list_url = "https://www.example.com/";
    } else {
      vendor_list_url = "https://www.example.com/";
    }
    let api_res_v_list = openLinker("POST", vendor_list_url, "GZTBDM", JSON.stringify(param_vendor_list));
    let api_res_obj = JSON.parse(api_res_v_list);
    let extend_lincenseList = [];
    let license_obj = {};
    let get_license_sub_res_new = [];
    let license_sub_obj = {};
    let attorney_authList = [];
    let attorney_obj = {};
    let get_weituoshu_sub_res_new = [];
    let attorney_sub_obj = {};
    //获取证照信息
    const get_license_sql = "select * from GT22176AT10.GT22176AT10.SY01_gysbgsp_xgzz where SY01_gysbgsp_id =" + requestDataObject.id;
    let lincenseList = ObjectStore.queryByYonQL(get_license_sql);
    for (let i = 0; i < lincenseList.length; i++) {
      license_obj = {};
      get_license_sub_res_new = [];
      if (lincenseList[i].relate_id) {
        license_obj._status = "Update";
        license_obj.id = lincenseList[i].relate_id;
      } else {
        license_obj._status = "Insert";
      }
      license_obj.extend_auth_type = lincenseList[i].duth_scope_type;
      license_obj.extend_license_name = lincenseList[i].license;
      license_obj.extend_license_code = lincenseList[i].licenseNo;
      license_obj.extend_organ = lincenseList[i].licenseGiver;
      license_obj.extend_get_date = lincenseList[i].licenseBeginDate;
      license_obj.extend_end_validity_date = lincenseList[i].licenseEndDate1;
      license_obj.extend_is_display = lincenseList[i].isLicenseDisplay;
      license_obj.extend_line_comment = lincenseList[i].entryRemark;
      license_obj.Vendor_id = v_id;
      const get_license_sub_sql = "select * from GT22176AT10.GT22176AT10.SY01_gysbgsp_xgzz_l where SY01_gysbgsp_xgzz_id =" + lincenseList[i].id;
      let get_license_sub_res = ObjectStore.queryByYonQL(get_license_sub_sql);
      for (let j = 0; j < get_license_sub_res.length; j++) {
        license_sub_obj = {};
        if (get_license_sub_res[j].relate_id) {
          license_sub_obj._status = "Update";
          license_sub_obj.id = get_license_sub_res[j].relate_id;
        } else {
          license_sub_obj._status = "Insert";
        }
        license_sub_obj._status = "Update";
        license_sub_obj.entend_icense_scope = get_license_sub_res[j].range;
        get_license_sub_res_new[j] = license_sub_obj;
      }
      license_obj.license_scopeList = get_license_sub_res_new;
      extend_lincenseList[i] = license_obj;
    }
    //获取委托书信息
    const get_weituoshu_sql = "select * from 	GT22176AT10.GT22176AT10.SY01_poavv4 where SY01_fccompauditv4_id =" + requestDataObject.id;
    let authList = ObjectStore.queryByYonQL(get_weituoshu_sql);
    for (let i = 0; i < authList.length; i++) {
      attorney_obj = {};
      get_weituoshu_sub_res_new = [];
      if (authList[i].relate_id) {
        attorney_obj._status = "Update";
        attorney_obj.id = authList[i].relate_id;
      } else {
        attorney_obj._status = "Insert";
      }
      attorney_obj._status = "Update";
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
      attorney_obj.Vendor_id = v_id;
      attorney_obj.extend_attormey_type = authList[i].client_type;
      const get_weituoshu_sub_sql = "select * from GT22176AT10.GT22176AT10.SY01_poalv5 where SY01_poavv4_id =" + authList[i].id;
      let get_weituoshu_sub_res = ObjectStore.queryByYonQL(get_weituoshu_sub_sql);
      for (let j = 0; j < get_weituoshu_sub_res.length; j++) {
        attorney_sub_obj = {};
        if (get_weituoshu_sub_res[j].relate_id) {
          attorney_sub_obj._status = "Update";
          attorney_sub_obj.id = get_weituoshu_sub_res[j].relate_id;
        } else {
          attorney_sub_obj._status = "Insert";
        }
        attorney_sub_obj.extend_attorrmey_scope = get_weituoshu_sub_res[j].poarange;
        get_weituoshu_sub_res_new[j] = attorney_sub_obj;
      }
      attorney_obj.attorrmey_scopeList = get_weituoshu_sub_res_new;
      attorney_authList[i] = attorney_obj;
    }
    const range_id = api_res_obj.data.recordList[0].vendorApplyRangeId;
    let url;
    if (window.location.href.indexOf("dbox.yyuap.com") > -1) {
      url = "https://www.example.com/" + v_id + "&vendorApplyRangeId=" + range_id;
    } else {
      url = "https://www.example.com/" + v_id + "&vendorApplyRangeId=" + range_id;
    }
    let body = {}; //请求参数
    let apiResponse = openLinker("GET", url, "GZTBDM", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    let response_obj = JSON.parse(apiResponse);
    for (let i = 0; i < response_obj.data.vendorOrgs.length; i++) {
      response_obj.data.vendorOrgs[i]._status = "Update";
    }
    let data = {
      data: {
        extend_first_status: "1",
        extend_first_no: requestDataObject.code,
        extend_first_date: requestDataObject.applydate,
        extend_lincenseList: extend_lincenseList,
        extend_first_apply_deptment: requestDataObject.applydep_name,
        extend_first_apply_staff: requestDataObject.applier_name,
        extend_company_in_charge: requestDataObject.echargeperson,
        extend_qc_in_charge: requestDataObject.qchargeperson,
        extend_ele_supervision_code: requestDataObject.extend_dzjgbm,
        extend_qc_assurance_system: requestDataObject.qualitysystem,
        extend_gsp_supplier_catgrory: requestDataObject.enterprisetype,
        extend_import_license: requestDataObject.importantlicense,
        extend_durg_create_licence: requestDataObject.phaproducerlicense,
        extend_durg_jy_license: requestDataObject.phamanagelicense,
        extend_sealandticket: requestDataObject.sealandticket,
        extend_gmp_license: requestDataObject.gmplicense,
        extend_purandsalecertificates: requestDataObject.purandsalecertificates,
        extend_gsplicense: requestDataObject.gsplicense,
        extend_orgcertificate: requestDataObject.orgcertificate,
        extend_purandsaleondutycer: requestDataObject.purandsaleondutycer,
        extend_license: requestDataObject.license,
        extend_legalpersonpaper: requestDataObject.legalpersonpaper,
        attorney_authList: attorney_authList,
        org: response_obj.data.org,
        name: response_obj.data.name,
        vendorclass: response_obj.data.vendorclass.toString(),
        country: response_obj.data.country,
        internalunit: response_obj.data.internalunit,
        contactmobile: response_obj.data.contactmobile,
        isCreator: response_obj.data.isCreator,
        isApplied: response_obj.data.isApplied,
        _status: "Update",
        code: response_obj.data.code,
        id: response_obj.data.id.toString(),
        masterOrgKeyField: response_obj.data.masterOrgKeyField,
        vendorclass_name: response_obj.data.vendorclass_name,
        vendorclass_code: response_obj.data.vendorclass_code,
        retailInvestors: response_obj.data.retailInvestors,
        yhttenant: response_obj.data.yhttenant,
        vendorApplyRangeId: response_obj.data.vendorApplyRangeId.toString(),
        datasource: response_obj.data.datasource,
        vendorApplyRange_org_name: response_obj.data.vendorApplyRange_org_name,
        vendorOrgs: response_obj.data.vendorOrgs
      }
    };
    let save_url;
    if (window.location.href.indexOf("dbox.yyuap.com") > -1) {
      save_url = "https://www.example.com/";
    } else {
      save_url = "https://www.example.com/";
    }
    let apiResponse1 = openLinker("POST", save_url, "GZTBDM", JSON.stringify(data, toString())); //TODO：注意填写应用编码(请看注意事项)
    return {};
  }
}
exports({ entryPoint: MyTrigger });