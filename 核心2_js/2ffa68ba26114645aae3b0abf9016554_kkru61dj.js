let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let update = function (billInfo) {
      let vendorId = billInfo.supplier;
      let vendorList = { vendorId };
      let apiResponse = extrequire("GT22176AT10.publicFunction.getVenderDetail").execute(vendorList);
      let response_obj = apiResponse;
      for (let i = 0; i < response_obj.merchantInfo.vendorOrgs.length; i++) {
        response_obj.merchantInfo.vendorOrgs[i]._status = "Update";
      }
      let data = {
        data: {
          extend_is_gsp: true,
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
          sy01_gsp_infosList: [
            {
              _status: "Insert",
              org: billInfo.org_id,
              org_name: billInfo.org_id_name,
              isGSP: "1",
              isFIrstMarketing: "1"
            }
          ]
        }
      };
      let url_preFix = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
      let save_url = url_preFix.apiPrefix + "/yonbip/digitalModel/vendor/save";
      let apiResponse1 = openLinker("POST", save_url, "GT22176AT10", JSON.stringify(data, toString())); //TODO：注意填写应用编码(请看注意事项)
    };
    let getSwitchValue = function (value) {
      if (value == undefined || value == null || value == 0 || value == "0" || value == false || value == "false") {
        return "0";
      } else {
        return "1";
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
    if (extend_lincenseList != undefined && extend_lincenseList != null) {
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
        lincenseInfo.validUntil = extend_lincenseList[i].licenseEndDate1;
        //显示用证照
        //行备注
        lincenseInfo.remarks = extend_lincenseList[i].entryRemark;
        lincenseInfo.supplierCode = extend_lincenseList[i].supplier_code;
        lincenseInfo.supplierName = extend_lincenseList[i].supplier_name;
        lincenseInfo.enclosure = extend_lincenseList[i].file;
        let get_license_sub_res = extend_lincenseList[i][sy_zz_fw];
        let customerLicenseRangeList = [];
        if (get_license_sub_res != undefined && get_license_sub_res != null) {
          for (let j = 0; j < get_license_sub_res.length; j++) {
            let licenseRangeInfo = {};
            licenseRangeInfo.material = get_license_sub_res[j].extend_pro_auth_type;
            licenseRangeInfo.materialCode = get_license_sub_res[j].materialCode;
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
        }
        lincenseInfo[lic_zz_fw] = customerLicenseRangeList;
        customerLicenseList.push(lincenseInfo);
      }
    }
    let authList = [];
    //获取授权表格
    let authInfos = billInfo[sy_sq];
    if (authInfos != undefined && authInfos != null) {
      for (let i = 0; i < authInfos.length; i++) {
        let authInfo = {};
        //人员
        authInfo.salesman = authInfos[i].saleman;
        authInfo.salesmanName = authInfos[i].salemanName;
        //授权类型
        authInfo.authType = authInfos[i].sqtype;
        //委托人类型
        authInfo.clientType = authInfos[i].client_type;
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
        authInfo.file = authInfos[i].file;
        authInfo.isDefault = getSwitchValue(authInfos[i].isdefault);
        //联系电话
        let get_auth_sub_res = authInfos[i][sy_sq_fw];
        let authRangeList = [];
        if (get_auth_sub_res != undefined && get_auth_sub_res != null) {
          for (let j = 0; j < get_auth_sub_res.length; j++) {
            let authRangeInfo = {};
            authRangeInfo._status = "Insert";
            authRangeInfo.material = get_auth_sub_res[j].extend_pro_auth_type;
            authRangeInfo.materalName = get_auth_sub_res[j].materialName;
            authRangeInfo.materialCode = get_auth_sub_res[j].materialCode;
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
        }
        authInfo[lic_sq_fw] = authRangeList;
        authList.push(authInfo);
      }
    }
    let reportInfo = [];
    let sy_report = billInfo[sy_rep];
    if (sy_report != undefined && sy_report != null) {
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
      supplierCode: billInfo.supplier_code,
      supplierName: billInfo.supplierName,
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
      //经营范围
      businessScope: billInfo.businessnature,
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
    update(billInfo);
    return {};
  }
}
exports({ entryPoint: MyTrigger });