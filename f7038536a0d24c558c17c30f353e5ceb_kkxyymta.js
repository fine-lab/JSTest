let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let type = request.type;
    let orgId = request.orgId;
    let objId = request.objId;
    let relationId = request.relationId;
    //判断组织是否启用GSP组织参数
    let sqlStr = " select isgspzz, poacontrol,isgspmanage, noGspFlowCtrl from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where dr = 0  and org_id = '" + orgId + "'";
    let gspParameterArray = ObjectStore.queryByYonQL(sqlStr, "sy01");
    if (gspParameterArray.length > 0) {
      if (!gspParameterArray[0].isgspmanage) {
        return { errCode: "1005", msg: "该组织未启用GSP管理, 请检查" };
      }
    } else {
      return { errCode: "1005", msg: "该组织未启用GSP管理, 请检查" };
    }
    if (type == "material") {
      //判断是否在该使用范围之内
      let validateRangeOrgSql = "select productId from pc.product.ProductApplyRange where orgId = '" + orgId + "' and productId = '" + objId + "'";
      let validateRes = ObjectStore.queryByYonQL(validateRangeOrgSql, "productcenter");
      if (validateRes.length == 0) {
        return { errCode: "1007", msg: "该物料没有对应的适用组织" };
      }
      //判断该物料是否经过了首营审批
      let sql = "select code from GT22176AT10.GT22176AT10.SY01_fccusauditv4 where org_id = '" + orgId + "' and customerbillno = '" + objId + "' and is_sku = 0 and dr = 0";
      let result = ObjectStore.queryByYonQL(sql);
      if (result.length !== 0) {
        return { errCode: "1001", msg: "非sku维度商品审批,已存在相同首营商品审批单:【" + result[0].code + "】" };
      }
      let licInfo = {};
      //主表字段
      let infoFieldsArray = [];
      //子表字段
      let subTableinfoFieldsArray = [];
      infoFieldsArray.push("id"); //id
      infoFieldsArray.push("code"); //
      infoFieldsArray.push("material"); //物料id
      infoFieldsArray.push("material.name materialName"); //物料名称
      infoFieldsArray.push("material.code materialCode"); //物料编码
      infoFieldsArray.push("materialType"); //商品分类
      infoFieldsArray.push("materialType.catagoryname materialTypeName"); //商品分类
      infoFieldsArray.push("materialType.mCode mCode"); //国标商品分类编码
      infoFieldsArray.push("materialType.parent.name parentName"); //上级分类
      infoFieldsArray.push("storageCondition"); //存储条件
      infoFieldsArray.push("storageCondition.storageName storageConditionName"); //存储条件
      infoFieldsArray.push("dosageForm"); //剂型
      infoFieldsArray.push("dosageForm.dosagaFormName dosageFormName"); //剂型
      infoFieldsArray.push("listingHolder"); //上市许可持有人
      infoFieldsArray.push("listingHolder.ip_name listingHolderName"); //上市许可持有人
      infoFieldsArray.push("nearEffectivePeriodType"); //近效期类别
      infoFieldsArray.push("nearEffectivePeriodType.nearName nearName"); //近效期类别
      infoFieldsArray.push("packingMaterial"); //包材
      infoFieldsArray.push("packingMaterial.packing_name packingMaterialName"); //包材
      infoFieldsArray.push("curingType"); //养护类别
      infoFieldsArray.push("curingType.curingTypeName curingTypeName"); //养护类别
      infoFieldsArray.push("commonNme"); //通用名
      infoFieldsArray.push("specs"); //规格
      infoFieldsArray.push("producingArea"); //产地
      infoFieldsArray.push("approvalNumber"); //批准文号
      infoFieldsArray.push("standardCode"); //本位码
      infoFieldsArray.push("manufacturer"); //生产厂商
      infoFieldsArray.push("commodityPerformance"); //商品性能、质量、用途、疗效
      infoFieldsArray.push("qualityStandard"); //质量标准
      infoFieldsArray.push("prescriptionType"); //处方分类
      infoFieldsArray.push("drugSuppleApply"); //药品补充申请批件
      infoFieldsArray.push("commodityDeviceRegistration"); //商品/器械注册批件
      infoFieldsArray.push("biologicalCertification"); //生物签发合格证
      infoFieldsArray.push("instructions"); //说明书
      infoFieldsArray.push("commodityRegistrationApproval"); //商品/器械再注册批件
      infoFieldsArray.push("importLicense"); //进口许可证
      infoFieldsArray.push("importedMedicinalMaterials"); //进口药材批件
      infoFieldsArray.push("drugPackaging"); //药品包装
      infoFieldsArray.push("importedBiologicalProducts"); //进口生物制品检验报告书
      infoFieldsArray.push("importDrugRegistrationCertificate"); //进口药品注册证/医药陈品注册证/进口药品报告书
      infoFieldsArray.push("ephedrineContaining"); //含麻黄碱
      infoFieldsArray.push("reportOnImportedDrugs"); //进口药品通关证/进口药品报告书
      infoFieldsArray.push("importedDrugs"); //进口药品
      infoFieldsArray.push("coldChainDrugs"); //冷链药品
      infoFieldsArray.push("injection"); //注射
      infoFieldsArray.push("doubleReview"); //二次验收
      infoFieldsArray.push("specialDrugs"); //含特殊药品复方制
      infoFieldsArray.push("antitumorDrugs"); //抗肿瘤药
      infoFieldsArray.push("antibiotic"); //抗生素
      infoFieldsArray.push("salesByPrescription"); //凭处方单销售
      infoFieldsArray.push("importDrugsRegisterNo"); //进口药品注册证号
      infoFieldsArray.push("recordNo"); //凭处方单销售
      infoFieldsArray.push("zyypStandard"); //凭处方单销售
      infoFieldsArray.push("zypfStandard"); //凭处方单销售
      infoFieldsArray.push("model"); //型号
      infoFieldsArray.push("registNo"); //注册证号
      infoFieldsArray.push("productLincenseNo"); //生产许可证号
      infoFieldsArray.push("registerName"); //注册人名称
      infoFieldsArray.push("registerAddress"); //注册人地址
      infoFieldsArray.push("agentName"); //代理人
      infoFieldsArray.push("agentAddress"); //代理人地址
      infoFieldsArray.push("psychotropic"); //精神药品
      infoFieldsArray.push("radiation"); //放射药品
      infoFieldsArray.push("poison"); //毒性药品
      infoFieldsArray.push("narcotic"); //麻醉药品
      infoFieldsArray.push("mainUnit"); //单位
      infoFieldsArray.push("mainUnit.name mainUnitName"); //单位名称
      infoFieldsArray.push("innerPackMaterial"); //内包装材料
      infoFieldsArray.push("boxPackSpec"); //装箱包装规格
      infoFieldsArray.push("expireDateNo"); //保质期
      infoFieldsArray.push("expireDateUnit"); //保质期单位
      infoFieldsArray.push("approvalValidityDate"); //批文有效期
      infoFieldsArray.push("majorFunction"); //适应症或功能主治
      infoFieldsArray.push("supplierCompany"); //供货企业
      infoFieldsArray.push("supplierCompany.name supplierCompanyName"); //供货企业
      infoFieldsArray.push("isApprovalProof"); //药品生产/进口批准证明文件及其附件
      infoFieldsArray.push("isProductionProe"); //药品生产批件
      infoFieldsArray.push("isQualityStandard"); //药品质量标准
      infoFieldsArray.push("isSurveyReport"); //检验报告书
      infoFieldsArray.push("isPriceApproval"); //检验报告书
      infoFieldsArray.push("treatmentrange"); //诊疗范围
      infoFieldsArray.push("treatmentrange.name treatmentrange_name"); //诊疗范围名称
      subTableinfoFieldsArray.push("qualifyReport"); //证照
      subTableinfoFieldsArray.push("qualifyReport.name qualifyReportName"); //证照名称
      subTableinfoFieldsArray.push("reportCode"); //证照号码
      subTableinfoFieldsArray.push("startDate"); //生效时间
      subTableinfoFieldsArray.push("validUntil"); //有效期至
      subTableinfoFieldsArray.push("enclosure"); //附件
      subTableinfoFieldsArray.push("id"); //id
      let selectInfoSql = "select " + infoFieldsArray.join(",") + " from GT22176AT10.GT22176AT10.SY01_material_file where id = '" + relationId + "'";
      let infoRes = ObjectStore.queryByYonQL(selectInfoSql, "sy01");
      if (infoRes.length == 0) {
        return { errCode: "1006", licInfo: null, msg: "查询错误" };
      } else {
        licInfo = infoRes[0];
        let selectSubTableSql =
          "select " + subTableinfoFieldsArray.join(",") + " from 	GT22176AT10.GT22176AT10.SY01_material_file_child where SY01_material_file_childFk = '" + relationId + "' and dr = 0";
        let subTableRes = ObjectStore.queryByYonQL(selectSubTableSql, "sy01");
        licInfo.SY01_material_file_childList = subTableRes;
        return { errCode: "200", licInfo: licInfo };
      }
    }
    if (type == "customer") {
      //判断是否在该使用范围之内
      let validateRangeOrgSql = "select merchantId from aa.merchant.MerchantApplyRange where orgId = '" + orgId + "' and merchantId = '" + objId + "'";
      let validateRes = ObjectStore.queryByYonQL(validateRangeOrgSql, "productcenter");
      if (validateRes.length == 0) {
        return { errCode: "1007", msg: "客户不适用该组织，如需分配，请在客户档案中维护" };
      }
      //判断该客户是否经过了首营审批
      let validateSySql = "select code from GT22176AT10.GT22176AT10.SY01_firstcampcusv3 where org_id = '" + orgId + "' and customer = '" + objId + "' and dr = 0";
      let validateSyRes = ObjectStore.queryByYonQL(validateSySql, "sy01");
      if (validateSyRes.length !== 0) {
        return { errCode: "1001", msg: "已存在相同首营客户审批单:【" + validateSyRes[0].code + "】，无需分配" };
      }
      let licInfo = {};
      //主表字段
      let infoFieldsArray = [];
      //证照子表字段
      let zzFieldsArray = [];
      //证照授权范围子表字段
      let zzRangeFieldArray = [];
      //授权子表字段
      let sqFieldArray = [];
      //授权委托书授权范围子表字段
      let sqRangeFieldArray = [];
      //其他资质与报告子表
      let otherReportFieldArray = [];
      infoFieldsArray.push("id"); //id
      infoFieldsArray.push("code"); //编码
      infoFieldsArray.push("customer"); //客户
      infoFieldsArray.push("customer.code customerCode"); //客户编码
      infoFieldsArray.push("customer.name customerName"); //客户名称
      infoFieldsArray.push("customerType"); //客户分类id
      infoFieldsArray.push("customerType.typename customerTypeName"); //客户分类名称
      infoFieldsArray.push("firstMarketingBillno"); //首营单号
      infoFieldsArray.push("firstMarketingDate"); //首营日期
      infoFieldsArray.push("firstMarketingStatus"); //首营状态
      infoFieldsArray.push("firstChangeMarketingBillno"); //首营变更单号
      infoFieldsArray.push("firstChangeMarketingDate"); //首营变更日期
      infoFieldsArray.push("marketingRange"); //经营范围
      infoFieldsArray.push("qualitySystem"); //质量保证体系
      infoFieldsArray.push("electronicSupervisionCode"); //电子监管编码
      infoFieldsArray.push("importLicense"); //重要证照
      infoFieldsArray.push("specimenOfSeal"); //印章及随货同行票样
      infoFieldsArray.push("taxRegistrationCertify"); //企业税务登记证
      infoFieldsArray.push("gspCertificate"); //GSP认证证书
      infoFieldsArray.push("purchAndSalesStaff"); //购销员上岗证
      infoFieldsArray.push("qualityAssurAgreement"); //质量保证协议
      infoFieldsArray.push("certifyPurchSalesPerson"); //购销人身份证
      infoFieldsArray.push("orgCodeCertify"); //组织机构代码证
      infoFieldsArray.push("handlingEnterpriseLicense"); //药品经营企业许可证
      infoFieldsArray.push("powerAttorney"); //采购委托书
      infoFieldsArray.push("purchSaleContract"); //购销合同
      infoFieldsArray.push("annualReport"); //年度报告
      infoFieldsArray.push("saleState"); //销售状态
      infoFieldsArray.push("corporateRepresentative"); //法人代表
      infoFieldsArray.push("businessAddress"); //办公地址
      infoFieldsArray.push("warehouseAddress"); //仓库地址
      infoFieldsArray.push("enterpriseType"); //企业类型
      infoFieldsArray.push("contactNumber"); //联系电话
      infoFieldsArray.push("faxNumber"); //传真号码
      infoFieldsArray.push("businessLicenseNumber"); //企业营业执照注册号
      infoFieldsArray.push("businessLicenseValidity"); //营业执照有效期
      infoFieldsArray.push("practiceLicenseNumber"); //医疗机构执业许可证号
      infoFieldsArray.push("consigneeName"); //收货员姓名
      infoFieldsArray.push("consigneeIdNumber"); //收货人员身份证号
      infoFieldsArray.push("receiptAuthValidity"); //收货授权书有效期
      infoFieldsArray.push("qualityPerson"); //质量负责人
      infoFieldsArray.push("chargeperson"); //企业负责人
      infoFieldsArray.push("residence"); //住所
      infoFieldsArray.push("businessPlace"); //经营场所
      infoFieldsArray.push("paperMaterials"); //有无纸质材料
      //证照子表有哪些字段
      zzFieldsArray.push("id"); //id
      zzFieldsArray.push("beginDate"); //颁发日期
      zzFieldsArray.push("endDate"); //有效期至
      zzFieldsArray.push("customerName"); //客户名称
      zzFieldsArray.push("customerCode"); //客户编码
      zzFieldsArray.push("issuingAuthority"); //颁发机构
      zzFieldsArray.push("remark"); //备注
      zzFieldsArray.push("authType"); //证照授权类型
      zzFieldsArray.push("license"); //证照
      zzFieldsArray.push("lincenseNumber"); //证照编号
      zzFieldsArray.push("license.licenseName licenseName"); //证照名称
      zzFieldsArray.push("enclosure"); //附件
      //证照范围
      zzRangeFieldArray.push("id"); //id
      zzRangeFieldArray.push("material"); //授权物料
      zzRangeFieldArray.push("material.name materialName"); //物料名称
      zzRangeFieldArray.push("material.code materialCode"); //物料编码
      zzRangeFieldArray.push("sku"); //sku
      zzRangeFieldArray.push("sku.name skuName"); //sku名称
      zzRangeFieldArray.push("sku.code skuCode"); //sku编码
      zzRangeFieldArray.push("materialType"); //分类
      zzRangeFieldArray.push("materialType.catagoryname materialTypeName"); //分类名称
      zzRangeFieldArray.push("materialType.mCode mCode"); //国标编码
      zzRangeFieldArray.push("materialType.parent.name parentName"); //上级分类名称
      zzRangeFieldArray.push("dosageForm"); //剂型
      zzRangeFieldArray.push("dosageForm.dosagaFormName dosageFormName"); //剂型名称
      zzRangeFieldArray.push("listingPermitHolder"); //上市许可持有人
      zzRangeFieldArray.push("listingPermitHolder.ip_name listingPermitHolderName"); //上市许可持有人名称
      zzRangeFieldArray.push("customerName"); //客户名称
      zzRangeFieldArray.push("customerCode"); //客户编码
      zzRangeFieldArray.push("feature"); //特征
      zzRangeFieldArray.push("featureStr"); //特征Str
      zzRangeFieldArray.push("treatmentrange"); //诊疗范围
      zzRangeFieldArray.push("treatmentrange.name treatmentrange_name"); //诊疗范围名称
      //授权子表有哪些字段
      sqFieldArray.push("id"); //id
      sqFieldArray.push("salesman"); //业务员
      sqFieldArray.push("salesman.businesserName salesmanName"); //业务员名称
      sqFieldArray.push("authType"); //授权类型
      sqFieldArray.push("clientType"); //委托人类型
      sqFieldArray.push("startDate"); //授权开始日期
      sqFieldArray.push("endDate"); //授权结束日期
      sqFieldArray.push("customersName"); //客户名称
      sqFieldArray.push("customersCode"); //客户编码
      sqFieldArray.push("idCard"); //身份证
      sqFieldArray.push("post"); //职务
      sqFieldArray.push("file"); //附件
      sqFieldArray.push("isDefault"); //是否默认
      //授权范围子表有哪些字段
      sqRangeFieldArray.push("id"); //id
      sqRangeFieldArray.push("material"); //授权物料
      sqRangeFieldArray.push("material.name materialName"); //物料名称
      sqRangeFieldArray.push("material.code materialCode"); //物料编码
      sqRangeFieldArray.push("materialType"); //授权物料分类
      sqRangeFieldArray.push("materialType.catagoryname materialTypeName"); //分类名称
      sqRangeFieldArray.push("materialType.mCode mCode"); //国标编码
      sqRangeFieldArray.push("materialType.parent.name parentName"); //上级分类名称
      sqRangeFieldArray.push("dosageForm"); //授权剂型
      sqRangeFieldArray.push("dosageForm.dosagaFormName dosageFormName"); //剂型名称
      sqRangeFieldArray.push("customerName"); //客户名称
      sqRangeFieldArray.push("customerCode"); //客户编码
      sqRangeFieldArray.push("sku"); //sku
      sqRangeFieldArray.push("sku.code skuCode"); //sku编码
      sqRangeFieldArray.push("sku.name skuName"); //sku名称
      sqRangeFieldArray.push("salesmanName"); //业务员名称
      sqRangeFieldArray.push("feature"); //特征
      sqRangeFieldArray.push("featureStr"); //特征Str
      sqRangeFieldArray.push("treatmentrange"); //诊疗范围
      sqRangeFieldArray.push("treatmentrange.name treatmentrange_name"); //诊疗范围名称
      //其他资质与证照
      otherReportFieldArray.push("id"); //id
      otherReportFieldArray.push("report"); //资质/报告
      otherReportFieldArray.push("report.name reportName"); //资质/报告名称
      otherReportFieldArray.push("beginDate"); //生效日期
      otherReportFieldArray.push("endDate"); //有效期至
      otherReportFieldArray.push("file"); //附件
      let selectInfoSql = "select " + infoFieldsArray.join(",") + " from 	GT22176AT10.GT22176AT10.sy01_customers_file where id = '" + relationId + "'";
      let infoRes = ObjectStore.queryByYonQL(selectInfoSql, "sy01");
      if (infoRes.length == 0) {
        return { errCode: "1006", licInfo: null, msg: "查询错误" };
      } else {
        licInfo = infoRes[0];
        //查询证照
        let selectZzSql = "select " + zzFieldsArray.join(",") + " from GT22176AT10.GT22176AT10.sy01_customers_file_license where sy01_customers_file_id = '" + relationId + "' and dr = 0";
        let zzRes = ObjectStore.queryByYonQL(selectZzSql, "sy01");
        //查询证照范围
        for (let i = 0; i < zzRes.length; i++) {
          let entryId = zzRes[i].id;
          let selectZzRangeSql =
            "select " + zzRangeFieldArray.join(",") + " from  GT22176AT10.GT22176AT10.sy01_customers_file_lic_auth where sy01_customers_file_license_id = '" + entryId + "' and dr = 0";
          let zzRangeRes = ObjectStore.queryByYonQL(selectZzRangeSql, "sy01");
          zzRes[i].sy01_customers_file_lic_authList = zzRangeRes;
        }
        licInfo.sy01_customers_file_licenseList = zzRes;
        //查询证照
        let selectSqSql = "select " + sqFieldArray.join(",") + " from 	GT22176AT10.GT22176AT10.SY01_customers_file_certify where sy01_customers_file_id = '" + relationId + "' and dr = 0";
        let sqRes = ObjectStore.queryByYonQL(selectSqSql, "sy01");
        //查询证照范围
        for (let i = 0; i < sqRes.length; i++) {
          let entryId = sqRes[i].id;
          let selectSqRangeSql =
            "select " + sqRangeFieldArray.join(",") + " from  GT22176AT10.GT22176AT10.SY01_customers_file_cer_auth  where SY01_customers_file_certify_id = '" + entryId + "' and dr = 0";
          let sqRangeRes = ObjectStore.queryByYonQL(selectSqRangeSql, "sy01");
          sqRes[i].SY01_customers_file_cer_authList = sqRangeRes;
        }
        licInfo.SY01_customers_file_certifyList = sqRes;
        //查询其他报告与资质
        let selectOtherReportSql =
          "select " + otherReportFieldArray.join(",") + " from GT22176AT10.GT22176AT10.sy01_customers_file_other_rep where sy01_customers_file_id = '" + relationId + "' and dr = 0";
        let reportRes = ObjectStore.queryByYonQL(selectOtherReportSql, "sy01");
        licInfo.sy01_customers_file_other_repList = reportRes;
        return { errCode: "200", licInfo: licInfo };
      }
    }
    if (type == "supplier") {
      //判断是否在该使用范围之内
      let validateRangeOrgSql = "select vendororg from aa.vendor.VendorOrg where org = '" + orgId + "' and vendororg = '" + objId + "'";
      let validateRes = ObjectStore.queryByYonQL(validateRangeOrgSql, "yssupplier");
      if (validateRes.length == 0) {
        return { errCode: "1007", msg: "供应商不适用该组织，如需分配，请在供应商档案中维护" };
      }
      //判断该客户是否经过了首营审批
      let validateSySql = "select code from  GT22176AT10.GT22176AT10.SY01_fccompauditv4  where org_id = '" + orgId + "' and supplier = '" + objId + "' and dr = 0";
      let validateSyRes = ObjectStore.queryByYonQL(validateSySql, "sy01");
      if (validateSyRes.length !== 0) {
        return { errCode: "1001", msg: "已存在相同首营供应商审批单:【" + validateSyRes[0].code + "】，无需分配" };
      }
      let licInfo = {};
      //主表字段
      let infoFieldsArray = [];
      //证照子表字段
      let zzFieldsArray = [];
      //证照授权范围子表字段
      let zzRangeFieldArray = [];
      //授权子表字段
      let sqFieldArray = [];
      //授权委托书授权范围子表字段
      let sqRangeFieldArray = [];
      //其他资质与报告子表
      let otherReportFieldArray = [];
      infoFieldsArray.push("id"); //id
      infoFieldsArray.push("code"); //编码
      infoFieldsArray.push("supplierType"); //医药供应商分类
      infoFieldsArray.push("supplierType.catagoryName supplierTypeName"); //供应商分类名称
      infoFieldsArray.push("supplier"); //供应商
      infoFieldsArray.push("supplier.name supplierName"); //供应商名称
      infoFieldsArray.push("supplier.code supplierCode"); //供应商编码
      infoFieldsArray.push("firstSaleDate"); //首营日期
      infoFieldsArray.push("firstBattalionStatus"); //首营状态
      infoFieldsArray.push("firstBusinessOrderNo"); //首营单号
      infoFieldsArray.push("changeOrderNo"); //首营变更单号
      infoFieldsArray.push("changeData"); //首营变更日期
      infoFieldsArray.push("businessScope"); //经营范围
      infoFieldsArray.push("qualityAssuranceSystem"); //质量保证体系--文本
      infoFieldsArray.push("electronicSupervisionCode"); //电子监管编码
      infoFieldsArray.push("importantLicense"); //重要证照
      infoFieldsArray.push("specimenOfSeal"); //印章及随货同行票样
      infoFieldsArray.push("gmpCertificate"); //GMP认证证书
      infoFieldsArray.push("gspCertificate"); //GSP认证证书
      infoFieldsArray.push("purchAndSalesStaff"); //购销员上岗证
      infoFieldsArray.push("qualityAssurAgreement"); //质量保证协议--按钮
      infoFieldsArray.push("certifyPurchSalesPerson"); //购销人员证件
      infoFieldsArray.push("orgCodeCertify"); //组织机构代码证
      infoFieldsArray.push("businessLicense"); //营业执照
      infoFieldsArray.push("produceEnterpriseLicense"); //药品生产企业许可证
      infoFieldsArray.push("handlingEnterpriseLicense"); //药品经营企业许可证
      infoFieldsArray.push("powerAttorney"); //法人委托书
      infoFieldsArray.push("purchSaleContract"); //购销合同
      infoFieldsArray.push("annualReport"); //年度报告
      infoFieldsArray.push("purState"); //采购状态
      infoFieldsArray.push("companyType"); //公司类型
      infoFieldsArray.push("businessAddress"); //办公地址
      infoFieldsArray.push("corporateRepresentative"); //法人代表
      infoFieldsArray.push("contactNumber"); //联系电话
      infoFieldsArray.push("faxNumber"); //传真号码
      infoFieldsArray.push("businessLicenseNumber"); //营业执照注册号
      infoFieldsArray.push("businessLicenseValidity"); //营业执照有效期
      infoFieldsArray.push("businessLicenseValidity"); //营业执照有效期
      infoFieldsArray.push("isOpenAccount"); //开户许可资料
      infoFieldsArray.push("qualityAssuranceValidity"); //质量保证协议有效期
      //证照子表有哪些字段
      zzFieldsArray.push("id"); //id
      zzFieldsArray.push("issueDate"); //颁发日期
      zzFieldsArray.push("validUntil"); //有效期至
      zzFieldsArray.push("supplierName"); //供应商名称
      zzFieldsArray.push("supplierCode"); //供应商编码
      zzFieldsArray.push("issuingAuthority"); //颁发机构
      zzFieldsArray.push("remarks"); //备注
      zzFieldsArray.push("authType"); //证照授权类型
      zzFieldsArray.push("license"); //证照
      zzFieldsArray.push("lincenseNumber"); //证照编号
      zzFieldsArray.push("license.licenseName licenseName"); //证照名称
      zzFieldsArray.push("enclosure"); //附件
      //证照范围
      zzRangeFieldArray.push("id"); //id
      zzRangeFieldArray.push("material"); //授权物料
      zzRangeFieldArray.push("material.name materialName"); //物料名称
      zzRangeFieldArray.push("material.code materialCode"); //物料编码
      zzRangeFieldArray.push("sku"); //sku
      zzRangeFieldArray.push("sku.name skuName"); //sku名称
      zzRangeFieldArray.push("sku.code skuCode"); //sku编码
      zzRangeFieldArray.push("materialType"); //分类
      zzRangeFieldArray.push("materialType.catagoryname materialTypeName"); //分类名称
      zzRangeFieldArray.push("materialType.mCode mCode"); //国标编码
      zzRangeFieldArray.push("materialType.parent.name parentName"); //上级分类名称
      zzRangeFieldArray.push("dosageForm"); //剂型
      zzRangeFieldArray.push("dosageForm.dosagaFormName dosageFormName"); //剂型名称
      zzRangeFieldArray.push("listingPermitHolder"); //上市许可持有人
      zzRangeFieldArray.push("listingPermitHolder.ip_name listingPermitHolderName"); //上市许可持有人名称
      zzRangeFieldArray.push("supplierName"); //供应商名称
      zzRangeFieldArray.push("supplierCode"); //供应商编码
      zzRangeFieldArray.push("feature"); //特征
      //授权子表有哪些字段
      sqFieldArray.push("id"); //id
      sqFieldArray.push("salesman"); //业务员
      sqFieldArray.push("salesman.businesserName salesmanName"); //业务员名称
      sqFieldArray.push("authType"); //授权类型
      sqFieldArray.push("clientType"); //委托人类型
      sqFieldArray.push("startDate"); //授权开始日期
      sqFieldArray.push("endDate"); //授权结束日期
      sqFieldArray.push("supplierName"); //供应商名称
      sqFieldArray.push("supplierCode"); //供应商编码
      sqFieldArray.push("idCard"); //身份证
      sqFieldArray.push("post"); //职务
      sqFieldArray.push("file"); //附件
      sqFieldArray.push("contact_number"); //联系电话
      sqFieldArray.push("isDefault"); //是否默认
      //授权范围子表有哪些字段
      sqRangeFieldArray.push("id"); //id
      sqRangeFieldArray.push("material"); //授权物料
      sqRangeFieldArray.push("material.name materialName"); //物料名称
      sqRangeFieldArray.push("material.code materialCode"); //物料编码
      sqRangeFieldArray.push("materialType"); //授权物料分类
      sqRangeFieldArray.push("materialType.catagoryname materialTypeName"); //分类名称
      sqRangeFieldArray.push("materialType.mCode mCode"); //国标编码
      sqRangeFieldArray.push("materialType.parent.name parentName"); //上级分类名称
      sqRangeFieldArray.push("dosageForm"); //授权剂型
      sqRangeFieldArray.push("dosageForm.dosagaFormName dosageFormName"); //剂型名称
      sqRangeFieldArray.push("supplierName"); //供应商名称
      sqRangeFieldArray.push("supplierCode"); //供应商编码
      sqRangeFieldArray.push("sku"); //sku
      sqRangeFieldArray.push("sku.code skuCode"); //sku编码
      sqRangeFieldArray.push("sku.name skuName"); //sku名称
      sqRangeFieldArray.push("salesmanName"); //业务员名称
      sqRangeFieldArray.push("feature"); //特征
      //其他资质与证照
      otherReportFieldArray.push("id"); //id
      otherReportFieldArray.push("report"); //资质/报告
      otherReportFieldArray.push("report.name reportName"); //资质/报告名称
      otherReportFieldArray.push("beginDate"); //生效日期
      otherReportFieldArray.push("endDate"); //有效期至
      otherReportFieldArray.push("file"); //附件
      let selectInfoSql = "select " + infoFieldsArray.join(",") + " from 	GT22176AT10.GT22176AT10.SY01_supplier_file where id = '" + relationId + "'";
      let infoRes = ObjectStore.queryByYonQL(selectInfoSql, "sy01");
      if (infoRes.length == 0) {
        return { errCode: "1006", licInfo: null, msg: "查询错误" };
      } else {
        licInfo = infoRes[0];
        //查询证照
        let selectZzSql = "select " + zzFieldsArray.join(",") + " from GT22176AT10.GT22176AT10.SY01_supplier_file_license where SY01_supplier_file_licenseFk = '" + relationId + "' and dr = 0";
        let zzRes = ObjectStore.queryByYonQL(selectZzSql, "sy01");
        //查询证照范围
        for (let i = 0; i < zzRes.length; i++) {
          let entryId = zzRes[i].id;
          let selectZzRangeSql =
            "select " + zzRangeFieldArray.join(",") + " from  GT22176AT10.GT22176AT10.SY01_supplier_file_license_auth  where SY01_supplier_file_license_authFk = '" + entryId + "' and dr = 0";
          let zzRangeRes = ObjectStore.queryByYonQL(selectZzRangeSql, "sy01");
          zzRes[i].SY01_supplier_file_license_authList = zzRangeRes;
        }
        licInfo.SY01_supplier_file_licenseList = zzRes;
        //查询授权委托
        let selectSqSql = "select " + sqFieldArray.join(",") + " from GT22176AT10.GT22176AT10.SY01_supplier_file_certify where SY01_supplier_file_certifyFk = '" + relationId + "' and dr = 0";
        let sqRes = ObjectStore.queryByYonQL(selectSqSql, "sy01");
        //查询授权委托范围
        for (let i = 0; i < sqRes.length; i++) {
          let entryId = sqRes[i].id;
          let selectSqRangeSql =
            "select " + sqRangeFieldArray.join(",") + " from GT22176AT10.GT22176AT10.SY01_supplier_file_certify_auth where SY01_supplier_file_certify_authFk = '" + entryId + "' and dr = 0";
          let sqRangeRes = ObjectStore.queryByYonQL(selectSqRangeSql, "sy01");
          sqRes[i].SY01_supplier_file_certify_authList = sqRangeRes;
        }
        licInfo.SY01_supplier_file_certifyList = sqRes;
        //查询其他报告与资质
        let selectOtherReportSql =
          "select " + otherReportFieldArray.join(",") + " from GT22176AT10.GT22176AT10.sy01_supplier_file_other_rep where SY01_supplier_file_id = '" + relationId + "' and dr = 0";
        let reportRes = ObjectStore.queryByYonQL(selectOtherReportSql, "sy01");
        licInfo.sy01_supplier_file_other_repList = reportRes;
        return { errCode: "200", licInfo: licInfo };
      }
    }
    return { errCode: "999", msg: "GSP_llocateRecord.js报错了" };
  }
}
exports({ entryPoint: MyAPIHandler });