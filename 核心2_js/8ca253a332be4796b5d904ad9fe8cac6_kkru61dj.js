let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
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
    if (productCode == skuCode || skuCode == undefined || skuCode == "") {
      sql =
        "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = " +
        settlementOrgId +
        " and material = " +
        materialId +
        " and firstBattalionStatus = '1' and dr = 0 and enable = '1' and materialSkuCode is null ";
    } else {
      sql =
        "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = " +
        settlementOrgId +
        " and material = " +
        materialId +
        " and firstBattalionStatus = '1' and dr = 0 and enable = '1' and materialSkuCode = '" +
        skuId +
        "'";
    }
    let prodInfor = ObjectStore.queryByYonQL(sql);
    if (prodInfor.length == 0) {
      if (productCode == skuCode || skuCode == undefined) {
        throw new Error(rowNoInfor + "[" + materialName + "] 未首营\r\n");
      } else {
        //当选开启的sku时，查询对应物料（非sku）是否首营
        let prodSql =
          "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = " +
          settlementOrgId +
          " and material = " +
          materialId +
          " and firstBattalionStatus = '1' and dr = 0 and enable = '1' and materialSkuCode is null ";
        prodInfor = ObjectStore.queryByYonQL(prodSql);
        if (prodInfor.length == 0) {
          throw new Error(rowNoInfor + "sku[" + skuName + "] 未首营\r\n");
        }
      }
    }
    var extend_jx = prodInfor[0].dosageForm; //剂型id
    let extend_gsp_spfl = prodInfor[0].materialType; //商品分类
    let materialSkuId = prodInfor[0].materialSkuCode; //sku id
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
      let allTypeMap = new Map();
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
            } else if (licese.authType == "10") {
              //全品类
              allTypeMap.set("all", 1);
            }
          }
        }
        if (zzMap.size <= 0) {
          throw new Error(rowNoInfor + "客户证照【" + Array.from(licenseSet) + "】不在有效期内！物料【" + materialName + "】\r\n");
        }
      } else {
        throw new Error(rowNoInfor + "客户无物料【" + materialName + "】相关证照\r\n");
      }
      if (!prodMap.has(materialId) && !gspTyepMap.has(extend_gsp_spfl) && !drugFormMap.has(extend_jx) && !skuMap.has(materialSkuId) && !allTypeMap.size > 0) {
        throw new Error(rowNoInfor + "客户无物料【" + materialName + "】相关证照\r\n");
      }
    } //End 物料证照验证
    if (poacontrol == "1" && extendCustomSalesman == undefined) {
      throw new Error(rowNoInfor + "已启用授权委托控制,需录入对方业务员\r\n");
    }
    if (poacontrol == "1" && extendCustomSalesman != undefined) {
      if (customerInfor.SY01_customers_file_certifyList != undefined && customerInfor.SY01_customers_file_certifyList.length > 0) {
        let prodMap = new Map();
        let gspTyepMap = new Map();
        let drugFormMap = new Map();
        let skuMap = new Map();
        let allTypeMap = new Map();
        let zzMap = new Map();
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
            } else if (authorityScope.authType == "10") {
              //全品类
              allTypeMap.set("all", 1);
            }
          }
        }
        if (licenseSet.size > 0) {
          throw new Error(rowNoInfor + "对方业务员【" + Array.from(licenseSet) + "】授权委托不在有效期内！物料【" + materialName + "】\r\n");
        }
        if (!prodMap.has(materialId) && !gspTyepMap.has(extend_gsp_spfl) && !drugFormMap.has(extend_jx) && !skuMap.has(materialSkuId) && !allTypeMap.size > 0) {
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