let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //默认新版证照方案，迁移到昊朗，改成old
    let edtion = "new";
    if (edtion == "new") {
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
      let sy_zz = "SY01_gysbgsp_xgzzList";
      let sy_zz_fw = "SY01_gysbgsp_xgzz_lList";
      let sy_sq = "SY01_gysbgsp_sqwtsList";
      let sy_sq_fw = "SY01_gysbg_sqwt_lList";
      let sy_rep = "sy01_vendor_change_reportList";
      //实体查询
      let billObj = {
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
      var billInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_supcauditv2", billObj);
      let supplierInfo = {};
      let orgId = billInfo.org_id;
      let supplierId = billInfo.supplier;
      supplierInfo = extrequire("GT22176AT10.publicFunction.getSupLicInfo").execute({ orgId, supplierId }).supLicInfo;
      let supplierLicenseList = [];
      //证照关联id
      let lincenseRelateIdArray = [];
      //证照授权范围关联id
      let lincense_fw_RelateIdArray = [];
      //获取证照信息
      let sy_lincenseList = billInfo[sy_zz];
      if (typeof sy_lincenseList != "undefined") {
        for (let i = 0; i < sy_lincenseList.length; i++) {
          let lincenseInfo = {};
          if (typeof sy_lincenseList[i].relate_id == "undefined" || sy_lincenseList[i].relate_id == "") {
            lincenseInfo._status = "Insert";
          } else {
            lincenseInfo._status = "Update";
            lincenseInfo.id = sy_lincenseList[i].relate_id;
            lincenseRelateIdArray.push(sy_lincenseList[i].relate_id);
          }
          //证照名称
          lincenseInfo.license = sy_lincenseList[i].license;
          lincenseInfo.licenseName = sy_lincenseList[i].license_name;
          //证照号码
          lincenseInfo.lincenseNumber = sy_lincenseList[i].licenseNo;
          //授权类型
          lincenseInfo.authType = sy_lincenseList[i].scope_type;
          //发证日期
          lincenseInfo.issueDate = sy_lincenseList[i].licenseBeginDate;
          //有效期至
          lincenseInfo.validUntil = sy_lincenseList[i].licenseEndDate;
          //发证机关
          lincenseInfo.issuingAuthority = sy_lincenseList[i].licenseGiver;
          //行备注
          lincenseInfo.remarks = sy_lincenseList[i].entryRemark;
          lincenseInfo.customerCode = sy_lincenseList[i].supplier_code;
          lincenseInfo.customerName = sy_lincenseList[i].supplier_name;
          //显示用证照
          let get_license_sub_res = sy_lincenseList[i][sy_zz_fw];
          let customerLicenseRangeList = [];
          for (let j = 0; j < get_license_sub_res.length; j++) {
            let licenseRangeInfo = {};
            if (typeof get_license_sub_res[j].range_relate_id == "undefined" || sy_lincenseList[i].range_relate_id == "") {
              licenseRangeInfo._status = "Insert";
            } else {
              licenseRangeInfo._status = "Update";
              licenseRangeInfo.id = get_license_sub_res[j].range_relate_id;
              lincense_fw_RelateIdArray.push(get_license_sub_res[j].range_relate_id);
            }
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
            licenseRangeInfo.listingPermitHolder = get_license_sub_res[j].listingPermitHolder;
            licenseRangeInfo.supplierCode = get_license_sub_res[j].supplierCode;
            licenseRangeInfo.supplierName = get_license_sub_res[j].supplierName;
            customerLicenseRangeList.push(licenseRangeInfo);
          }
          lincenseInfo[lic_zz_fw] = customerLicenseRangeList;
          supplierLicenseList.push(lincenseInfo);
        }
      }
      let authList = [];
      //获取授权表格
      //授权委托书关联id
      let authRelateIdArray = [];
      //授权委托书范围关联id
      let auth_fw_RelateIdArray = [];
      let authInfos = billInfo[sy_sq];
      if (typeof authInfos != "undefined") {
        for (let i = 0; i < authInfos.length; i++) {
          let authInfo = {};
          authInfo._status = "Insert";
          if (typeof authInfos[i].relate_id == "undefined" || authInfos[i].relate_id == "") {
            authInfo._status = "Insert";
          } else {
            authInfo._status = "Update";
            authInfo.id = authInfos[i].relate_id;
            authRelateIdArray.push(authInfos[i].relate_id);
          }
          //委托人类型
          authInfo.clientType = authInfos[i].entrust_type;
          //人员
          authInfo.salesman = authInfos[i].khbg_saleman;
          authInfo.salesmanName = authInfos[i].salemanName;
          //授权类型
          authInfo.authType = authInfos[i].sqtype;
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
          authInfo.supplierCode = authInfos[i].supplierCode;
          authInfo.supplierName = authInfos[i].supplierName;
          let get_auth_sub_res = authInfos[i][sy_sq_fw];
          let authRangeList = [];
          if (typeof get_auth_sub_res != "undefined") {
            for (let j = 0; j < get_auth_sub_res.length; j++) {
              let authRangeInfo = {};
              if (typeof get_auth_sub_res[j].range_relate_id == "undefined" || get_auth_sub_res[j].range_relate_id == "") {
                authRangeInfo._status = "Insert";
              } else {
                authRangeInfo._status = "Update";
                authRangeInfo.id = get_auth_sub_res[j].range_relate_id;
                auth_fw_RelateIdArray.push(get_auth_sub_res[j].range_relate_id);
              }
              authRangeInfo.material = get_auth_sub_res[j].extend_pro_auth_type;
              authRangeInfo.materialCode = get_auth_sub_res[j].materialCode;
              authRangeInfo.materalName = get_auth_sub_res[j].materialName;
              authRangeInfo.sku = get_auth_sub_res[j].sku;
              authRangeInfo.skuCode = get_auth_sub_res[j].skuCode;
              authRangeInfo.skuName = get_auth_sub_res[j].skuName;
              authRangeInfo.materialType = get_auth_sub_res[j].extend_protype_auth_type;
              authRangeInfo.materialTypeName = get_auth_sub_res[j].materialTypeName;
              authRangeInfo.dosageForm = get_auth_sub_res[j].extend_dosage_auth_type;
              authRangeInfo.dosageName = get_auth_sub_res[j].dosageName;
              authRangeInfo.supplierCode = get_auth_sub_res[j].supplierCode;
              authRangeInfo.supplierName = get_auth_sub_res[j].supplierName;
              authRangeList.push(authRangeInfo);
            }
          }
          authInfo[lic_sq_fw] = authRangeList;
          authList.push(authInfo);
        }
      }
      let supplierInfoJsonLincense = supplierInfo[lic_zz];
      if (typeof supplierInfoJsonLincense != "undefined") {
        for (let i = 0; i < supplierInfoJsonLincense.length; i++) {
          let id = supplierInfoJsonLincense[i].id;
          if (typeof lincenseRelateIdArray != "undefined") {
            for (let k = 0; k < lincenseRelateIdArray.length; k++) {
              if (id == lincenseRelateIdArray[k]) {
                supplierInfoJsonLincense[i].isNeedDelelte = false;
                continue;
              }
            }
          }
          //循环子表
          let supplierInfoJsonLincense_fw = supplierInfoJsonLincense[i][lic_zz_fw];
          if (typeof supplierInfoJsonLincense_fw != "undefined") {
            for (let j = 0; j < supplierInfoJsonLincense_fw.length; j++) {
              let fwid = supplierInfoJsonLincense_fw[j].id;
              for (let k = 0; k < lincense_fw_RelateIdArray.length; k++) {
                if (fwid == lincense_fw_RelateIdArray[k]) {
                  supplierInfoJsonLincense_fw[j].isNeedDelelte = false;
                  continue;
                }
              }
            }
          }
        }
      }
      if (typeof supplierInfoJsonLincense != "undefined") {
        for (let i = 0; i < supplierInfoJsonLincense.length; i++) {
          if (!supplierInfoJsonLincense[i].hasOwnProperty("isNeedDelelte") && supplierInfoJsonLincense[i].hasOwnProperty("id")) {
            supplierLicenseList.push({
              _status: "Delete",
              id: supplierInfoJsonLincense[i].id
            });
            continue;
          }
          //循环子表
          let supplierInfoJsonLincense_fw = supplierInfoJsonLincense[i][lic_zz_fw];
          if (typeof supplierInfoJsonLincense_fw != "undefined") {
            for (let j = 0; j < supplierInfoJsonLincense_fw.length; j++) {
              let fwid = supplierInfoJsonLincense_fw[j].id;
              if (!supplierInfoJsonLincense_fw[j].hasOwnProperty("isNeedDelelte")) {
                for (let k = 0; k < supplierLicenseList.length; k++) {
                  if (supplierInfoJsonLincense[i].id == supplierLicenseList[k].id && supplierInfoJsonLincense_fw[j].hasOwnProperty("id")) {
                    supplierLicenseList[k][lic_zz_fw].push({
                      _status: "Delete",
                      id: supplierInfoJsonLincense_fw[j].id
                    });
                  }
                }
              }
            }
          }
        }
      }
      let supplierInfoJsonAuth = supplierInfo[lic_sq];
      if (typeof supplierInfoJsonAuth != "undefined") {
        for (let i = 0; i < supplierInfoJsonAuth.length; i++) {
          let id = supplierInfoJsonAuth[i].id;
          for (let k = 0; k < authRelateIdArray.length; k++) {
            if (id == authRelateIdArray[k]) {
              supplierInfoJsonAuth[i].isNeedDelelte = false;
              continue;
            }
          }
          //循环子表
          let supplierInfoJsonAuth_fw = supplierInfoJsonAuth[i][lic_sq_fw];
          if (typeof supplierInfoJsonAuth_fw != "undefined") {
            for (let j = 0; j < supplierInfoJsonAuth_fw.length; j++) {
              let fwid = supplierInfoJsonAuth_fw[j].id;
              for (let k = 0; k < auth_fw_RelateIdArray.length; k++) {
                if (fwid == auth_fw_RelateIdArray[k]) {
                  supplierInfoJsonAuth_fw[j].isNeedDelelte = false;
                  continue;
                }
              }
            }
          }
        }
      }
      if (typeof supplierInfoJsonAuth != "undefined") {
        for (let i = 0; i < supplierInfoJsonAuth.length; i++) {
          if (!supplierInfoJsonAuth[i].hasOwnProperty("isNeedDelelte") && supplierInfoJsonAuth[i].hasOwnProperty("id")) {
            authList.push({
              _status: "Delete",
              id: supplierInfoJsonAuth[i].id
            });
            continue;
          }
          //循环子表
          let supplierInfoJsonAuth_fw = supplierInfoJsonAuth[i][lic_sq_fw];
          let fwRangeList = [];
          if (typeof supplierInfoJsonAuth_fw != "undefined") {
            for (let j = 0; j < supplierInfoJsonAuth_fw.length; j++) {
              if (!supplierInfoJsonAuth_fw[j].hasOwnProperty("isNeedDelelte")) {
                for (let k = 0; k < authList.length; k++) {
                  if (supplierInfoJsonAuth[i].id == authList[k].id && supplierInfoJsonAuth_fw[j].hasOwnProperty("id")) {
                    authList[k][lic_sq_fw].push({
                      _status: "Delete",
                      id: supplierInfoJsonAuth_fw[j].id
                    });
                  }
                }
              }
            }
          }
        }
      }
      //其他资质及证照
      let reportInfo = [];
      let sy_report = billInfo[sy_rep];
      let updateIds = [];
      if (sy_report != undefined) {
        for (let i = 0; i < sy_report.length; i++) {
          let info = {};
          if (sy_report[i].related_id == undefined || sy_report[i].related_id == "") {
            info._status = "Insert";
          } else {
            info.id = sy_report[i].related_id;
            info._status = "Update";
            updateIds.push(sy_report[i].related_id);
          }
          info.report = sy_report[i].report;
          info.reportName = sy_report[i].reportName;
          info.beginDate = sy_report[i].begin_date;
          info.endDate = sy_report[i].end_date;
          info.file = sy_report[i].file;
          reportInfo.push(info);
        }
      }
      let supplier_report = supplierInfo[lic_rep];
      if (supplier_report != undefined) {
        for (let i = 0; i < supplier_report.length; i++) {
          let isDelete = true;
          for (let j = 0; j < updateIds.length; j++) {
            if (supplier_report[i].id == updateIds[j]) {
              isDelete = false;
              break;
            }
          }
          if (isDelete) {
            reportInfo.push({ id: supplier_report[i].id, _status: "Delete" });
          }
        }
      }
      let updateJson = {
        id: supplierInfo.id,
        changeOrderNo: billInfo.code,
        changeData: billInfo.applydate,
        supplierCode: billInfo.supplierCode,
        supplierName: billInfo.suppliername,
        //供应商分类
        supplierType: billInfo.gsp_vendor_type,
        supplierTypeName: billInfo.supplierTypeName,
        purState: billInfo.extend_purchase_status,
        electronicSupervisionCode: billInfo.extend_dzjgbm,
        qualityAssuranceSystem: billInfo.qualitysystem,
        importantLicense: billInfo.importantlicense,
        //经营范围
        businessScope: billInfo.businessnature,
        gmpCertificate: getSwitchValue(billInfo.gmplicense),
        gspCertificate: getSwitchValue(billInfo.gsplicense),
        specimenOfSeal: getSwitchValue(billInfo.sealandticket),
        purchAndSalesStaff: getSwitchValue(billInfo.purandsaleondutycer),
        qualityAssurAgreement: getSwitchValue(billInfo.qualityguaagreement),
        certifyPurchSalesPerson: getSwitchValue(billInfo.purandsalecertificates),
        orgCodeCertify: getSwitchValue(billInfo.orgcertificate),
        businessLicense: getSwitchValue(billInfo.license),
        produceEnterpriseLicense: getSwitchValue(billInfo.phaproducerlicense),
        handlingEnterpriseLicense: getSwitchValue(billInfo.phamanagelicense),
        powerAttorney: getSwitchValue(billInfo.legalpersonpaper),
        purchSaleContract: getSwitchValue(billInfo.gxht),
        annualReport: getSwitchValue(billInfo.ndbg)
      };
      updateJson[lic_zz] = supplierLicenseList;
      updateJson[lic_sq] = authList;
      updateJson[lic_rep] = reportInfo;
      var res = ObjectStore.updateById("GT22176AT10.GT22176AT10.SY01_supplier_file", updateJson, "8a842e1f");
      return {};
    }
  }
}
exports({
  entryPoint: MyTrigger
});