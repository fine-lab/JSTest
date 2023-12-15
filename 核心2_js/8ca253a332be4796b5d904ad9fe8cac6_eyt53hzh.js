let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.orgId;
    let agentId = request.agentId;
    let extendCustomSalesman = request.extendCustomSalesman;
    let materialId = request.materialId;
    let materialName = request.materialName;
    let settlementOrgId = request.settlementOrgId;
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
      throw new Error("客户未首营!");
    }
    let customerInfor = agent.cusLicInfo;
    let sql =
      "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = " + settlementOrgId + " and material = " + materialId + " and firstBattalionStatus = '1' and dr = 0 and enable = '1' ";
    let productInfo = ObjectStore.queryByYonQL(sql);
    if (productInfo.length == 0) {
      throw new Error("[" + materialName + "] 未首营");
    }
    let prodInfor = productInfo[0];
    let extend_jx = prodInfor.dosageForm; //剂型id
    let extend_gsp_spfl = prodInfor.materialType; //商品分类
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
      if (customerInfor.sy01_customers_file_licenseList != undefined && customerInfor.sy01_customers_file_licenseList.length > 0) {
        let zzMap = new Map();
        for (let i = 0; i < customerInfor.sy01_customers_file_licenseList.length; i++) {
          let licese = customerInfor.sy01_customers_file_licenseList[i];
          let liceseSub = licese.sy01_customers_file_lic_authList;
          let startDate = licese.beginDate; //证照开始时间
          let endDate = licese.endDate; //证照结束时间
          //时间字符串比较
          startDate = startDate.substring(0, 10);
          endDate = endDate.substring(0, 10);
          if (vouchdate >= startDate && vouchdate <= endDate) {
            zzMap.set(licese.id, endDate);
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
            }
          }
        }
        if (zzMap.size <= 0) {
          throw new Error("客户不在证照有效期内！物料【" + prodInfor.name + "】");
        }
      } else {
        throw new Error("客户无物料【" + materialName + "】相关证照");
      }
      if (!prodMap.has(materialId) && !gspTyepMap.has(extend_gsp_spfl) && !drugFormMap.has(extend_jx)) {
        throw new Error("客户无物料【" + materialName + "】相关证照");
      }
    } //End 物料证照验证
    if (poacontrol == "1" && extendCustomSalesman == undefined) {
      throw new Error("已启用授权委托控制,需录入对方业务员！");
    }
    if (poacontrol == "1" && extendCustomSalesman != undefined) {
      if (customerInfor.SY01_customers_file_certifyList != undefined && customerInfor.SY01_customers_file_certifyList.length > 0) {
        let prodMap = new Map();
        let gspTyepMap = new Map();
        let drugFormMap = new Map();
        let zzMap = new Map();
        let b_nothave_ywy = true;
        for (let ii = 0; ii < customerInfor.SY01_customers_file_certifyList.length; ii++) {
          let authorityScope_1 = customerInfor.SY01_customers_file_certifyList[ii];
          if (authorityScope_1.salesman == extendCustomSalesman) {
            b_nothave_ywy = false;
            break;
          }
        }
        if (b_nothave_ywy) {
          throw new Error("对方业务员未在客户授权委托中设置！");
        }
        for (let i = 0; i < customerInfor.SY01_customers_file_certifyList.length; i++) {
          let authorityScope_2 = customerInfor.SY01_customers_file_certifyList[i];
          let startDate = authorityScope_2.startDate; //开始时间    // new Date(authorityScope.extend_sqksrq);
          let endDate = authorityScope_2.endDate; //结束时间
          startDate = startDate.substring(0, 10);
          endDate = endDate.substring(0, 10);
          if (vouchdate >= startDate && vouchdate <= endDate) {
            let authorityScope = customerInfor.SY01_customers_file_certifyList[i];
            let authorityScopeSub = authorityScope.SY01_customers_file_cer_authList;
            zzMap.set(authorityScope.id, endDate);
            if (authorityScope.salesman == extendCustomSalesman) {
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
              }
            }
          }
        }
        if (zzMap.size <= 0) {
          throw new Error("对方业务员不在授权委托期内！物料【" + materialName + "】");
        }
        if (!prodMap.has(materialId) && !gspTyepMap.has(extend_gsp_spfl) && !drugFormMap.has(extend_jx)) {
          throw new Error("对方业务员无物料【" + materialName + "】相关范围授权委托");
        }
      } else {
        throw new Error("对方业务员无物料【" + materialName + "】相关范围授权委托");
      }
    }
    return { res: true };
  }
}
exports({ entryPoint: MyAPIHandler });