let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let yonql = "select id from GT22176AT10.GT22176AT10.sy01_customers_file where org_id='" + request.orgId + "' and customer = '" + request.customerId + "'";
    let res = ObjectStore.queryByYonQL(yonql, "sy01");
    let cusLicInfo = {};
    if (res.length == 0) {
      return { cusLicInfo: null };
    }
    let id = res[0].id;
    //主表字段
    let infoFieldsArray = [];
    //证照子表字段
    let zzFieldsArray = [];
    //证照授权委托书字段
    let zz_fw_FieldsArray = [];
    let sqwtrFieldsArray = [];
    let sqwtr_fwFieldsArray = [];
    let qtzzybgFieldsArray = [];
    infoFieldsArray.push("id"); //id
    infoFieldsArray.push("code"); //单据code
    infoFieldsArray.push("org_id"); //组织
    infoFieldsArray.push("customer"); //客户
    infoFieldsArray.push("customer.name customerName"); //客户名称
    infoFieldsArray.push("customerType"); //客户分类
    infoFieldsArray.push("customerType.typename customerTypeName"); //客户分类名称
    infoFieldsArray.push("qualitySystem"); //经营范围
    infoFieldsArray.push("electronicSupervisionCode"); //电子监管编码
    infoFieldsArray.push("importLicense"); //重要证照
    infoFieldsArray.push("specimenOfSeal"); //印章及随货同行票样
    infoFieldsArray.push("taxRegistrationCertify"); //企业税务登记证
    infoFieldsArray.push("gspCertificate"); //GSP认证证书
    infoFieldsArray.push("purchAndSalesStaff"); //购销员上岗证
    infoFieldsArray.push("qualityAssurAgreement"); //质量保证协议
    infoFieldsArray.push("certifyPurchSalesPerson"); //购销人员身份证
    infoFieldsArray.push("orgCodeCertify"); //组织机构代码证
    infoFieldsArray.push("handlingEnterpriseLicense"); //药品经营许可证
    infoFieldsArray.push("powerAttorney"); //采购委托书
    infoFieldsArray.push("purchSaleContract"); //购销合同
    infoFieldsArray.push("annualReport"); //年度报告
    infoFieldsArray.push("marketingRange"); //经营范围
    infoFieldsArray.push("corporateRepresentative"); //法人代表
    infoFieldsArray.push("businessAddress"); //办公地址
    infoFieldsArray.push("warehouseAddress"); //仓库地址
    infoFieldsArray.push("enterpriseType"); //企业类型
    infoFieldsArray.push("contactNumber"); //联系号码
    infoFieldsArray.push("faxNumber"); //传真号码
    infoFieldsArray.push("businessLicenseNumber"); //企业营业执照注册号
    infoFieldsArray.push("businessLicenseValidity"); //营业执照有效期
    infoFieldsArray.push("practiceLicenseNumber"); //医疗机构执业许可证号
    infoFieldsArray.push("qualityPerson"); //质量负责人
    infoFieldsArray.push("consigneeName"); //收货员姓名
    infoFieldsArray.push("consigneeIdNumber"); //收货人员身份证号
    infoFieldsArray.push("receiptAuthValidity"); //收货授权书有效期
    //证照字段  数组
    zzFieldsArray.push("id"); //id
    zzFieldsArray.push("license"); //证照
    zzFieldsArray.push("license.licenseName licenseName"); //证照名称
    zzFieldsArray.push("lincenseNumber"); //证照号码
    zzFieldsArray.push("license.code lincenseCode"); //证照编码
    zzFieldsArray.push("authType"); //类型
    zzFieldsArray.push("issuingAuthority"); //颁发机构
    zzFieldsArray.push("beginDate"); //
    zzFieldsArray.push("endDate"); //
    zzFieldsArray.push("remark"); //
    zzFieldsArray.push("enclosure"); //附件
    //证照授权范围  字段  数组
    zz_fw_FieldsArray.push("id"); //id
    zz_fw_FieldsArray.push("material"); //物料
    zz_fw_FieldsArray.push("material.code materialCode"); //物料
    zz_fw_FieldsArray.push("material.name materialName"); //物料
    zz_fw_FieldsArray.push("sku"); //sku
    zz_fw_FieldsArray.push("sku.code skuCdoe"); //sku code
    zz_fw_FieldsArray.push("sku.name skuName"); //sku code
    zz_fw_FieldsArray.push("materialType"); //GSP物料类型
    zz_fw_FieldsArray.push("materialType.catagoryname materialTypeName"); //sku code
    zz_fw_FieldsArray.push("dosageForm"); //剂型
    zz_fw_FieldsArray.push("dosageForm.dosagaFormName dosageFormName"); //剂型名称
    zz_fw_FieldsArray.push("listingPermitHolder"); //上市许可持有人
    zz_fw_FieldsArray.push("listingPermitHolder.ip_name listingPermitHolderName"); //上市许可持有人名称
    zz_fw_FieldsArray.push("customerCode"); //
    zz_fw_FieldsArray.push("customerName"); //
    zz_fw_FieldsArray.push("feature"); //
    zz_fw_FieldsArray.push("treatmentrange"); //
    zz_fw_FieldsArray.push("treatmentrange.name treatmentrange_name"); //
    zz_fw_FieldsArray.push("treatmentrange.path treatmentrangePath"); //
    //授权委托书  字段  数组
    sqwtrFieldsArray.push("id"); //id
    sqwtrFieldsArray.push("salesman"); //
    sqwtrFieldsArray.push("salesman.businesserName salesmanName"); //
    sqwtrFieldsArray.push("authType"); //
    sqwtrFieldsArray.push("clientType"); //
    sqwtrFieldsArray.push("startDate"); //
    sqwtrFieldsArray.push("endDate"); //
    sqwtrFieldsArray.push("post"); //
    sqwtrFieldsArray.push("idCard"); //
    sqwtrFieldsArray.push("file"); //
    sqwtrFieldsArray.push("isDefault"); //
    //授权委托书  范围  字段  数组
    sqwtr_fwFieldsArray.push("id"); //id
    sqwtr_fwFieldsArray.push("material"); //
    sqwtr_fwFieldsArray.push("material.code materialCode"); //materialCode
    sqwtr_fwFieldsArray.push("material.name materialName"); //materialName
    sqwtr_fwFieldsArray.push("sku"); //
    sqwtr_fwFieldsArray.push("sku.code skuCdoe"); //skuCode
    sqwtr_fwFieldsArray.push("sku.name skuName"); //skuName
    sqwtr_fwFieldsArray.push("materialType"); //
    sqwtr_fwFieldsArray.push("materialType.catagoryname materialTypeName"); //
    sqwtr_fwFieldsArray.push("dosageForm"); //
    sqwtr_fwFieldsArray.push("dosageForm.dosagaFormName dosageFormName"); //
    sqwtr_fwFieldsArray.push("customerCode"); //
    sqwtr_fwFieldsArray.push("customerName"); //
    sqwtr_fwFieldsArray.push("feature"); //
    sqwtr_fwFieldsArray.push("treatmentrange"); //
    sqwtr_fwFieldsArray.push("treatmentrange.name treatmentrange_name"); //
    sqwtr_fwFieldsArray.push("treatmentrange.path treatmentrangePath"); //
    //其他资质与报告   字段  数组
    qtzzybgFieldsArray.push("id"); //id
    qtzzybgFieldsArray.push("report"); //
    qtzzybgFieldsArray.push("reportCode"); //
    qtzzybgFieldsArray.push("report.code report_code"); //
    qtzzybgFieldsArray.push("report.name reportName"); //
    qtzzybgFieldsArray.push("beginDate"); //
    qtzzybgFieldsArray.push("endDate"); //
    qtzzybgFieldsArray.push("file"); //
    let selectInfoSql = "select " + infoFieldsArray.join(",") + " from GT22176AT10.GT22176AT10.sy01_customers_file where id = '" + id + "'";
    let infoRes = ObjectStore.queryByYonQL(selectInfoSql, "sy01");
    if (infoRes.length == 0) {
      return { cusLicInfo: null };
    }
    cusLicInfo = infoRes[0];
    let select_zz_sql = "select " + zzFieldsArray.join(",") + " from  GT22176AT10.GT22176AT10.sy01_customers_file_license where sy01_customers_file_id = '" + id + "' and dr = 0";
    let zzRes = ObjectStore.queryByYonQL(select_zz_sql, "sy01");
    if (zzRes.length > 0) {
      for (let i = 0; i < zzRes.length; i++) {
        let select_zzfw_sql =
          "select " + zz_fw_FieldsArray.join(",") + " from  	GT22176AT10.GT22176AT10.sy01_customers_file_lic_auth where sy01_customers_file_license_id = '" + zzRes[i].id + "' and dr = 0";
        let zzfwRes = ObjectStore.queryByYonQL(select_zzfw_sql, "sy01");
        zzRes[i].sy01_customers_file_lic_authList = zzfwRes;
      }
    }
    cusLicInfo.sy01_customers_file_licenseList = zzRes;
    let select_sq_sql = "select " + sqwtrFieldsArray.join(",") + " from  	GT22176AT10.GT22176AT10.SY01_customers_file_certify where sy01_customers_file_id = '" + id + "' and dr = 0";
    let sqRes = ObjectStore.queryByYonQL(select_sq_sql, "sy01");
    if (sqRes.length > 0) {
      for (let i = 0; i < sqRes.length; i++) {
        let select_sqfw_sql =
          "select " + sqwtr_fwFieldsArray.join(",") + " from  GT22176AT10.GT22176AT10.SY01_customers_file_cer_auth  where SY01_customers_file_certify_id = '" + sqRes[i].id + "' and dr = 0";
        let sqfwRes = ObjectStore.queryByYonQL(select_sqfw_sql, "sy01");
        sqRes[i].SY01_customers_file_cer_authList = sqfwRes;
      }
    }
    cusLicInfo.SY01_customers_file_certifyList = sqRes;
    let select_other_sql = "select " + qtzzybgFieldsArray.join(",") + " from  GT22176AT10.GT22176AT10.sy01_customers_file_other_rep where sy01_customers_file_id = '" + id + "' and dr = 0";
    let otherRes = ObjectStore.queryByYonQL(select_other_sql, "sy01");
    cusLicInfo.sy01_customers_file_other_repList = otherRes;
    return { cusLicInfo: cusLicInfo };
  }
}
exports({ entryPoint: MyAPIHandler });