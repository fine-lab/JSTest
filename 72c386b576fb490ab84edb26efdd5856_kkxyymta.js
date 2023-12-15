let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let yonql = "select id from GT22176AT10.GT22176AT10.SY01_supplier_file where org_id='" + request.orgId + "' and supplier = '" + request.supplierId + "'";
    let res = ObjectStore.queryByYonQL(yonql, "sy01");
    let supLicInfo = {};
    if (res.length == 0) {
      return { supLicInfo: null };
    }
    let id = res[0].id;
    //主表字段
    let infoFieldsArray = [];
    //证照子表字段
    let zzFieldsArray = [];
    //证照-范围 字段
    let zz_fw_FieldsArray = [];
    //授权委托书字段 数组
    let sqwtrFieldsArray = [];
    //授权委托 范围  数组
    let sqwtr_fwFieldsArray = [];
    //其他报告  数组
    let qtzzybgFieldsArray = [];
    //主表字段
    infoFieldsArray.push("id"); //id
    infoFieldsArray.push("supplierType"); //供应商分类
    infoFieldsArray.push("supplierType.catagoryName supplierTypeName"); //供应商分类名称
    infoFieldsArray.push("supplier"); //供应商
    infoFieldsArray.push("supplier.code supplierCode"); //
    infoFieldsArray.push("supplier.name supplierName"); //
    infoFieldsArray.push("electronicSupervisionCode"); //电子监管码
    infoFieldsArray.push("qualityAssuranceSystem"); //质量保证体系
    infoFieldsArray.push("importantLicense"); //重要证照
    infoFieldsArray.push("purState"); //供应商采购状态
    infoFieldsArray.push("businessScope"); //经营范围
    infoFieldsArray.push("gmpCertificate"); //GMP认证证书
    infoFieldsArray.push("gspCertificate"); //GSP认证证书
    infoFieldsArray.push("specimenOfSeal"); //印章及随货同行票样
    infoFieldsArray.push("purchAndSalesStaff"); //购销人员上岗证
    infoFieldsArray.push("qualityAssurAgreement"); //质量保证协议
    infoFieldsArray.push("certifyPurchSalesPerson"); //购销人员证件
    infoFieldsArray.push("orgCodeCertify"); //组织机构代码证
    infoFieldsArray.push("businessLicense"); //营业执照
    infoFieldsArray.push("produceEnterpriseLicense"); //药品生产企业许可证
    infoFieldsArray.push("handlingEnterpriseLicense"); //药品经营企业许可证
    infoFieldsArray.push("powerAttorney"); //法人委托书
    infoFieldsArray.push("purchSaleContract"); //供应商购销合同
    infoFieldsArray.push("annualReport"); //供应商年度报告
    infoFieldsArray.push("companyType"); //公司类型
    infoFieldsArray.push("corporateRepresentative"); //法人代表
    infoFieldsArray.push("businessAddress"); //办公地址
    infoFieldsArray.push("contactNumber"); //联系号码
    infoFieldsArray.push("faxNumber"); //传真号码
    infoFieldsArray.push("businessLicenseNumber"); //营业执照注册号
    infoFieldsArray.push("businessLicenseValidity"); //营业执照有效期
    infoFieldsArray.push("isOpenAccount"); //开户许可资料
    infoFieldsArray.push("qualityAssuranceValidity"); //质量保证协议有效期
    //证照  字段
    zzFieldsArray.push("id"); //id
    zzFieldsArray.push("license"); //证照
    zzFieldsArray.push("license.licenseName licenseName"); //证照名称
    zzFieldsArray.push("lincenseNumber"); //证照号码
    zzFieldsArray.push("license.code lincenseCode"); //证照编码
    zzFieldsArray.push("authType"); //授权类型
    zzFieldsArray.push("issuingAuthority"); //发证机关
    zzFieldsArray.push("issueDate"); //发证日期
    zzFieldsArray.push("validUntil"); //有效期至
    zzFieldsArray.push("remarks"); //行备注
    zzFieldsArray.push("enclosure"); //文件
    //证照授权字段
    zz_fw_FieldsArray.push("id"); //id
    zz_fw_FieldsArray.push("material"); //物料
    zz_fw_FieldsArray.push("material.name materialName"); //物料名称
    zz_fw_FieldsArray.push("material.code materialCode"); //物料编码
    zz_fw_FieldsArray.push("sku"); //
    zz_fw_FieldsArray.push("sku.code skuCode"); //
    zz_fw_FieldsArray.push("sku.name skuName"); //
    zz_fw_FieldsArray.push("materialType"); //materialType
    zz_fw_FieldsArray.push("materialType.catagoryname materialTypeName"); //
    zz_fw_FieldsArray.push("dosageForm"); //剂型
    zz_fw_FieldsArray.push("dosageForm.dosagaFormName dosageName"); //剂型名称
    zz_fw_FieldsArray.push("listingPermitHolder"); //上市许可持有人
    zz_fw_FieldsArray.push("listingPermitHolder.ip_name listingPermitHolderName"); //上市许可持有人名称
    zz_fw_FieldsArray.push("feature"); //特征
    //授权委托书  字段
    sqwtrFieldsArray.push("id"); //id
    sqwtrFieldsArray.push("salesman"); //对方业务员
    sqwtrFieldsArray.push("salesman.businesserName salesmanName"); //对方业务员名称
    sqwtrFieldsArray.push("authType"); //授权类型
    sqwtrFieldsArray.push("clientType"); //委托人类型
    sqwtrFieldsArray.push("startDate"); //授权开始日期
    sqwtrFieldsArray.push("endDate"); //授权结束日期
    sqwtrFieldsArray.push("post"); //职务
    sqwtrFieldsArray.push("idCard"); //身份证号
    sqwtrFieldsArray.push("contact_number"); //联系电话
    sqwtrFieldsArray.push("isDefault"); //是否默认
    sqwtrFieldsArray.push("file"); //
    //授权委托书-范围   字段
    sqwtr_fwFieldsArray.push("id"); //id
    sqwtr_fwFieldsArray.push("material"); //物料
    sqwtr_fwFieldsArray.push("material.name materalName"); //materalName
    sqwtr_fwFieldsArray.push("material.code materialCode"); //materialCode
    sqwtr_fwFieldsArray.push("sku"); //
    sqwtr_fwFieldsArray.push("sku.code skuCode"); //
    sqwtr_fwFieldsArray.push("sku.name skuName"); //
    sqwtr_fwFieldsArray.push("materialType"); //
    sqwtr_fwFieldsArray.push("materialType.catagoryname materialTypeName"); //
    sqwtr_fwFieldsArray.push("dosageForm"); //
    sqwtr_fwFieldsArray.push("dosageForm.dosagaFormName dosageName"); //
    sqwtr_fwFieldsArray.push("feature"); //特征
    //其他资质与报告    字段
    qtzzybgFieldsArray.push("id"); //id
    qtzzybgFieldsArray.push("report"); //
    qtzzybgFieldsArray.push("report.name reportName"); //
    qtzzybgFieldsArray.push("beginDate"); //
    qtzzybgFieldsArray.push("endDate"); //
    qtzzybgFieldsArray.push("file"); //
    let selectInfoSql = "select " + infoFieldsArray.join(",") + " from GT22176AT10.GT22176AT10.SY01_supplier_file where id = '" + id + "'";
    let infoRes = ObjectStore.queryByYonQL(selectInfoSql, "sy01");
    if (infoRes.length == 0) {
      return { supLicInfo: null };
    }
    supLicInfo = infoRes[0];
    let select_zz_sql = "select " + zzFieldsArray.join(",") + " from  GT22176AT10.GT22176AT10.SY01_supplier_file_license where SY01_supplier_file_licenseFk = '" + id + "' and dr = 0";
    let zzRes = ObjectStore.queryByYonQL(select_zz_sql, "sy01");
    if (zzRes.length > 0) {
      for (let i = 0; i < zzRes.length; i++) {
        let select_zzfw_sql =
          "select " + zz_fw_FieldsArray.join(",") + " from GT22176AT10.GT22176AT10.SY01_supplier_file_license_auth where SY01_supplier_file_license_authFk = '" + zzRes[i].id + "' and dr = 0";
        let zzfwRes = ObjectStore.queryByYonQL(select_zzfw_sql, "sy01");
        zzRes[i].SY01_supplier_file_license_authList = zzfwRes;
      }
    }
    supLicInfo.SY01_supplier_file_licenseList = zzRes;
    let select_sq_sql = "select " + sqwtrFieldsArray.join(",") + " from GT22176AT10.GT22176AT10.SY01_supplier_file_certify where SY01_supplier_file_certifyFk = '" + id + "' and dr = 0";
    let sqRes = ObjectStore.queryByYonQL(select_sq_sql, "sy01");
    if (sqRes.length > 0) {
      for (let i = 0; i < sqRes.length; i++) {
        let select_sqfw_sql =
          "select " + sqwtr_fwFieldsArray.join(",") + " from  GT22176AT10.GT22176AT10.SY01_supplier_file_certify_auth  where SY01_supplier_file_certify_authFk = '" + sqRes[i].id + "' and dr = 0";
        let sqfwRes = ObjectStore.queryByYonQL(select_sqfw_sql, "sy01");
        sqRes[i].SY01_supplier_file_certify_authList = sqfwRes;
      }
    }
    supLicInfo.SY01_supplier_file_certifyList = sqRes;
    let select_other_sql = "select " + qtzzybgFieldsArray.join(",") + " from  GT22176AT10.GT22176AT10.sy01_supplier_file_other_rep where SY01_supplier_file_id = '" + id + "' and dr = 0";
    let otherRes = ObjectStore.queryByYonQL(select_other_sql, "sy01");
    supLicInfo.sy01_supplier_file_other_repList = otherRes;
    return { supLicInfo: supLicInfo };
  }
}
exports({ entryPoint: MyAPIHandler });