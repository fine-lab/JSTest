let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.orgId;
    let vendor = request.vendor;
    let productId = request.productId;
    let productCode = request.productCode;
    //查询GMP组织参数
    let gmpparamsSql = "select isarrival from ISY_2.ISY_2.SY01_gmpparams where org_id = '" + orgId + "'";
    let gmpparamsRes = ObjectStore.queryByYonQL(gmpparamsSql, "sy01");
    //获取物料信息
    let materialSql = "select extend_is_gsp,extend_gsp_spfl from pc.product.Product where id = " + productId;
    let merchantInfo = ObjectStore.queryByYonQL(materialSql, "productcenter");
    if (typeof merchantInfo != "undefined" && merchantInfo != null) {
      let isTrue = [1, "1", true, "true"];
      if (merchantInfo.length > 0) {
        if (isTrue.includes(merchantInfo[0].extend_is_gsp)) {
          if (gmpparamsRes != undefined && Array.isArray(gmpparamsRes)) {
            if (gmpparamsRes.length > 0) {
              if (gmpparamsRes[0].isarrival == "1") {
                //查询GMP物料审批表
                let materialApprovalSql =
                  "select createTime, applyfordate, sfxyfqwlgyspgb, evaluationformcode from ISY_2.ISY_2.materialApproval where materialcode = '" +
                  productId +
                  "' and manufacturername = '" +
                  vendor +
                  "'";
                let materialApprovalRes = ObjectStore.queryByYonQL(materialApprovalSql, "sy01");
                //查询GMP物料分级评估表
                let gradingEvaluationSql = "select materialcode from ISY_2.ISY_2.gradingEvaluationForm where materialcode = '" + productId + "' and manufacturername = '" + vendor + "'";
                let gradingEvaluationRes = ObjectStore.queryByYonQL(gradingEvaluationSql, "sy01");
                if (materialApprovalRes != undefined && Array.isArray(materialApprovalRes) && materialApprovalRes != null) {
                  if (materialApprovalRes.length > 0) {
                    let applyfordateArr = [];
                    for (let i = 0; i < materialApprovalRes.length; i++) {
                      applyfordateArr.push(materialApprovalRes[i].createTime);
                    }
                    let applyfordateList = [];
                    for (let item of applyfordateArr) {
                      //转时间戳
                      applyfordateList.push(new Date(item).getTime());
                    }
                    let maxDate = Math.max(...applyfordateList);
                    let maxApplyfordate = formatDate(maxDate, "yyyy-MM-dd");
                    let evaluationformcode = "-1";
                    let sfxyfqwlgyspgb = "2";
                    for (let i = 0; i < materialApprovalRes.length; i++) {
                      let createTime = formatDate(materialApprovalRes[i].createTime);
                      if (createTime == maxApplyfordate) {
                        evaluationformcode = materialApprovalRes[i].evaluationformcode;
                        sfxyfqwlgyspgb = materialApprovalRes[i].sfxyfqwlgyspgb;
                      }
                    }
                    //查询GMP物料供应商评估表
                    if (sfxyfqwlgyspgb == "1") {
                      let supplierEvaluationSql = "select id,materialscope,suppliername,createTime from ISY_2.ISY_2.supplierEvaluationForm where suppliername = '" + vendor + "'";
                      let supplierEvaluationRes = ObjectStore.queryByYonQL(supplierEvaluationSql, "sy01");
                      if (supplierEvaluationRes != undefined && Array.isArray(supplierEvaluationRes) && supplierEvaluationRes != null) {
                        if (supplierEvaluationRes.length == 0) {
                          throw new Error("编码为" + productCode + "的物料没有对应的【GMP物料供应商评估单】，请检查");
                        } else if (supplierEvaluationRes.length > 0) {
                          let supplierApplyfordateArr = [];
                          for (let i = 0; i < supplierEvaluationRes.length; i++) {
                            supplierApplyfordateArr.push(supplierEvaluationRes[i].createTime);
                          }
                          let supplierApplyfordateList = [];
                          for (let item of supplierApplyfordateArr) {
                            //转时间戳
                            supplierApplyfordateList.push(new Date(item).getTime());
                          }
                          let supplierMaxDate = Math.max(...supplierApplyfordateList);
                          let supplierMaxApplyfordate = formatDate(supplierMaxDate, "yyyy-MM-dd");
                          for (let i = 0; i < supplierEvaluationRes.length; i++) {
                            let supplierCreateTime = formatDate(supplierEvaluationRes[i].createTime);
                            if (supplierCreateTime == supplierMaxApplyfordate) {
                              let materialscopeSql = "select materialscope from ISY_2.ISY_2.supplierEvaluationForm_materialscope where fkid = '" + supplierEvaluationRes[i].id + "'";
                              let materialscopeRes = ObjectStore.queryByYonQL(materialscopeSql, "sy01");
                              let materialscopeArr = [];
                              if (typeof materialscopeRes != "undefined" && materialscopeRes != null) {
                                if (materialscopeRes.length > 0) {
                                  for (let i = 0; i < materialscopeRes.length; i++) {
                                    materialscopeArr.push(materialscopeRes[i].materialscope);
                                  }
                                }
                              }
                              let index = materialscopeArr.indexOf(merchantInfo[0].extend_gsp_spfl);
                              if (index == -1) {
                                throw new Error("该供应商对应的物料范围不包含该物料所在的范围，请检查");
                              }
                            }
                          }
                        }
                      } else {
                        throw new Error("编码为" + productCode + "的物料没有对应没有【GMP物料供应商评估单】，请检查");
                      }
                    }
                  } else {
                    throw new Error("编码为" + productCode + "的物料没有【GMP物料审批单】，请检查");
                  }
                } else {
                  throw new Error("编码为" + productCode + "的物料没有【GMP物料审批单】，请检查");
                }
                if (gradingEvaluationRes != undefined && Array.isArray(gradingEvaluationRes) && gradingEvaluationRes != null) {
                  if (gradingEvaluationRes.length == 0) {
                    throw new Error("编码为" + productCode + "的物料没有【GMP物料分级评估单】，请检查");
                  }
                } else {
                  throw new Error("编码为" + productCode + "的物料没有【GMP物料分级评估单】，请检查");
                }
                function formatDate(timestamp) {
                  let date = new Date(timestamp);
                  let year = date.getFullYear(); //年
                  let month = date.getMonth(); //月
                  month += 1;
                  if (month < 10) {
                    month = "0" + month;
                  } else {
                    month = date.getMonth();
                  }
                  let day; //日
                  if (date.getDate() < 10) {
                    day = "0" + date.getDate();
                  } else {
                    day = date.getDate();
                  }
                  return year + "-" + month + "-" + day;
                }
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });