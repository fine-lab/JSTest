let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //判断诊疗范围方法
    let isHasTreatmentDx = function (materialTreatmentRange, customerTreatmentRange) {
      if (materialTreatmentRange.length == 0 || customerTreatmentRange.length == 0) {
        return false;
      }
      let str1 = "";
      let str2 = "";
      for (let i = 0; i < materialTreatmentRange.length; i++) {
        for (let j = 0; j < customerTreatmentRange.length; j++) {
          str1 = materialTreatmentRange[i].path;
          str2 = customerTreatmentRange[j];
          if (str1.indexOf(str2) == 0 || str2.indexOf(str1) == 0) {
            return true;
          }
        }
      }
      return false;
    };
    let orgId = request.orgId;
    let agentId = request.agentId;
    let extendCustomSalesman = request.extendCustomSalesman;
    let materialId = request.materialId;
    let materialName = request.materialName;
    let settlementOrgId = request.settlementOrgId;
    let skuId = request.skuId;
    let skuName = request.skuName;
    let rowNo = request.rowNo;
    let corpContact = request.corpContact;
    let productCode = request.productCode;
    let skuCode = request.skuCode;
    let characteristics = request.orderDetailCharacteristics;
    let listHeadCustomSalesman = request.listHeadCustomSalesman;
    let batchNo = request.batchNo;
    if (typeof batchNo != "undefined" && batchNo != null) {
      let batchSql = "select stockStatusDoc.statusName as statusName from stock.currentstock.CurrentStock where productn ='" + materialId + "' AND batchno= '" + batchNo + "' ";
      let batch_res = ObjectStore.queryByYonQL(batchSql, "ustock");
      if (typeof batch_res != "undefined" && batch_res != null) {
        if (Array.isArray(batch_res)) {
          if (batch_res.length > 0) {
            if (batch_res[0].statusName != "合格") {
              throw new Error(materialName + "的物料" + batchNo + "批号的库存状态非合格\r\n");
            }
          }
        }
      }
    }
    let rowNoInfor = "第" + rowNo + "行：";
    //特药限销
    let gspLimitparameterRequest = {
      orgId: orgId,
      operator: corpContact,
      productId: materialId,
      productName: materialName,
      productsku: skuId,
      productskuName: skuName,
      type: "2",
      rowno: rowNo
    };
    let gspLimitFun = extrequire("GT22176AT10.publicFunction.validateLimit");
    let gspLimitFunRe = gspLimitFun.execute(gspLimitparameterRequest);
    if (gspLimitFunRe.info != "") {
      throw new Error(gspLimitFunRe.info);
    }
    let parameterRequest = { saleorgid: settlementOrgId };
    let gspParametersFun = extrequire("GT22176AT10.publicFunction.getGspParameters");
    let orgParameter = gspParametersFun.execute(parameterRequest);
    if (orgParameter.gspParameterArray.length == 0) {
      return { res: true };
    }
    let isgspzz = orgParameter.gspParameterArray[0].isgspzz;
    let poacontrol = orgParameter.gspParameterArray[0].poacontrol;
    let approvalValidity = orgParameter.gspParameterArray[0].approvalValidity;
    let factorytrol = orgParameter.gspParameterArray[0].check_factory;
    if (!isgspzz && poacontrol != "1") {
      return { res: true };
    }
    let agentIdRequest = { customerId: agentId, orgId: settlementOrgId };
    let agentIdFun = extrequire("GT22176AT10.publicFunction.getCusLicInfo");
    let agent = agentIdFun.execute(agentIdRequest);
    if (agent.cusLicInfo == null) {
      throw new Error("客户未首营\r\n");
    }
    let customerInfor = agent.cusLicInfo;
    if (customerInfor.saleState != undefined && customerInfor.saleState == "2") {
      throw new Error("该客户已被停止销售\r\n");
    }
    let sql = "";
    let prodInfor;
    sql =
      "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = " +
      settlementOrgId +
      " and material = " +
      materialId +
      " and firstBattalionStatus = '1' and dr = 0 and enable = '1' order by id desc";
    prodInfor = ObjectStore.queryByYonQL(sql);
    if (prodInfor.length == 0) {
      throw new Error(rowNoInfor + "[" + materialName + "] 未首营\r\n");
    }
    let sytype = prodInfor[0].isSku; //0：物料；1：物料+sku; 2:物料+特征；
    //按照物料+sku首营逻辑判断
    if (sytype == "1") {
      sql =
        "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = " +
        settlementOrgId +
        " and material = " +
        materialId +
        " and firstBattalionStatus = '1' and dr = 0 and enable = '1' and materialSkuCode = '" +
        skuId +
        "'";
      prodInfor = ObjectStore.queryByYonQL(sql);
      if (prodInfor.length == 0) {
        throw new Error(rowNoInfor + "sku[" + skuName + "] 未首营\r\n");
      }
    }
    let factory = prodInfor[0].factory;
    if (factory != null && factorytrol == "1") {
      let obj = {
        id: factory,
        compositions: [
          {
            name: "yy_factory_reportList",
            compositions: [
              {
                name: "yy_factory_report_scopeList"
              }
            ]
          }
        ]
      };
      let yyFactoryInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.yyFactory", obj, "", "sy01");
      let reportList = yyFactoryInfo.yy_factory_reportList;
      for (let i = 0; i < reportList.length; i++) {
        let end_date = reportList[i].end_date;
        if (new Date(end_date) < new Date()) {
          throw new Error(rowNoInfor + "生产厂商证照有效期已经过期，不允许采购！");
        }
      }
    }
    let m_keyfieldArray = [];
    let m_keyfieldValue = [];
    let currentTZMap = new Map();
    if (sytype == "2") {
      //按照物料 + 特征逻辑判断
      //查询当前商品GSP特征敏感项编码公共方法。
      let gspkeyparams = { materialId: materialId };
      let gspkeyfieldsfun = extrequire("GT22176AT10.publicFunction.getGSPKeyFields");
      let keyfields = gspkeyfieldsfun.execute(gspkeyparams);
      let nullSenceFeatureStr = "",
        featureCondition = "",
        featureTip = "";
      for (let f = 0; f < keyfields.fields.length; f++) {
        let keyfield = keyfields.fields[f];
        if (keyfield != undefined && keyfield != null && keyfield != "") {
          let keyfieldname = keyfield.featureCode + "_name";
          let mathFlag = false;
          for (let key in characteristics) {
            if (key == keyfieldname) {
              mathFlag = true;
              let keyvalue = characteristics[key];
              if (keyvalue == null) {
                nullSenceFeatureStr = nullSenceFeatureStr + keyfield.featureName + ";";
              }
              featureCondition = featureCondition + " and freeCTH." + keyfield.featureCode + " = '" + characteristics[keyfield.featureCode] + "'";
              featureTip = featureTip + keyfield.featureName + ":" + keyvalue + ";";
              currentTZMap.set(keyfieldname, keyvalue);
              m_keyfieldArray.push(keyfieldname);
              m_keyfieldValue.push(keyvalue);
            }
          }
          if (!mathFlag) {
            nullSenceFeatureStr = nullSenceFeatureStr + keyfield.featureName + ";";
          }
        }
      }
      if (keyfields.fields.length > 0 && nullSenceFeatureStr != "") {
        throw new Error(rowNoInfor + "物料【" + materialName + "】首营方式为：物料+特征, 敏感特征项【" + nullSenceFeatureStr + "】必须录入,请确认！\n\r");
      }
      sql =
        "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = " +
        settlementOrgId +
        " and material = " +
        materialId +
        " and firstBattalionStatus = '1' and dr = 0 and enable = '1' " +
        featureCondition;
      prodInfor = ObjectStore.queryByYonQL(sql);
      if (prodInfor.length == 0) {
        throw new Error(rowNoInfor + "物料【" + materialName + "】敏感特征项【" + featureTip + "】 未首营\r\n");
      }
    }
    //校验批文有效期是否过期
    if (approvalValidity == 1 && new Date(prodInfor[0].approvalValidityDate) < new Date()) {
      throw new Error(rowNoInfor + "商品批文有效期已经过期，不允许采购！");
    }
    //校验GSP商品档案表体的有效期至
    let materialInfoFileEntry = [];
    if (sytype == 0 || sytype == "0") {
      let infoRes = extrequire("GT22176AT10.publicFunction.getProLicInfo").execute({ orgId: settlementOrgId, materialId: materialId });
      materialInfoFileEntry = infoRes.proLicInfo.SY01_material_file_childList;
    } else if (sytype == 1 || sytype == "1") {
      let infoRes = extrequire("GT22176AT10.publicFunction.getProSkuLicInfo").execute({ orgId: settlementOrgId, materialId: materialId, sku: skuId });
      materialInfoFileEntry = infoRes.proLicInfo.SY01_material_file_childList;
    } else if (sytype == 2 || sytype == "2") {
      let infoRes = extrequire("GT22176AT10.publicFunction.getProFeaLicInfo").execute({ orgId: settlementOrgId, materialId: materialId, feature: characteristics });
      materialInfoFileEntry = infoRes.proLicInfo.SY01_material_file_childList;
    }
    if (approvalValidity == 1) {
      if (materialInfoFileEntry.length != 0) {
        let materialFileEntryDateMap = {};
        for (let i = 0; i < materialInfoFileEntry.length; i++) {
          let reportId = materialInfoFileEntry[i].qualifyReport;
          let reportExpireDate = materialInfoFileEntry[i].validUntil;
          //如果有效期没有填写，不考虑其中情况
          if (reportExpireDate == undefined) {
            continue;
          } else {
            if (!materialFileEntryDateMap.hasOwnProperty(reportId)) {
              materialFileEntryDateMap[reportId] = reportExpireDate;
            } else {
              //如果新的日期，比已经存入的大，则取而代之
              if (new Date(reportExpireDate) > new Date(materialFileEntryDateMap[reportId])) {
                materialFileEntryDateMap[reportId] = reportExpireDate;
              }
            }
          }
        }
        let licenseFileIdArray = [];
        //判断日期
        for (let key in materialFileEntryDateMap) {
          if (new Date(materialFileEntryDateMap[key]) < new Date()) {
            licenseFileIdArray.push(key);
          }
        }
        if (licenseFileIdArray.length > 0) {
          let selectLicenseFileNameSql = "select name from GT22176AT10.GT22176AT10.sy01_other_report where id in (" + licenseFileIdArray.join(",") + ")";
          let licenseNameRes = ObjectStore.queryByYonQL(selectLicenseFileNameSql, "sy01");
          let licenseFileNameArray = [];
          licenseNameRes.forEach((item) => {
            licenseFileNameArray.push(item.name);
          });
          throw new Error(rowNoInfor + "资质/报告过期，不允许采购！(GSP商品档案【" + licenseFileNameArray.join(",") + "】)");
        }
      }
    }
    //查询物料证照档案的诊疗范围多选
    let selectBGTreatmentDxSql =
      "select treatmentrangedx id,treatmentrangedx.name name,treatmentrangedx.path path from GT22176AT10.GT22176AT10.SY01_material_file_treatmentrangedx where fkid = '" + prodInfor[0].id + "'";
    let BGtreatmentDxRes = ObjectStore.queryByYonQL(selectBGTreatmentDxSql, "sy01");
    prodInfor[0].treatmentdx = BGtreatmentDxRes;
    let extend_jx = prodInfor[0].dosageForm; //剂型id
    let extend_gsp_spfl = prodInfor[0].materialType; //商品分类
    let materialSkuId = prodInfor[0].materialSkuCode; //sku id
    let treatmentrange = prodInfor[0].treatmentdx; //诊疗范围
    let d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    let vouchdate = [year, month, day].join("-");
    vouchdate = vouchdate.substring(0, 10);
    if (isgspzz) {
      let prodMap = new Map();
      let gspTyepMap = new Map();
      let drugFormMap = new Map();
      let skuMap = new Map();
      let tzMap = new Map(); //特征
      let allTypeMap = new Map();
      let treatmentrangeList = []; //诊疗范围
      if (customerInfor.sy01_customers_file_licenseList != undefined && customerInfor.sy01_customers_file_licenseList.length > 0) {
        let zzMap = new Map();
        let licenseSet = new Set();
        for (let i = 0; i < customerInfor.sy01_customers_file_licenseList.length; i++) {
          let licese = customerInfor.sy01_customers_file_licenseList[i];
          licenseSet.add(licese.licenseName);
          let liceseSub = licese.sy01_customers_file_lic_authList;
          let startDate = licese.beginDate; //证照开始时间
          let endDate = licese.endDate; //证照结束时间
          //时间字符串比较
          if (startDate == undefined || endDate == undefined) {
            throw new Error("授权委托书未填写授权日期或结束日期，请检查！");
          }
          startDate = startDate.substring(0, 10);
          endDate = endDate.substring(0, 10);
          if (vouchdate >= startDate && vouchdate <= endDate) {
            zzMap.set(licese.id, endDate);
            licenseSet.delete(licese.licenseName);
            if (licese.authType == "1" && liceseSub != null) {
              //商品
              liceseSub.forEach((item) => {
                prodMap.set(item.material, item.material);
              });
            } else if (licese.authType == "2" && liceseSub != null) {
              //商品类别
              liceseSub.forEach((item) => {
                gspTyepMap.set(item.materialType, item.materialType);
              });
            } else if (licese.authType == "3" && liceseSub != null) {
              //剂型
              liceseSub.forEach((item) => {
                drugFormMap.set(item.dosageForm, item.dosageForm);
              });
            } else if (licese.authType == "4" && liceseSub != null) {
              liceseSub.forEach((item) => {
                skuMap.set(item.sku, item.sku);
              });
            } else if (licese.authType == "5" && liceseSub != null) {
              //特征
              for (let l = 0; l < liceseSub.length; l++) {
                let featureJson = liceseSub[l].feature;
                if (materialId != liceseSub[l].material) {
                  continue;
                }
                for (let m = 0; m < m_keyfieldArray.length; m++) {
                  let itemkey = m_keyfieldArray[m];
                  if (itemkey != null && itemkey != undefined) {
                    tzMap.set(itemkey, featureJson[itemkey]);
                  }
                }
              }
            } else if (licese.authType == "10") {
              //全品类
              allTypeMap.set("all", 1);
            } else if (licese.authType == "6") {
              liceseSub.forEach((item) => {
                if (item.treatmentrangePath != undefined && item.treatmentrangePath != null && item.treatmentrangePath != "") {
                  treatmentrangeList.push(item.treatmentrangePath);
                }
              });
            }
          }
        }
        if (zzMap.size <= 0) {
          throw new Error(rowNoInfor + "客户证照【" + Array.from(licenseSet) + "】不在有效期内！物料【" + materialName + "】\r\n");
        }
      } else {
        throw new Error(rowNoInfor + "客户无物料【" + materialName + "】相关证照\r\n");
      }
      let tzcheck = false;
      for (let el of currentTZMap) {
        let key = el[0];
        let value = el[1];
        if (tzMap.has(key)) {
          let currentvalue = tzMap.get(key);
          if (value == currentvalue) {
            tzcheck = true;
            break;
          }
        } else {
          tzcheck = false;
          break;
        }
      }
      if (
        !prodMap.has(materialId) &&
        !gspTyepMap.has(extend_gsp_spfl) &&
        !drugFormMap.has(extend_jx) &&
        !skuMap.has(materialSkuId) &&
        !isHasTreatmentDx(treatmentrange, treatmentrangeList) &&
        !allTypeMap.size > 0 &&
        !tzcheck
      ) {
        throw new Error(rowNoInfor + "客户无物料【" + materialName + "】相关证照\r\n");
      }
    } //End 物料证照验证
    let saleOrderSqFlag = ObjectStore.queryByYonQL("select id,saleCheckSq from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where org_id = '" + settlementOrgId + "'", "sy01")[0].saleCheckSq;
    if (poacontrol == "1" && listHeadCustomSalesman == undefined && [1, "1"].includes(saleOrderSqFlag)) {
      throw new Error("已启用授权委托控制,表头需录入对方业务员\r\n");
    }
    if (poacontrol == "1" && extendCustomSalesman == undefined && [1, "1"].includes(saleOrderSqFlag)) {
      throw new Error(rowNoInfor + "已启用授权委托控制,需录入对方业务员\r\n");
    }
    if (poacontrol == "1" && extendCustomSalesman != undefined && [1, "1"].includes(saleOrderSqFlag)) {
      if (customerInfor.SY01_customers_file_certifyList != undefined && customerInfor.SY01_customers_file_certifyList.length > 0) {
        let prodMap = new Map();
        let gspTyepMap = new Map();
        let drugFormMap = new Map();
        let skuMap = new Map();
        let allTypeMap = new Map();
        let zzMap = new Map();
        let tzMap = new Map(); //特征
        let treatmentrangeList = []; //诊疗范围
        let licenseSet = new Set();
        let b_nothave_ywy = true;
        for (let ii = 0; ii < customerInfor.SY01_customers_file_certifyList.length; ii++) {
          let authorityScope_1 = customerInfor.SY01_customers_file_certifyList[ii];
          if (authorityScope_1.salesman == extendCustomSalesman) {
            b_nothave_ywy = false;
            break;
          }
        }
        if (b_nothave_ywy) {
          throw new Error(rowNoInfor + "对方业务员未在客户授权委托中设置\r\n");
        }
        for (let i = 0; i < customerInfor.SY01_customers_file_certifyList.length; i++) {
          let authorityScope_2 = customerInfor.SY01_customers_file_certifyList[i];
          if (authorityScope_2.salesman == extendCustomSalesman) {
            licenseSet.add(authorityScope_2.salesmanName);
          }
          let startDate = authorityScope_2.startDate; //开始时间    // new Date(authorityScope.extend_sqksrq);
          let endDate = authorityScope_2.endDate; //结束时间
          if (startDate == undefined || endDate == undefined) {
            throw new Error("授权委托书未填写授权日期或结束日期，请检查！");
          }
          startDate = startDate.substring(0, 10);
          endDate = endDate.substring(0, 10);
          if (vouchdate >= startDate && vouchdate <= endDate && authorityScope_2.salesman == extendCustomSalesman) {
            let authorityScope = customerInfor.SY01_customers_file_certifyList[i];
            let authorityScopeSub = authorityScope.SY01_customers_file_cer_authList;
            zzMap.set(authorityScope.id, endDate);
            licenseSet.delete(authorityScope_2.salesmanName);
            if (authorityScope.authType == "1" && authorityScopeSub != null) {
              //商品
              authorityScopeSub.forEach((item) => {
                prodMap.set(item.material, item.material);
              });
            } else if (authorityScope.authType == "2" && authorityScopeSub != null) {
              //商品类别
              authorityScopeSub.forEach((item) => {
                gspTyepMap.set(item.materialType, item.materialType);
              });
            } else if (authorityScope.authType == "3" && authorityScopeSub != null) {
              //剂型
              authorityScopeSub.forEach((item) => {
                drugFormMap.set(item.dosageForm, item.dosageForm);
              });
            } else if (authorityScope.authType == "4" && authorityScopeSub != null) {
              authorityScopeSub.forEach((item) => {
                skuMap.set(item.sku, item.sku);
              });
            } else if (authorityScope.authType == "5" && authorityScopeSub != null) {
              //特征
              for (let l = 0; l < authorityScopeSub.length; l++) {
                let featureJson = authorityScopeSub[l].feature;
                if (materialId != authorityScopeSub[l].material) {
                  continue;
                }
                for (let m = 0; m < m_keyfieldArray.length; m++) {
                  let itemkey = m_keyfieldArray[m];
                  if (itemkey != null && itemkey != undefined) {
                    tzMap.set(itemkey, featureJson[itemkey]);
                  }
                }
              }
            } else if (authorityScope.authType == "10") {
              //全品类
              allTypeMap.set("all", 1);
            } else if (authorityScope.authType == "6") {
              //诊疗范围
              authorityScopeSub.forEach((item) => {
                if (item.treatmentrangePath != undefined && item.treatmentrangePath != null && item.treatmentrangePath != "") {
                  treatmentrangeList.push(item.treatmentrangePath);
                }
              });
            }
          }
        }
        if (licenseSet.size > 0) {
          throw new Error(rowNoInfor + "对方业务员【" + Array.from(licenseSet) + "】授权委托不在有效期内！物料【" + materialName + "】\r\n");
        }
        let tzcheck = false;
        for (let el of currentTZMap) {
          let key = el[0];
          let value = el[1];
          if (tzMap.has(key)) {
            let currentvalue = tzMap.get(key);
            if (value == currentvalue) {
              tzcheck = true;
              break;
            }
          } else {
            tzcheck = false;
            break;
          }
        }
        if (
          !prodMap.has(materialId) &&
          !gspTyepMap.has(extend_gsp_spfl) &&
          !drugFormMap.has(extend_jx) &&
          !isHasTreatmentDx(treatmentrange, treatmentrangeList) &&
          !skuMap.has(materialSkuId) &&
          !allTypeMap.size > 0 &&
          !tzcheck
        ) {
          throw new Error(rowNoInfor + "对方业务员无物料【" + materialName + "】相关范围授权委托\r\n");
        }
      } else {
        throw new Error(rowNoInfor + "对方业务员无物料【" + materialName + "】相关范围授权委托\r\n");
      }
    }
    return { res: true };
  }
}
exports({ entryPoint: MyAPIHandler });