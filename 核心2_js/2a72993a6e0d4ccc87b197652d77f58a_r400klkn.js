let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    let vouchdate = [year, month, day].join("-");
    vouchdate = vouchdate.substring(0, 10);
    let productId = request.productId;
    let productName = request.productName;
    let supplierId = request.supplierId;
    let orgId = request.orgId;
    let gsp_spfl = request.materialType;
    let jx = request.dosageForm;
    let rowno = request.rowNO;
    let purchaseorgid = request.purchaseorgid;
    let operator = request.operator;
    let productsku = request.productsku;
    let productskuName = request.productskuName;
    let rownoinfo = "第" + rowno + "行:";
    let parameterRequest = { saleorgid: orgId };
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
    let res = AppContext();
    let obj = JSON.parse(res);
    let tid = obj.currentUser.tenantId;
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let gspUrl = apiPreAndAppCode.apiPrefix + "/" + tid + "/001/00001/gsp/getSupLicInfo";
    let gspBody = { orgId: orgId, supplierId: supplierId };
    let returninfo = openLinker("POST", gspUrl, "GT22176AT10", JSON.stringify(gspBody));
    let venderinnfo = JSON.parse(returninfo);
    if (venderinnfo == undefined || venderinnfo == "") {
      throw new Error("供应商证照档案查询错误！");
    }
    venderinnfo = venderinnfo.supLicInfo;
    if (typeof venderinnfo == "undefined") {
      throw new Error("收票组织没有当前供应商证照信息！");
    }
    if (isgspzz) {
      let prodMap = new Map(); //物料
      let gspTyepMap = new Map(); //商品类别
      let drugFormMap = new Map(); //剂型
      let skuMap = new Map(); //sku
      let AllMap = new Map(); //全品类
      //查询年度报告
      if (venderinnfo.sy01_supplier_file_other_repList != undefined && venderinnfo.sy01_supplier_file_other_repList.length > 0) {
        for (let i = 0; i < venderinnfo.sy01_supplier_file_other_repList.length; i++) {
          let repList = venderinnfo.sy01_supplier_file_other_repList[i];
          let reportName = repList.reportName;
          let reportBeginDate = repList.beginDate; //开始时间
          let reportEndDate = repList.endDate; //结束时间
          if (reportBeginDate == undefined) {
            reportBeginDate = "1900-01-01";
          }
          if (reportEndDate == undefined) {
            reportEndDate = "2099-12-31";
          }
          reportBeginDate = reportBeginDate.substring(0, 10);
          reportEndDate = reportEndDate.substring(0, 10);
          if (vouchdate < reportBeginDate || vouchdate > reportEndDate) {
            throw new Error("供应商年度报告不在有效期内！报表名称【" + reportName + "】");
          }
        }
      }
      //查询证照
      if (venderinnfo.SY01_supplier_file_licenseList != undefined && venderinnfo.SY01_supplier_file_licenseList.length > 0) {
        let zzMap = new Map();
        for (let i = 0; i < venderinnfo.SY01_supplier_file_licenseList.length; i++) {
          let licese = venderinnfo.SY01_supplier_file_licenseList[i];
          let liceseSub = licese.SY01_supplier_file_license_authList; //子表
          let startDate = licese.issueDate; //证照颁发日期
          let endDate = licese.validUntil; //证照有效期至
          if (startDate == undefined) {
            startDate = "1900-01-01";
          }
          if (endDate == undefined) {
            endDate = "2099-12-31";
          }
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
            } else if (licese.authType == "4" && liceseSub != null) {
              liceseSub.forEach((item) => {
                skuMap.set(item.sku, item.sku);
              });
            } else if (licese.authType == "10") {
              //全品类
              AllMap.set("all", "1");
            }
          }
        }
        if (zzMap.size <= 0) {
          throw new Error("供应商不在证照有效期内！物料【" + productName + "】");
        }
      } else {
        throw new Error("供应商没有设置相关证照！");
      }
      if (AllMap.size > 0) {
        //全品类不控制
      } else {
        if (!prodMap.has(productId) && !gspTyepMap.has(gsp_spfl) && !drugFormMap.has(jx) && !skuMap.has(productsku)) {
          throw new Error("供应商没有物料【" + productName + "】相关证照。");
        }
      }
    }
    if (poacontrol == "1") {
      if (request.extend_saleman == undefined) {
        throw new Error(rownoinfo + "启用了授权委托控制,请先填写【授权委托人/对方业务员】！");
      }
      let Salesman = request.extend_saleman;
      if (venderinnfo.SY01_supplier_file_certifyList != undefined && venderinnfo.SY01_supplier_file_certifyList.length > 0) {
        let prodMap = new Map();
        let gspTyepMap = new Map();
        let drugFormMap = new Map();
        let wtMap = new Map();
        let skuMap = new Map(); //sku
        let AllMap = new Map();
        let b_nothave_ywy = true;
        for (let ii = 0; ii < venderinnfo.SY01_supplier_file_certifyList.length; ii++) {
          let authorityScope_1 = venderinnfo.SY01_supplier_file_certifyList[ii];
          if (authorityScope_1.salesman == Salesman) {
            b_nothave_ywy = false;
            break;
          }
        }
        if (b_nothave_ywy) {
          throw new Error(rownoinfo + "当前对方业务员没有在供应商授权委托书中设置！");
        }
        for (let i = 0; i < venderinnfo.SY01_supplier_file_certifyList.length; i++) {
          let authorityScope_2 = venderinnfo.SY01_supplier_file_certifyList[i];
          let startDate = authorityScope_2.startDate; //开始时间
          let endDate = authorityScope_2.endDate; //结束时间
          if (startDate == undefined) {
            startDate = "1900-01-01";
          }
          if (endDate == undefined) {
            endDate = "2099-12-31";
          }
          startDate = startDate.substring(0, 10);
          endDate = endDate.substring(0, 10);
          if (vouchdate >= startDate && vouchdate <= endDate) {
            let authorityScope = venderinnfo.SY01_supplier_file_certifyList[i];
            let authorityScopeSub = authorityScope_2.SY01_supplier_file_certify_authList;
            wtMap.set(authorityScope.id, endDate);
            if (authorityScope.salesman == Salesman) {
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
                AllMap.set("all", "1");
              }
            }
          }
        }
        if (wtMap.size <= 0) {
          throw new Error(rownoinfo + "对方业务员不在授权委托期内！物料【" + productName + "】");
        }
        if (AllMap.size > 0) {
          //全品类不控制
        } else {
          if (!prodMap.has(productId) && !gspTyepMap.has(gsp_spfl) && !drugFormMap.has(jx)) {
            throw new Error(rownoinfo + "对方业务员没有物料【" + productName + "】相关范围授权委托");
          }
        }
      } else {
        throw new Error(rownoinfo + "对方业务员没有物料【" + productName + "】相关范围授权委托");
      }
    }
    if (operator == undefined || operator == null) {
    } else {
      let gspLimitparameterRequest = {
        orgId: purchaseorgid,
        operator: operator,
        productId: productId,
        productName: productName,
        productsku: productsku,
        productskuName: productskuName,
        type: "1",
        rowno: rowno
      };
      let gspLimitFun = extrequire("GT22176AT10.publicFunction.validateLimit");
      let gspLimitFunRe = gspLimitFun.execute(gspLimitparameterRequest);
      if (gspLimitFunRe.info != "") {
        throw new Error(gspLimitFunRe.info);
      }
    }
    return { res: true };
  }
}
exports({ entryPoint: MyAPIHandler });