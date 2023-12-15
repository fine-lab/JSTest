let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let edition = "new";
    if (edition == "new") {
      let getSwitchValue = function (value) {
        if (value == undefined || value == null || value == 0 || value == "0" || value == false || value == "false") {
          return 0;
        } else {
          return 1;
        }
      };
      let update = function (billInfo) {
        let apiResponse = extrequire("GT22176AT10.publicFunction.queryMerchantInfor").execute({ code: billInfo.customer_bill_no, orgId: billInfo.org_id });
        let customerInfo = apiResponse.merchantInfo;
        let merchantAddressInfos = [];
        if (typeof customerInfo.merchantAddressInfos != "undefined") {
          for (let i = 0; i < customerInfo.merchantAddressInfos.length; i++) {
            merchantAddressInfos.push({
              id: customerInfo.merchantAddressInfos[i].id,
              addressCode: customerInfo.merchantAddressInfos[i].addressCode,
              isDefault: customerInfo.merchantAddressInfos[i].isDefault,
              _status: "Update"
            });
          }
        }
        let merchantContacterInfos = [];
        if (typeof customerInfo.merchantContacterInfos != "undefined") {
          for (let i = 0; i < customerInfo.merchantContacterInfos.length; i++) {
            merchantContacterInfos.push({
              id: customerInfo.merchantContacterInfos[i].id,
              fullName: customerInfo.merchantContacterInfos[i].fullName,
              isDefault: customerInfo.merchantContacterInfos[i].isDefault,
              _status: "Update"
            });
          }
        }
        let merchantAgentFinancialInfos = [];
        if (typeof customerInfo.merchantAgentFinancialInfos != "undefined") {
          for (let i = 0; i < customerInfo.merchantAgentFinancialInfos.length; i++) {
            merchantAgentFinancialInfos.push({
              id: customerInfo.merchantAgentFinancialInfos[i].id,
              country: customerInfo.merchantAgentFinancialInfos[i].country,
              currency: customerInfo.merchantAgentFinancialInfos[i].currency,
              accountType: customerInfo.merchantAgentFinancialInfos[i].accountType,
              bank: customerInfo.merchantAgentFinancialInfos[i].bank,
              openBank: customerInfo.merchantAgentFinancialInfos[i].openBank,
              bankAccountName: customerInfo.merchantAgentFinancialInfos[i].bankAccountName,
              isDefault: customerInfo.merchantAgentFinancialInfos[i].isDefault,
              _status: "Update"
            });
          }
        }
        let merchantAgentInvoiceInfos = [];
        if (typeof customerInfo.merchantAgentInvoiceInfos != "undefined") {
          for (let i = 0; i < customerInfo.merchantAgentInvoiceInfos.length; i++) {
            merchantAgentInvoiceInfos.push({
              id: customerInfo.merchantAgentInvoiceInfos[i].id,
              billingType: customerInfo.merchantAgentInvoiceInfos[i].billingType,
              title: customerInfo.merchantAgentInvoiceInfos[i].title,
              isDefault: customerInfo.merchantAgentInvoiceInfos[i].isDefault,
              _status: "Update"
            });
          }
        }
        let merchantCorpImages = [];
        if (typeof customerInfo.merchantCorpImages != "undefined") {
          for (let i = 0; i < customerInfo.merchantCorpImages.length; i++) {
            merchantCorpImages.push({
              id: customerInfo.merchantCorpImages[i].id,
              _status: "Update"
            });
          }
        }
        let merchantAttachments = [];
        if (typeof customerInfo.merchantAttachments != "undefined") {
          for (let i = 0; i < customerInfo.merchantAttachments.length; i++) {
            merchantAttachments.push({
              id: customerInfo.merchantAttachments[i].id,
              _status: "Update"
            });
          }
        }
        customerInfo.merchantAppliedDetail._status = "Update";
        let updateJson = {
          data: {
            id: customerInfo.id,
            createOrg: customerInfo.createOrg,
            code: customerInfo.code,
            merchantAppliedDetail: customerInfo.merchantAppliedDetail,
            taxPayingCategories: customerInfo.taxPayingCategories,
            customerClass: customerInfo.customerClass,
            merchantOptions: customerInfo.merchantOptions,
            enterpriseNature: customerInfo.enterpriseNature,
            merchantAddressInfos: merchantAddressInfos,
            merchantContacterInfos: merchantContacterInfos,
            merchantAgentFinancialInfos: merchantAgentFinancialInfos,
            merchantAgentInvoiceInfos: merchantAgentInvoiceInfos,
            merchantCorpImages: merchantCorpImages,
            merchantAttachments: merchantAttachments,
            _status: "Update",
            sy01_gsp_infosList: [
              {
                _status: "Insert",
                org: billInfo.org_id,
                org_name: billInfo.org_id_name,
                isGSP: "1",
                isFirstMarketing: "1"
              }
            ]
          }
        };
        apiResponse = extrequire("GT22176AT10.publicFunction.saveMerchant").execute(updateJson);
      };
      let lic_zz = "sy01_customers_file_licenseList";
      let lic_zz_fw = "sy01_customers_file_lic_authList";
      let lic_sq = "SY01_customers_file_certifyList";
      let lic_sq_fw = "SY01_customers_file_cer_authList";
      let lic_rep = "sy01_customers_file_other_repList";
      let sy_zz = "SY01_sykhsp_xgzzList";
      let sy_zz_fw = "SY01_sykhsp_xgzz_fwList";
      let sy_sq = "SY01_sykhsp_poavList";
      let sy_sq_fw = "SY01_poal_sqwt_sList";
      let sy_rep = "sy01_customer_other_reportList";
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
      var billInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_firstcampcusv3", billObj);
      let customerLicenseList = [];
      //获取证照信息
      let extend_lincenseList = billInfo[sy_zz];
      if (extend_lincenseList) {
        for (let i = 0; i < extend_lincenseList.length; i++) {
          let lincenseInfo = {};
          //有效期至
          lincenseInfo.endDate = extend_lincenseList[i].licenseEndDate;
          //行备注
          //证照名称
          lincenseInfo.license = extend_lincenseList[i].license;
          //证照号码
          lincenseInfo.lincenseNumber = extend_lincenseList[i].licenseNo;
          //证照名称
          lincenseInfo.licenseName = extend_lincenseList[i].licenseName;
          lincenseInfo.customerCode = extend_lincenseList[i].customer_code;
          lincenseInfo.customerName = extend_lincenseList[i].customer_name;
          //授权类型
          lincenseInfo.authType = extend_lincenseList[i].authType;
          //发证机关
          lincenseInfo.issuingAuthority = extend_lincenseList[i].licenseGiver;
          //发证日期
          lincenseInfo.beginDate = extend_lincenseList[i].licenseBeginDate;
          //显示用证照
          let get_license_sub_res = extend_lincenseList[i][sy_zz_fw];
          let customerLicenseRangeList = [];
          if (typeof get_license_sub_res != "undefined") {
            for (let j = 0; j < get_license_sub_res.length; j++) {
              let licenseRangeInfo = {};
              licenseRangeInfo.material = get_license_sub_res[j].extend_pro_auth_type;
              licenseRangeInfo.materialName = get_license_sub_res[j].materialName;
              licenseRangeInfo.materialCode = get_license_sub_res[j].materialCode;
              licenseRangeInfo.sku = get_license_sub_res[j].sku;
              licenseRangeInfo.skuCode = get_license_sub_res[j].skuCode;
              licenseRangeInfo.skuName = get_license_sub_res[j].skuName;
              licenseRangeInfo.materialType = get_license_sub_res[j].extend_protype_auth_type;
              licenseRangeInfo.materialTypeName = get_license_sub_res[j].materialTypeName;
              licenseRangeInfo.dosageForm = get_license_sub_res[j].extend_dosage_auth_type;
              licenseRangeInfo.dosageFormName = get_license_sub_res[j].dosageName;
              licenseRangeInfo.listingPermitHolder = get_license_sub_res[j].listingPermitHolder;
              licenseRangeInfo.listingPermitHolderName = get_license_sub_res[j].listingPermitHolderName;
              licenseRangeInfo.customerCode = get_license_sub_res[j].customerCode;
              licenseRangeInfo.customerName = get_license_sub_res[j].customerName;
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
          //委托人类型
          authInfo.clientType = authInfos[i].wtrlx;
          //人员
          authInfo.salesman = authInfos[i].kh_saleman;
          authInfo.salesmanName = authInfos[i].saleman;
          //授权开始日期
          authInfo.startDate = authInfos[i].sqbegindate;
          //授权结束日期
          authInfo.endDate = authInfos[i].sqenddate;
          //是否默认
          //职务
          authInfo.post = authInfos[i].post;
          //授权类型
          authInfo.authType = authInfos[i].sqtype;
          //授权地域
          //是否禁用
          //身份证号
          authInfo.idCard = authInfos[i].identityno;
          //联系电话
          let get_auth_sub_res = authInfos[i][sy_sq_fw];
          let authRangeList = [];
          if (typeof get_auth_sub_res != "undefined") {
            for (let j = 0; j < get_auth_sub_res.length; j++) {
              let authRangeInfo = {};
              authRangeInfo._status = "Insert";
              authRangeInfo.material = get_auth_sub_res[j].extend_pro_auth_type;
              authRangeInfo.materialCode = get_auth_sub_res[j].materialCode;
              authRangeInfo.materialName = get_auth_sub_res[j].materialName;
              authRangeInfo.sku = get_auth_sub_res[j].sku;
              authRangeInfo.skuCode = get_auth_sub_res[j].skuCode;
              authRangeInfo.skuName = get_auth_sub_res[j].skuName;
              authRangeInfo.materialType = get_auth_sub_res[j].extend_protype_auth_type;
              authRangeInfo.materialTypeName = get_auth_sub_res[j].materialTypeName;
              authRangeInfo.dosageForm = get_auth_sub_res[j].extend_dosage_auth_type;
              authRangeInfo.dosageFormName = get_auth_sub_res[j].dosageName;
              authRangeInfo.customerCode = get_auth_sub_res[j].customerCode;
              authRangeInfo.customerName = get_auth_sub_res[j].customerName;
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
        customer: billInfo.customer,
        firstMarketingBillno: billInfo.code,
        firstMarketingDate: billInfo.applydate,
        //审核状态
        firstMarketingStatus: "1",
        gspCertificate: getSwitchValue(billInfo.isgsp1),
        //印章及随货同行票样
        specimenOfSeal: getSwitchValue(billInfo.xgyz1),
        //采购委托书
        powerAttorney: getSwitchValue(billInfo.caigouweituoshu1),
        //企业税务登记证
        taxRegistrationCertify: getSwitchValue(billInfo.qyswdjz1),
        //购销员上岗证
        purchAndSalesStaff: getSwitchValue(billInfo.gxysgz1),
        //质量保证协议
        qualityAssurAgreement: getSwitchValue(billInfo.zlbzxy1),
        //购销员身份证
        certifyPurchSalesPerson: getSwitchValue(billInfo.gxysfz1),
        //组织机构代证
        orgCodeCertify: getSwitchValue(billInfo.zzjgdz1),
        //药品经营企业许可证
        handlingEnterpriseLicense: getSwitchValue(billInfo.yaopinjingyingqiyexukezheng),
        //购销合同
        purchSaleContract: getSwitchValue(billInfo.gxht),
        //年度报告
        annualReport: getSwitchValue(billInfo.ndbg),
        //客户分类
        customerType: billInfo.customertype,
        customerTypeName: billInfo.customerTypeName,
        //电子监管编码
        electronicSupervisionCode: billInfo.electron_supervision_code,
        //质量保证体系
        qualitySystem: billInfo.qualitysystem
        //重要证号
        //销售状态
      };
      updateJson[lic_zz] = customerLicenseList;
      updateJson[lic_sq] = authList;
      updateJson[lic_rep] = reportInfo;
      var res = ObjectStore.insert("GT22176AT10.GT22176AT10.sy01_customers_file", updateJson, "783ebe4e");
      update(billInfo);
      return {};
    } else {
      let customerInfo = {};
      var billObj = {
        id: param.data[0].id,
        compositions: [
          {
            name: "SY01_khbgsp_xgzzList",
            compositions: [
              {
                name: "SY01_khbgsp_xgzz_fwList"
              }
            ]
          },
          {
            name: "SY01_khbgsp_sqwtsList",
            compositions: [
              {
                name: "SY01_khbgsp_sqwts_lList"
              }
            ]
          },
          {
            name: "sy01_customer_other_reportList"
          }
        ]
      };
      //实体查询
      var billInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_firstcampcusv3", billObj);
      let apiResponse = extrequire("GT22176AT10.publicFunction.queryMerchantInfor").execute({ code: billInfo.customer_bill_no, orgId: billInfo.org_id });
      customerInfo = apiResponse.merchantInfo;
      let merchantAddressInfos = [];
      if (typeof customerInfo.merchantAddressInfos != "undefined") {
        for (let i = 0; i < customerInfo.merchantAddressInfos.length; i++) {
          merchantAddressInfos.push({
            id: customerInfo.merchantAddressInfos[i].id,
            addressCode: customerInfo.merchantAddressInfos[i].addressCode,
            isDefault: customerInfo.merchantAddressInfos[i].isDefault,
            _status: "Update"
          });
        }
      }
      let merchantContacterInfos = [];
      if (typeof customerInfo.merchantContacterInfos != "undefined") {
        for (let i = 0; i < customerInfo.merchantContacterInfos.length; i++) {
          merchantContacterInfos.push({
            id: customerInfo.merchantContacterInfos[i].id,
            fullName: customerInfo.merchantContacterInfos[i].fullName,
            isDefault: customerInfo.merchantContacterInfos[i].isDefault,
            _status: "Update"
          });
        }
      }
      let merchantAgentFinancialInfos = [];
      if (typeof customerInfo.merchantAgentFinancialInfos != "undefined") {
        for (let i = 0; i < customerInfo.merchantAgentFinancialInfos.length; i++) {
          merchantAgentFinancialInfos.push({
            id: customerInfo.merchantAgentFinancialInfos[i].id,
            country: customerInfo.merchantAgentFinancialInfos[i].country,
            currency: customerInfo.merchantAgentFinancialInfos[i].currency,
            accountType: customerInfo.merchantAgentFinancialInfos[i].accountType,
            bank: customerInfo.merchantAgentFinancialInfos[i].bank,
            openBank: customerInfo.merchantAgentFinancialInfos[i].openBank,
            bankAccountName: customerInfo.merchantAgentFinancialInfos[i].bankAccountName,
            isDefault: customerInfo.merchantAgentFinancialInfos[i].isDefault,
            _status: "Update"
          });
        }
      }
      let merchantAgentInvoiceInfos = [];
      if (typeof customerInfo.merchantAgentInvoiceInfos != "undefined") {
        for (let i = 0; i < customerInfo.merchantAgentInvoiceInfos.length; i++) {
          merchantAgentInvoiceInfos.push({
            id: customerInfo.merchantAgentInvoiceInfos[i].id,
            billingType: customerInfo.merchantAgentInvoiceInfos[i].billingType,
            title: customerInfo.merchantAgentInvoiceInfos[i].title,
            isDefault: customerInfo.merchantAgentInvoiceInfos[i].isDefault,
            _status: "Update"
          });
        }
      }
      let merchantCorpImages = [];
      if (typeof customerInfo.merchantCorpImages != "undefined") {
        for (let i = 0; i < customerInfo.merchantCorpImages.length; i++) {
          merchantCorpImages.push({
            id: customerInfo.merchantCorpImages[i].id,
            _status: "Update"
          });
        }
      }
      let merchantAttachments = [];
      if (typeof customerInfo.merchantAttachments != "undefined") {
        for (let i = 0; i < customerInfo.merchantAttachments.length; i++) {
          merchantAttachments.push({
            id: customerInfo.merchantAttachments[i].id,
            _status: "Update"
          });
        }
      }
      let customerLicenseList = [];
      //获取证照信息
      const get_license_sql = "select * from GT22176AT10.GT22176AT10.SY01_sykhsp_xgzz where SY01_fckhspdId =" + param.data[0].id;
      let extend_lincenseList = ObjectStore.queryByYonQL(get_license_sql);
      if (extend_lincenseList) {
        for (let i = 0; i < extend_lincenseList.length; i++) {
          let lincenseInfo = {};
          lincenseInfo._status = "Insert";
          //有效期至
          lincenseInfo.extend_yxqz = extend_lincenseList[i].licenseEndDate;
          //行备注
          lincenseInfo.extend_hbz = extend_lincenseList[i].entryRemark;
          //证照名称
          lincenseInfo.extend_zzmc = extend_lincenseList[i].license;
          //证照号码
          lincenseInfo.extend_zzhm = extend_lincenseList[i].licenseNo;
          //授权类型
          lincenseInfo.extend_sqlx = extend_lincenseList[i].authType;
          //发证机关
          lincenseInfo.extend_fzjg = extend_lincenseList[i].licenseGiver;
          //发证日期
          lincenseInfo.extend_fzrq = extend_lincenseList[i].licenseBeginDate;
          //显示用证照
          lincenseInfo.extend_xszz = extend_lincenseList[i].isLicenseDisplay;
          const get_license_sub_sql = "select * from GT22176AT10.GT22176AT10.SY01_sykhsp_xgzz_fw where SY01_sykhsp_xgzzv3_id =" + extend_lincenseList[i].id;
          let get_license_sub_res = ObjectStore.queryByYonQL(get_license_sub_sql);
          let customerLicenseRangeList = [];
          if (typeof get_license_sub_res != "undefined") {
            for (let j = 0; j < get_license_sub_res.length; j++) {
              let licenseRangeInfo = {};
              licenseRangeInfo._status = "Insert";
              licenseRangeInfo.extend_pro_auth_type = get_license_sub_res[j].extend_pro_auth_type;
              licenseRangeInfo.extend_protype_auth_type = get_license_sub_res[j].extend_protype_auth_type;
              licenseRangeInfo.extend_dosage_auth_type = get_license_sub_res[j].extend_dosage_auth_type;
              customerLicenseRangeList.push(licenseRangeInfo);
            }
            lincenseInfo.sy01_kh_xgzz_fwList = customerLicenseRangeList;
            customerLicenseList.push(lincenseInfo);
          }
        }
      }
      let authList = [];
      //获取授权表格
      const get_auth_sql = "select * from 	GT22176AT10.GT22176AT10.SY01_sykhsp_poav where SY01_fccuspaudit_id =" + param.data[0].id;
      let authInfos = ObjectStore.queryByYonQL(get_auth_sql);
      if (typeof authInfos != "undefined") {
        for (let i = 0; i < authInfos.length; i++) {
          let authInfo = {};
          authInfo._status = "Insert";
          //委托人类型
          authInfo.extend_wtrlx = authInfos[i].wtrlx;
          //人员
          authInfo.extend_ywy = authInfos[i].kh_saleman;
          //授权开始日期
          authInfo.extend_sqksrq = authInfos[i].sqbegindate;
          //授权结束日期
          authInfo.extend_sqjsrq = authInfos[i].sqenddate;
          //是否默认
          authInfo.extend_sfmr = authInfos[i].isdefault;
          //职务
          authInfo.extend_zw = authInfos[i].post;
          //授权类型
          authInfo.extend_sqlx = authInfos[i].sqtype;
          //授权地域
          authInfo.extend_sqdy = authInfos[i].sqarea;
          //是否禁用
          authInfo.extend_sfjy = authInfos[i].isban;
          //身份证号
          authInfo.extend_identityno = authInfos[i].identityno;
          //联系电话
          authInfo.extend_phone = authInfos[i].phone;
          const get_auth_sub_sql = "select * from GT22176AT10.GT22176AT10.SY01_poal_sqwt_s where SY01_poavv2_id =" + authInfos[i].id;
          let get_auth_sub_res = ObjectStore.queryByYonQL(get_auth_sub_sql);
          let authRangeList = [];
          if (typeof get_auth_sub_res != "undefined") {
            for (let j = 0; j < get_auth_sub_res.length; j++) {
              let authRangeInfo = {};
              authRangeInfo._status = "Insert";
              authRangeInfo.extend_pro_auth_type = get_auth_sub_res[j].extend_pro_auth_type;
              authRangeInfo.extend_protype_auth_type = get_auth_sub_res[j].extend_protype_auth_type;
              authRangeInfo.extend_dosage_auth_type = get_auth_sub_res[j].extend_dosage_auth_type;
              authRangeList.push(authRangeInfo);
            }
            authInfo.sy01_khsqwts_sqfwList = authRangeList;
            authList.push(authInfo);
          }
        }
      }
      let reportInfo = [];
      let sy_report = billInfo.sy01_customer_other_reportList;
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
      customerInfo.merchantAppliedDetail._status = "Update";
      let updateJson = {
        data: {
          id: customerInfo.id,
          createOrg: customerInfo.createOrg,
          code: customerInfo.code,
          merchantAppliedDetail: customerInfo.merchantAppliedDetail,
          taxPayingCategories: customerInfo.taxPayingCategories,
          customerClass: customerInfo.customerClass,
          merchantOptions: customerInfo.merchantOptions,
          enterpriseNature: customerInfo.enterpriseNature,
          merchantAddressInfos: merchantAddressInfos,
          merchantContacterInfos: merchantContacterInfos,
          merchantAgentFinancialInfos: merchantAgentFinancialInfos,
          merchantAgentInvoiceInfos: merchantAgentInvoiceInfos,
          merchantCorpImages: merchantCorpImages,
          merchantAttachments: merchantAttachments,
          _status: "Update",
          extend_syno: billInfo.code,
          extend_syrq: billInfo.applydate,
          //审核状态
          extend_syzt: "1",
          extend_is_gsp: billInfo.isgsp1,
          //印章及随货同行票样
          extend_xgyz: billInfo.xgyz1,
          //采购委托书
          extend_caigouweituoshu: billInfo.caigouweituoshu1,
          //企业税务登记证
          extend_qyswdjz: billInfo.qyswdjz1,
          //购销员上岗证
          extend_gxysgz: billInfo.gxysgz1,
          //质量保证协议
          extend_zlbzxy: billInfo.zlbzxy1,
          //购销员身份证
          extend_gxysfz: billInfo.gxysfz1,
          //组织机构代证
          extend_zzjgdz: billInfo.zzjgdz1,
          //药品经营企业许可证
          extend_ypjyqyxkz: billInfo.yaopinjingyingqiyexukezheng,
          //购销合同
          extend_gxht: billInfo.gxht,
          //年度报告
          extend_ndbg: billInfo.ndbg,
          //是否GSP
          extend_isgsp: true,
          //首营申请部门
          extend_sysqbm: billInfo.applydep,
          //首营申请人
          extend_sysqr: billInfo.applier,
          //客户分类
          extend_khfl: billInfo.customertype,
          //电子监管编码
          extend_dzjgbm: billInfo.electron_supervision_code,
          //质量保证体系
          extend_zlbztx: billInfo.qualitysystem,
          //重要证号
          extend_zyzz: billInfo.importantlicense,
          //销售状态
          extend_xszt: billInfo.xszt,
          sy01_kh_xgzzList: customerLicenseList,
          sy01_khsqwtsList: authList,
          sy01_kh_other_reportList: reportInfo
        }
      };
      apiResponse = extrequire("GT22176AT10.publicFunction.saveMerchant").execute(updateJson);
      return {};
    }
  }
}
exports({
  entryPoint: MyTrigger
});