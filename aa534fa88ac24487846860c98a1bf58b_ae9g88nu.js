let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let customerInfor = request.customerInfor;
    if (customerInfor == undefined || customerInfor == "") {
      throw new Error("查询客户档案接口出错！");
    }
    let d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    let vouchdate = [year, month, day].join("-");
    vouchdate = vouchdate.substring(0, 10);
    let productId = request.materialId;
    let sql = "select * from pc.product.Product where id=" + productId;
    let productInfo = ObjectStore.queryByYonQL(sql, "productcenter");
    let prodInfor = productInfo[0];
    if (prodInfor.extend_is_gsp != "true" && prodInfor.extend_is_gsp != "1") {
      throw new Error("商品[" + prodInfor.name + "] 非GSP类型");
    }
    let prodId = request.materialId; //商品id
    let extend_jx = prodInfor.extend_jx; //剂型id
    let extend_gsp_spfl = prodInfor.extend_gsp_spfl; //商品分类
    if (request.isgspzz) {
      let prodMap = new Map();
      let gspTyepMap = new Map();
      let drugFormMap = new Map();
      if (customerInfor.sy01_kh_xgzzList != undefined && customerInfor.sy01_kh_xgzzList.length > 0) {
        let zzMap = new Map();
        for (let i = 0; i < customerInfor.sy01_kh_xgzzList.length; i++) {
          let licese = customerInfor.sy01_kh_xgzzList[i];
          let liceseSub = licese.sy01_kh_xgzz_fwList;
          let startDate = licese.extend_fzrq; //证照开始时间
          let endDate = licese.extend_yxqz; //证照结束时间
          //时间字符串比较
          startDate = startDate.substring(0, 10);
          endDate = endDate.substring(0, 10);
          if (vouchdate >= startDate && vouchdate <= endDate) {
            zzMap.set(licese.id, endDate);
            if (licese.extend_sqlx == "1" && liceseSub != null) {
              //商品
              liceseSub.forEach((item) => {
                prodMap.set(item.extend_pro_auth_type, item.extend_pro_auth_type);
              });
            } else if (licese.extend_sqlx == "2" && liceseSub != null) {
              //商品类别
              liceseSub.forEach((item) => {
                gspTyepMap.set(item.extend_protype_auth_type, item.extend_protype_auth_type);
              });
            } else if (licese.extend_sqlx == "3" && liceseSub != null) {
              //剂型
              liceseSub.forEach((item) => {
                drugFormMap.set(item.extend_dosage_auth_type, item.extend_dosage_auth_type);
              });
            }
          }
        }
        if (zzMap.size <= 0) {
          throw new Error("客户不在证照有效期内！物料【" + prodInfor.name + "】");
        }
      } else {
        throw new Error("客户无物料【" + prodInfor.name + "】相关证照");
      }
      if (!prodMap.has(prodId) && !gspTyepMap.has(extend_gsp_spfl) && !drugFormMap.has(extend_jx)) {
        throw new Error("客户无物料【" + prodInfor.name + "】相关证照");
      }
    } //End 物料证照验证
    if (request.poacontrol == "1" && request.extendCustomSalesman == undefined) {
      throw new Error("启用了授权委托控制,需要录入对方业务员！");
    }
    if (request.poacontrol == "1" && request.extendCustomSalesman != undefined) {
      let extendCustomSalesman = request.extendCustomSalesman;
      if (customerInfor.sy01_khsqwtsList != undefined && customerInfor.sy01_khsqwtsList.length > 0) {
        let prodMap = new Map();
        let gspTyepMap = new Map();
        let drugFormMap = new Map();
        let zzMap = new Map();
        let b_nothave_ywy = true;
        for (let ii = 0; ii < customerInfor.sy01_khsqwtsList.length; ii++) {
          let authorityScope_1 = customerInfor.sy01_khsqwtsList[ii];
          if (authorityScope_1.extend_ywy == extendCustomSalesman) {
            b_nothave_ywy = false;
            break;
          }
        }
        if (b_nothave_ywy) {
          throw new Error("当前对方业务员没有在客户授权委托中设置！");
        }
        for (let i = 0; i < customerInfor.sy01_khsqwtsList.length; i++) {
          let authorityScope_2 = customerInfor.sy01_khsqwtsList[i];
          let startDate = authorityScope_2.extend_sqksrq; //开始时间    // new Date(authorityScope.extend_sqksrq);
          let endDate = authorityScope_2.extend_sqjsrq; //结束时间
          startDate = startDate.substring(0, 10);
          endDate = endDate.substring(0, 10);
          if (vouchdate >= startDate && vouchdate <= endDate) {
            let authorityScope = customerInfor.sy01_khsqwtsList[i];
            let authorityScopeSub = authorityScope.sy01_khsqwts_sqfwList;
            zzMap.set(authorityScope.id, endDate);
            if (authorityScope.extend_ywy == extendCustomSalesman) {
              if (authorityScope.extend_sqlx == "1" && authorityScopeSub != null) {
                //商品
                authorityScopeSub.forEach((item) => {
                  prodMap.set(item.extend_pro_auth_type, item.extend_pro_auth_type);
                });
              } else if (authorityScope.extend_sqlx == "2" && authorityScopeSub != null) {
                //商品类别
                authorityScopeSub.forEach((item) => {
                  gspTyepMap.set(item.extend_protype_auth_type, item.extend_protype_auth_type);
                });
              } else if (authorityScope.extend_sqlx == "3" && authorityScopeSub != null) {
                //剂型
                authorityScopeSub.forEach((item) => {
                  drugFormMap.set(item.extend_dosage_auth_type, item.extend_dosage_auth_type);
                });
              }
            }
          }
        }
        if (zzMap.size <= 0) {
          throw new Error("对方业务员不在授权委托期内！物料【" + prodInfor.name + "】");
        }
        if (!prodMap.has(prodId) && !gspTyepMap.has(extend_gsp_spfl) && !drugFormMap.has(extend_jx)) {
          throw new Error("对方业务员无物料【" + prodInfor.name + "】相关范围授权委托");
        }
      } else {
        throw new Error("对方业务员无物料【" + prodInfor.name + "】相关范围授权委托");
      }
    } //End
    return { res: true };
  }
}
exports({ entryPoint: MyAPIHandler });