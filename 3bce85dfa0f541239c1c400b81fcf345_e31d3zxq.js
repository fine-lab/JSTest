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
    if (gmpparamsRes != undefined && Array.isArray(gmpparamsRes) && gmpparamsRes.length > 0) {
      if (gmpparamsRes[0].isarrival == "1") {
        //查询GMP物料审批表
        let materialApprovalSql =
          "select createTime, applyfordate, sfxyfqwlgyspgb, evaluationformcode from ISY_2.ISY_2.materialApproval where materialcode = '" + productId + "' and manufacturername = '" + vendor + "'";
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
            //查询GMP物料供应商分级评估表
            if (sfxyfqwlgyspgb == "1") {
              let supplierEvaluationSql = "select suppliername from ISY_2.ISY_2.supplierEvaluationForm where code = '" + evaluationformcode + "'";
              let supplierEvaluationRes = ObjectStore.queryByYonQL(supplierEvaluationSql, "sy01");
              if (supplierEvaluationRes != undefined && Array.isArray(supplierEvaluationRes) && supplierEvaluationRes != null) {
                if (supplierEvaluationRes.length == 0) {
                  throw new Error("编码为" + (productCode + 1) + "的物料没有对应的【GMP物料供应商评估单】，请检查");
                }
              } else {
                throw new Error("编码为" + (productCode + 1) + "的物料没有对应没有【GMP物料供应商评估单】，请检查");
              }
            }
          } else {
            throw new Error("编码为" + (productCode + 1) + "的物料没有【GMP物料审批单】，请检查");
          }
        } else {
          throw new Error("编码为" + (productCode + 1) + "的物料没有【GMP物料审批单】，请检查");
        }
        if (gradingEvaluationRes != undefined && Array.isArray(gradingEvaluationRes) && gradingEvaluationRes != null) {
          if (gradingEvaluationRes.length == 0) {
            throw new Error("编码为" + (productCode + 1) + "的物料没有【GMP物料分级评估单】，请检查");
          }
        } else {
          throw new Error("编码为" + (productCode + 1) + "的物料没有【GMP物料分级评估单】，请检查");
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
      return {};
    }
  }
}
exports({ entryPoint: MyAPIHandler });