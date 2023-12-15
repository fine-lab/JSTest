let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let customerInfor = request.customerInfor;
    let vouchdate = request.vouchdate;
    //物料证照验证
    if (request.isgspzz) {
      //查询物料信息
      let func1 = extrequire("GT22176AT10.publicFunction.getMerchantInfoById");
      let prodInfor = func1.execute(request);
      let prodId = request.materialId;
      let extend_jx = prodInfor.prodInfor;
      let extend_gsp_spfl = prodInfor.extend_gsp_spfl;
      let prodMap = new Map();
      let gspTyepMap = new Map();
      let drugFormMap = new Map();
      if (customerInfor.sy01_kh_xgzzList != undefined && customerInfor.sy01_kh_xgzzList.length > 0) {
        for (let i = 0; i < customerInfor.sy01_kh_xgzzList.length; i++) {
          let licese = customerInfor.sy01_kh_xgzzList[i];
          let liceseSub = licese.sy01_kh_xgzz_fwList;
          if (liceseSub == undefined || liceseSub.length == 0 || !(licese.extend_fzrq <= vouchdate <= licese.extend_yxqz)) {
            continue;
          }
          if (licese.extend_sqlx == "1") {
            //商品
            liceseSub.forEach((item) => {
              prodMap.set(item.extend_pro_auth_type, item.extend_pro_auth_type);
            });
          } else if (licese.extend_sqlx == "2") {
            //商品类别
            liceseSub.forEach((item) => {
              gspTyepMap.set(item.extend_protype_auth_type, item.extend_protype_auth_type);
            });
          } else if (licese.extend_sqlx == "3") {
            //剂型
            liceseSub.forEach((item) => {
              drugFormMap.set(item.extend_dosage_auth_type, item.extend_dosage_auth_type);
            });
          }
        }
      }
      if (!prodMap.has(prodId) && !gspTyepMap.has(extend_gsp_spfl) && !drugFormMap.has(extend_jx)) {
        throw new Error("客户无相应物料：" + prodInfor.name + " 相关证照");
      }
    }
    //授权范围验证
    if (request.poacontrol == "1") {
      let extendCustomSalesman = request.extendCustomSalesman;
      if (customerInfor.sy01_khsqwtsList != undefined && customerInfor.sy01_khsqwtsList.length > 0) {
        let prodMap = new Map();
        let gspTyepMap = new Map();
        let drugFormMap = new Map();
        for (let i = 0; i < customerInfor.sy01_khsqwtsList.length; i++) {
          let authorityScope = customerInfor.sy01_kh_xgzzList[i];
          let authorityScopeSub = authorityScope.sy01_khsqwts_sqfwList;
          if (
            authorityScopeSub == undefined ||
            authorityScopeSub.length == 0 ||
            !(authorityScope.extend_fzrq <= vouchdate <= authorityScope.extend_yxqz) ||
            extendCustomSalesman != authorityScopeSub.extend_ywy ||
            authorityScope.extend_sfjy == "1"
          ) {
            continue;
          }
          if (licese.extend_sqlx == "1") {
            //商品
            authorityScopeSub.forEach((item) => {
              prodMap.set(item.extend_pro_auth_type, item.extend_pro_auth_type);
            });
          } else if (licese.extend_sqlx == "2") {
            //商品类别
            authorityScopeSub.forEach((item) => {
              gspTyepMap.set(item.extend_protype_auth_type, item.extend_protype_auth_type);
            });
          } else if (licese.extend_sqlx == "3") {
            //剂型
            authorityScopeSub.forEach((item) => {
              drugFormMap.set(item.extend_dosage_auth_type, item.extend_dosage_auth_type);
            });
          }
        }
        if (!prodMap.has(prodId) && !gspTyepMap.has(extend_gsp_spfl) && !drugFormMap.has(extend_jx)) {
          throw new Error("客户无相应物料：" + prodInfor.name + "没有相关证照");
        }
      }
    }
    return { res: true };
  }
}
exports({ entryPoint: MyAPIHandler });