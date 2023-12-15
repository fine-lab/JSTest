let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let edtion = "new";
    if (edtion == "new") {
      let getSwitchValue = function (value) {
        if (value == undefined || value == null || value == 0 || value == "0" || value == false || value == "false") {
          return 0;
        } else {
          return 1;
        }
      };
      let lic_zz = "SY01_supplier_file_licenseList";
      let lic_zz_fw = "SY01_supplier_file_license_authList";
      let lic_sq = "SY01_supplier_file_certifyList";
      let lic_sq_fw = "SY01_supplier_file_certify_authList";
      let lic_rep = "sy01_supplier_file_other_repList";
      let sy_zz = "SY01_syqysp_xgzzv4List";
      let sy_zz_fw = "SY01_syqysp_xgzz_v4List";
      let sy_sq = "SY01_poavv4List";
      let sy_sq_fw = "SY01_poalv5List";
      let sy_rep = "sy01_vendor_other_reportList";
      var billObj = {
        id: param.data[0].id,
        compositions: [
          {
            name: sy_zz,
            compositions: [
              {
                name: sy_zz_fw
              }
            ]
          },
          {
            name: sy_sq,
            compositions: [
              {
                name: sy_sq_fw
              }
            ]
          },
          {
            name: sy_rep
          }
        ]
      };
      //实体查询
      var billInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_fccompauditv4", billObj);
      let customerLicenseList = [];
      //获取证照信息
      let extend_lincenseList = billInfo[sy_zz];
      if (extend_lincenseList) {
        for (let i = 0; i < extend_lincenseList.length; i++) {
          let lincenseInfo = {};
          //证照id
          lincenseInfo.license = extend_lincenseList[i].license;
          //证照编码
          lincenseInfo.lincenseNumber = extend_lincenseList[i].licenseNo;
          //证照名称
          lincenseInfo.licenseName = extend_lincenseList[i].license_name;
          //授权类型
          lincenseInfo.authType = extend_lincenseList[i].license_auth_type;
          //发证机关
          lincenseInfo.issuingAuthority = extend_lincenseList[i].licenseGiver;
          //发证日期
          lincenseInfo.issueDate = extend_lincenseList[i].licenseBeginDate;
          //有效期至
          lincenseInfo.validUntil = extend_lincenseList[i].licenseEndDate;
          //显示用证照
          //行备注
          lincenseInfo.remarks = extend_lincenseList[i].entryRemark;
          lincenseInfo.supplierCode = extend_lincenseList[i].supplier_code;
          lincenseInfo.supplierName = extend_lincenseList[i].supplier_name;
          let get_license_sub_res = extend_lincenseList[i][sy_zz_fw];
          let customerLicenseRangeList = [];
          if (typeof get_license_sub_res != "undefined") {
            for (let j = 0; j < get_license_sub_res.length; j++) {
              let licenseRangeInfo = {};
              licenseRangeInfo.material = get_license_sub_res[j].extend_pro_auth_type;
              licenseRangeInfo.materialName = get_license_sub_res[j].materialName;
              licenseRangeInfo.sku = get_license_sub_res[j].sku;
              licenseRangeInfo.skuCode = get_license_sub_res[j].skuCode;
              licenseRangeInfo.skuName = get_license_sub_res[j].skuName;
              licenseRangeInfo.materialType = get_license_sub_res[j].extend_protype_auth_type;
              licenseRangeInfo.materialTypeName = get_license_sub_res[j].materialTypeName;
              licenseRangeInfo.dosageForm = get_license_sub_res[j].extend_dosage_auth_type;
              licenseRangeInfo.dosageName = get_license_sub_res[j].dosageName;
              customerLicenseRangeList.push(licenseRangeInfo);
            }
            lincenseInfo[lic_zz_fw] = customerLicenseRangeList;
            customerLicenseList.push(lincenseInfo);
          }
        }
      }
      let authList = [];
      //获取授权表格
      let authInfos = billInfo[sy_sq];
      if (typeof authInfos != "undefined") {
        for (let i = 0; i < authInfos.length; i++) {
          let authInfo = {};
          //人员
          authInfo.salesman = authInfos[i].saleman;
          authInfo.salesmanName = authInfos[i].salemanName;
          //授权类型
          authInfo.authType = authInfos[i].sqtype;
          //委托人类型
          authInfo.clientType = authInfos[i].wtrlx;
          //授权开始日期
          authInfo.startDate = authInfos[i].sqbegindate;
          //授权结束日期
          authInfo.endDate = authInfos[i].sqenddate;
          //是否默认
          //职务
          authInfo.post = authInfos[i].post;
          //授权地域
          //是否禁用
          //身份证号
          authInfo.idCard = authInfos[i].identityno;
          authInfo.supplierCode = authInfos[i].supplier_code;
          authInfo.supplierName = authInfos[i].supplier_name;
          //联系电话
          let get_auth_sub_res = authInfos[i][sy_sq_fw];
          let authRangeList = [];
          if (typeof get_auth_sub_res != "undefined") {
            for (let j = 0; j < get_auth_sub_res.length; j++) {
              let authRangeInfo = {};
              authRangeInfo._status = "Insert";
              authRangeInfo.material = get_auth_sub_res[j].extend_pro_auth_type;
              authRangeInfo.materalName = get_auth_sub_res[j].materialName;
              authRangeInfo.sku = get_auth_sub_res[j].sku;
              authRangeInfo.skuCode = get_auth_sub_res[j].skuCode;
              authRangeInfo.skuName = get_auth_sub_res[j].skuName;
              authRangeInfo.materialType = get_auth_sub_res[j].extend_protype_auth_type;
              authRangeInfo.materialTypeName = get_auth_sub_res[j].materialTypeName;
              authRangeInfo.dosageForm = get_auth_sub_res[j].extend_dosage_auth_type;
              authRangeInfo.dosageName = get_auth_sub_res[j].dosageName;
              authRangeInfo.supplierCode = get_auth_sub_res[j].supplier_code;
              authRangeInfo.supplierName = get_auth_sub_res[j].supplier_name;
              authRangeList.push(authRangeInfo);
            }
            authInfo[lic_sq_fw] = authRangeList;
            authList.push(authInfo);
          }
        }
      }
      let reportInfo = [];
      let sy_report = billInfo[sy_rep];
      if (sy_report != undefined) {
        for (let i = 0; i < sy_report.length; i++) {
          let info = {};
          info.report = sy_report[i].report;
          info.reportName = sy_report[i].reportName;
          info.beginDate = sy_report[i].begin_date;
          info.endDate = sy_report[i].end_date;
          info.file = sy_report[i].file;
          reportInfo.push(info);
        }
      }
      let updateJson = {
        org_id: billInfo.org_id,
        supplier: billInfo.supplier,
        supplierType: billInfo.gsp_vendor_type,
        supplierTypeName: billInfo.supplierTypeName,
        firstBusinessOrderNo: billInfo.code,
        //首营日期
        firstSaleDate: billInfo.applydate,
        //首营状态
        firstBattalionStatus: "2",
        //经营范围
        //质量保证体系
        qualityAssuranceSystem: billInfo.qualitysystem,
        //电子监管编码
        electronicSupervisionCode: billInfo.extend_dzjgbm,
        //重要证照
        importantLicense: billInfo.importantlicense,
        //印章及随货同行票样
        specimenOfSeal: getSwitchValue(billInfo.sealandticket),
        gmpCertificate: getSwitchValue(billInfo.gmplicense),
        gspCertificate: getSwitchValue(billInfo.gsplicense),
        //购销员上岗证
        purchAndSalesStaff: getSwitchValue(billInfo.purandsaleondutycer),
        //质量保证协议
        qualityAssurAgreement: getSwitchValue(billInfo.qualityguaagreement),
        //购销人员证件
        certifyPurchSalesPerson: getSwitchValue(billInfo.purandsalecertificates),
        //组织机构代码证
        orgCodeCertify: getSwitchValue(billInfo.orgcertificate),
        //营业执照
        businessLicense: getSwitchValue(billInfo.license),
        //药品生产企业许可证
        produceEnterpriseLicense: getSwitchValue(billInfo.phaproducerlicense),
        //药品经营企业许可证
        handlingEnterpriseLicense: getSwitchValue(billInfo.phamanagelicense),
        //法人委托书
        powerAttorney: getSwitchValue(billInfo.legalpersonpaper),
        //购销合同
        purchSaleContract: getSwitchValue(billInfo.gxht),
        //年度报告
        annualReport: getSwitchValue(billInfo.ndbg),
        //供应商采购状态
        purState: billInfo.extend_purchase_status
      };
      updateJson[lic_zz] = customerLicenseList;
      updateJson[lic_sq] = authList;
      updateJson[lic_rep] = reportInfo;
      var res = ObjectStore.insert("GT22176AT10.GT22176AT10.SY01_supplier_file", updateJson, "8a842e1f");
      return {};
    } else {
      let requestDataObject = JSON.parse(param.requestData);
      //获取首营企业审批单信息
      const get_supper_sql = "select * from GT22176AT10.GT22176AT10.SY01_fccompauditv4 where id =" + requestDataObject[0].id;
      let baseInfo = ObjectStore.queryByYonQL(get_supper_sql);
      const v_id = baseInfo[0].supplier;
      let extend_lincenseList = [];
      let license_obj = {};
      let get_license_sub_res_new = [];
      let license_sub_obj = {};
      let attorney_authList = [];
      let attorney_obj = {};
      let get_weituoshu_sub_res_new = [];
      let attorney_sub_obj = {};
      //获取证照信息
      const get_license_sql = "select * from GT22176AT10.GT22176AT10.SY01_syqysp_xgzzv4 where SY01_fccompauditv3_id =" + requestDataObject[0].id;
      let lincenseList = ObjectStore.queryByYonQL(get_license_sql);
      for (let i = 0; i < lincenseList.length; i++) {
        license_obj = {};
        get_license_sub_res_new = [];
        license_obj._status = "Insert";
        license_obj.extend_auth_type_v2 = lincenseList[i].license_auth_type;
        license_obj.extend_license_name = lincenseList[i].license;
        license_obj.extend_license_code = lincenseList[i].licenseNo;
        license_obj.extend_organ = lincenseList[i].licenseGiver;
        license_obj.extend_get_date = lincenseList[i].licenseBeginDate;
        license_obj.extend_end_validity_date = lincenseList[i].licenseEndDate1;
        license_obj.extend_is_display = lincenseList[i].isLicenseDisplay;
        license_obj.extend_line_comment = lincenseList[i].entryRemark;
        license_obj.Vendor_id = v_id;
        const get_license_sub_sql = "select * from GT22176AT10.GT22176AT10.SY01_syqysp_xgzz_v4 where SY01_syqysp_xgzzv3_id =" + lincenseList[i].id;
        let get_license_sub_res = ObjectStore.queryByYonQL(get_license_sub_sql);
        for (let j = 0; j < get_license_sub_res.length; j++) {
          license_sub_obj = {};
          license_sub_obj._status = "Insert";
          //多选参照的现在废弃
          license_sub_obj.extend_scope_id = get_license_sub_res[j].scope;
          license_sub_obj.extend_scope = get_license_sub_res[j].scope;
          //现在用的三个参照
          license_sub_obj.extend_pro_auth_type = get_license_sub_res[j].extend_pro_auth_type;
          license_sub_obj.extend_protype_auth_type = get_license_sub_res[j].extend_protype_auth_type;
          license_sub_obj.extend_dosage_auth_type = get_license_sub_res[j].extend_dosage_auth_type;
          get_license_sub_res_new[j] = license_sub_obj;
        }
        license_obj.extend_licenseScopeList = get_license_sub_res_new;
        extend_lincenseList[i] = license_obj;
      }
      //获取委托书信息
      const get_weituoshu_sql = "select * from 	GT22176AT10.GT22176AT10.SY01_poavv4 where SY01_fccompauditv4_id =" + requestDataObject[0].id;
      let authList = ObjectStore.queryByYonQL(get_weituoshu_sql);
      for (let i = 0; i < authList.length; i++) {
        attorney_obj = {};
        get_weituoshu_sub_res_new = [];
        attorney_obj._status = "Insert";
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
          attorney_sub_obj._status = "Insert";
          //多选参照的现在废弃
          attorney_sub_obj.extend_attorrmey_scope = get_weituoshu_sub_res[j].poarange;
          //现在用的三个参照
          attorney_sub_obj.extend_pro_auth_type = get_weituoshu_sub_res[j].extend_pro_auth_type;
          attorney_sub_obj.extend_protype_auth_type = get_weituoshu_sub_res[j].extend_protype_auth_type;
          attorney_sub_obj.extend_dosage_auth_type = get_weituoshu_sub_res[j].extend_dosage_auth_type;
          get_weituoshu_sub_res_new[j] = attorney_sub_obj;
        }
        attorney_obj.scope_authorityList = get_weituoshu_sub_res_new;
        attorney_authList[i] = attorney_obj;
      }
      //获取其他资质及报告
      let get_report_sql = "select *  from  GT22176AT10.GT22176AT10.sy01_vendor_other_report  where SY01_fccompauditv4_id =" + requestDataObject[0].id;
      let report_res = ObjectStore.queryByYonQL(get_report_sql);
      let reportInfo = [];
      for (let i = 0; i < report_res.length; i++) {
        let info = {};
        info._status = "Insert";
        info.extend_report = report_res[i].report;
        info.extend_report_name = report_res[i].report_name;
        info.extend_begin_date = report_res[i].begin_date;
        info.extend_end_date = report_res[i].end_date;
        info.extend_file = report_res[i].file;
        reportInfo.push(info);
      }
      let vendorId = v_id;
      let vendorList = { vendorId };
      let apiResponse = extrequire("GT22176AT10.publicFunction.getVenderDetail").execute(vendorList);
      let response_obj = apiResponse;
      for (let i = 0; i < response_obj.merchantInfo.vendorOrgs.length; i++) {
        response_obj.merchantInfo.vendorOrgs[i]._status = "Update";
      }
      let data = {
        data: {
          extend_is_gsp: true,
          extend_first_status: "2",
          extend_first_no: baseInfo[0].code,
          extend_first_date: baseInfo[0].applydate,
          extend_lincenseList: extend_lincenseList,
          extend_first_apply_deptment: baseInfo[0].applydep,
          extend_first_apply_staff: baseInfo[0].applier,
          extend_company_in_charge: baseInfo[0].echargeperson,
          extend_qc_in_charge: baseInfo[0].qchargeperson,
          extend_ele_supervision_code: baseInfo[0].extend_dzjgbm,
          extend_qc_assurance_system: baseInfo[0].qualitysystem,
          extend_import_license: baseInfo[0].importantlicense,
          extend_gsp_supplier_catgrory: baseInfo[0].gsp_vendor_type,
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
          org: response_obj.merchantInfo.org,
          name: response_obj.merchantInfo.name,
          vendorclass: response_obj.merchantInfo.vendorclass.toString(),
          country: response_obj.merchantInfo.country,
          internalunit: response_obj.merchantInfo.internalunit,
          contactmobile: response_obj.merchantInfo.contactmobile,
          isCreator: response_obj.merchantInfo.isCreator,
          isApplied: response_obj.merchantInfo.isApplied,
          _status: "Update",
          code: response_obj.merchantInfo.code,
          id: response_obj.merchantInfo.id.toString(),
          masterOrgKeyField: response_obj.merchantInfo.masterOrgKeyField,
          vendorclass_name: response_obj.merchantInfo.vendorclass_name,
          vendorclass_code: response_obj.merchantInfo.vendorclass_code,
          retailInvestors: response_obj.merchantInfo.retailInvestors,
          yhttenant: response_obj.merchantInfo.yhttenant,
          vendorApplyRangeId: response_obj.merchantInfo.vendorApplyRangeId.toString(),
          datasource: response_obj.merchantInfo.datasource,
          vendorApplyRange_org_name: response_obj.merchantInfo.vendorApplyRange_org_name,
          vendorOrgs: response_obj.merchantInfo.vendorOrgs,
          extend_othersList: reportInfo
        }
      };
      let url_preFix = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
      let save_url = url_preFix.apiPrefix + "/yonbip/digitalModel/vendor/save";
      let apiResponse1 = openLinker("POST", save_url, "GT22176AT10", JSON.stringify(data, toString())); //TODO：注意填写应用编码(请看注意事项)
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });