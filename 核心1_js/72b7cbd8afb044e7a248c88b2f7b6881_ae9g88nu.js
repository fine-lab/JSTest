let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestDataObject = JSON.parse(param.requestData);
    //获取首营企业审批单信息
    const get_supper_sql = "select * from GT22176AT10.GT22176AT10.SY01_fccompauditv4 where id =" + requestDataObject[0].id;
    let baseInfo = ObjectStore.queryByYonQL(get_supper_sql);
    //查询组织形态
    let orgSql = "select name from bd.customerdoc_orgform.orgform where id = '" + baseInfo.org_id + "'";
    let orgInfo = ObjectStore.queryByYonQL(orgSql, "ucfbasedoc");
    //查询供应商档案
    let supplierSql = "select name from aa.vendor.Vendor where id = '" + baseInfo[0].supplier + "'";
    let supplierInfo = ObjectStore.queryByYonQL(supplierSql, "yssupplier");
    //查询GSP供应商分类
    let supplierTypeObject = { id: baseInfo[0].gsp_vendor_type };
    let supplierTypeRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_supplierflv10", supplierTypeObject);
    let num = "";
    for (let i = 0; i < 6; i++) {
      let radom = Math.floor(Math.random() * 10);
      num += radom;
    }
    let supplierCode = "YYGYS" + num;
    let data = {
      //组织
      org_id: baseInfo[0].org_id,
      org_id_name: orgInfo.name,
      //编码
      code: supplierCode,
      //医药供应商分类
      supplierType: baseInfo[0].gsp_vendor_type,
      supplierType_catagoryName: supplierTypeRes.catagoryName,
      //供应商
      supplier: baseInfo[0].supplier,
      supplier_name: supplierInfo.name,
      //首营日期
      firstSaleDate: getDate(baseInfo[0].applydate),
      //首营状态
      firstBattalionStatus: "2",
      //首营单号
      firstBusinessOrderNo: baseInfo[0].code,
      //经营范围
      //质量保证体系
      qualityAssuranceSystem: baseInfo[0].qualitysystem,
      //电子监管编码
      electronicSupervisionCode: baseInfo[0].extend_dzjgbm,
      //重要证照
      importantLicense: baseInfo[0].importantlicense,
      //印章及随货同行票样
      specimenOfSeal: enumeration(baseInfo[0].sealandticket),
      gmpCertificate: enumeration(baseInfo[0].gmplicense),
      gspCertificate: enumeration(baseInfo[0].gsplicense),
      //购销员上岗证
      purchAndSalesStaff: enumeration(baseInfo[0].purandsaleondutycer),
      //质量保证协议
      qualityAssurAgreement: enumeration(baseInfo[0].qualityguaagreement),
      //购销人员证件
      certifyPurchSalesPerson: enumeration(baseInfo[0].purandsalecertificates),
      //组织机构代码证
      orgCodeCertify: enumeration(baseInfo[0].orgcertificate),
      //营业执照
      businessLicense: enumeration(baseInfo[0].license),
      //药品生产企业许可证
      produceEnterpriseLicense: enumeration(baseInfo[0].phaproducerlicense),
      //药品经营企业许可证
      handlingEnterpriseLicense: enumeration(baseInfo[0].phamanagelicense),
      //法人委托书
      powerAttorney: enumeration(baseInfo[0].legalpersonpaper),
      //购销合同
      purchSaleContract: enumeration(baseInfo[0].gxht),
      //年度报告
      annualReport: enumeration(baseInfo[0].ndbg),
      //供应商采购状态
      purState: baseInfo[0].extend_purchase_status
    };
    let supplierRes = ObjectStore.insert("GT22176AT10.GT22176AT10.SY01_supplier_file", data, "SY01_supplier_file");
    //获取证照信息
    const get_license_sql = "select * from GT22176AT10.GT22176AT10.SY01_syqysp_xgzzv4 where SY01_fccompauditv3_id =" + requestDataObject[0].id;
    let lincenseList = ObjectStore.queryByYonQL(get_license_sql);
    for (let i = 0; i < lincenseList.length; i++) {
      let license_obj = {
        //证照
        license: lincenseList[i].license,
        license: lincenseList[i].license_licenseName,
        //证照授权类型
        authType: lincenseList[i].license_auth_type,
        //颁发机构
        issuingAuthority: lincenseList[i].licenseGiver,
        //颁发日期
        issueDate: getDate(lincenseList[i].licenseBeginDate),
        //有效期至
        validUntil: getDate(lincenseList[i].licenseEndDate1),
        //备注
        remarks: lincenseList[i].entryRemark,
        //附件
        //供应商编码
        supplierCode: lincenseList[i].supplier_code,
        //供应商名称
        supplierName: lincenseList[i].supplier_name,
        //外键
        SY01_supplier_file_licenseFk: supplierRes.id
      };
      let supplierLicenseRes = ObjectStore.insert("GT22176AT10.GT22176AT10.SY01_supplier_file_license", license_obj, "SY01_supplier_file_license");
      const get_license_sub_sql = "select * from GT22176AT10.GT22176AT10.SY01_syqysp_xgzz_v4 where SY01_syqysp_xgzzv3_id =" + lincenseList[i].id;
      let get_license_sub_res = ObjectStore.queryByYonQL(get_license_sub_sql);
      for (let j = 0; j < get_license_sub_res.length; j++) {
        let license_sub_obj = {
          //查询物料档案
          material: get_license_sub_res[j].extend_pro_auth_type,
          materialType: get_license_sub_res[j].extend_protype_auth_type,
          dosageForm: get_license_sub_res[j].extend_dosage_auth_type,
          //上市许可持有人
          //供应商编码
          supplierCode: supplierLicenseRes.supplierCode,
          //供应商名称
          supplierName: supplierLicenseRes.supplierName,
          //证照名称
          //外键
          SY01_supplier_file_license_authFk: supplierLicenseRes.id
        };
        let supplierLicenseSunRes = ObjectStore.insert("GT22176AT10.GT22176AT10.SY01_supplier_file_license_auth", license_sub_obj, "SY01_supplier_file_license_auth");
      }
    }
    //获取委托书信息
    const get_weituoshu_sql = "select * from GT22176AT10.GT22176AT10.SY01_poavv4 where SY01_fccompauditv4_id =" + requestDataObject[0].id;
    let authList = ObjectStore.queryByYonQL(get_weituoshu_sql);
    let attorney_obj = {};
    let attorney_sub_obj = {};
    for (let i = 0; i < authList.length; i++) {
      attorney_obj = {
        //业务员
        salesman: authList[i].saleman,
        salesman_businesserName: authList[i].saleman_businesserName,
        //授权类型
        authType: authList[i].sqtype,
        //委托人类型
        clientType: authList[i].client_type,
        //授权开始日期
        startDate: getDate(authList[i].sqbegindate),
        //授权结束日期
        endDate: getDate(authList[i].sqenddate),
        //身份证
        idCard: authList[i].identityno,
        //职务
        post: authList[i].post,
        //供应商编码
        supplierCode: authList[i].supplier_code,
        //供应商名称
        supplierName: authList[i].supplier_name,
        //外键
        SY01_supplier_file_certifyFk: supplierRes.id
      };
      let supplierAttorneyRes = ObjectStore.insert("GT22176AT10.GT22176AT10.SY01_supplier_file_certify", attorney_obj, "SY01_supplier_file_certify");
      const get_weituoshu_sub_sql = "select * from GT22176AT10.GT22176AT10.SY01_poalv5 where SY01_poavv4_id =" + authList[i].id;
      let get_weituoshu_sub_res = ObjectStore.queryByYonQL(get_weituoshu_sub_sql);
      for (let j = 0; j < get_weituoshu_sub_res.length; j++) {
        attorney_sub_obj = {
          material: get_weituoshu_sub_res[j].extend_pro_auth_type,
          materialType: get_weituoshu_sub_res[j].extend_protype_auth_type,
          dosageForm: get_weituoshu_sub_res[j].extend_dosage_auth_type,
          //供应商编码
          supplierCode: supplierAttorneyRes.supplierCode,
          //供应商名称
          supplierName: supplierAttorneyRes.supplierName,
          //业务员名称
          salesmanName: supplierAttorneyRes.saleman_businesserName,
          //业务员名称
          SY01_supplier_file_certify_authFk: supplierAttorneyRes.id
        };
        let supplierAttorneySunRes = ObjectStore.insert("GT22176AT10.GT22176AT10.SY01_supplier_file_certify_auth", attorney_sub_obj, "SY01_supplier_file_certify_auth");
      }
    }
    //获取其他资质及报告
    let get_report_sql = "select *  from  GT22176AT10.GT22176AT10.sy01_vendor_other_report  where SY01_fccompauditv4_id =" + requestDataObject[0].id;
    let report_res = ObjectStore.queryByYonQL(get_report_sql);
    for (let i = 0; i < report_res.length; i++) {
      let info = {
        report: report_res[i].report,
        report_name: report_res[i].report_name,
        beginDate: getDate(report_res[i].begin_date),
        endDate: getDate(report_res[i].end_date),
        file: report_res[i].file,
        SY01_supplier_file_id: supplierRes.id
      };
      let supplierAttorneySunRes = ObjectStore.insert("GT22176AT10.GT22176AT10.sy01_supplier_file_other_rep", info, "sy01_supplier_file_other_rep");
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
    return {};
  }
}
exports({ entryPoint: MyTrigger });