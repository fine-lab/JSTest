let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let verifystateArr = request.verifystateArr;
    let error_info = [];
    let planCuringArr = [];
    if (typeof id != "undefined" && id.length > 0) {
      for (let d = 0; d < id.length; d++) {
        for (let e = 0; e < verifystateArr.length; e++) {
          if (verifystateArr[e][id[d]] == 2) {
            var planCuringObj = {};
            //查寻本单据子表信息
            let childSql = "select * from 	GT22176AT10.GT22176AT10.SY01_warehousedev2 where SY01_Warehousev2_id=" + id[d];
            let childRes = ObjectStore.queryByYonQL(childSql);
            if (typeof childRes != "undefined") {
              for (let z = 0; z < childRes.length; z++) {
                let proCurChildId = childRes[z].id;
                //在库养护不确定数量
                let planCuringNum = parseFloat(childRes[z].yhbqdsl);
                //关联质量复查数量
                let relateWarehouseCuringNum = parseFloat(childRes[z].glfcsl);
                //剩余可生成在库养护的计划数量
                let surPlanCuringQty = parseFloat(planCuringNum - relateWarehouseCuringNum);
                planCuringObj[proCurChildId] = surPlanCuringQty;
                planCuringArr.push(planCuringObj);
              }
            }
            let sql = "select * from GT22176AT10.GT22176AT10.Sy01_quareview where source_id=" + id[d];
            let res = ObjectStore.queryByYonQL(sql);
            let childList = [];
            if (typeof res != "undefined") {
              for (let i = 0; i < res.length; i++) {
                let curingId = res[i].id;
                let curingSql = "select * from GT22176AT10.GT22176AT10.SY01_quareventryv1 where SY01_quareventryv1Fk=" + curingId;
                let curingRes = ObjectStore.queryByYonQL(curingSql);
                //质量复查单 复查数量:newReviewQty
                if (typeof curingRes != "undefined") {
                  for (let j = 0; j < curingRes.length; j++) {
                    let upSourcechildId = curingRes[j].sourcechild_id;
                    for (let k = 0; k < planCuringArr.length; k++) {
                      if (planCuringArr[k][upSourcechildId] - curingRes[j].newReviewQty <= 0) {
                        error_info.push("第" + (d + 1) + "行剩余的可复查数量不足,下推失败");
                      }
                    }
                  }
                }
              }
            }
          } else {
            error_info.push("第" + (d + 1) + "行单据未通过审批,下推失败");
          }
        }
      }
    }
    if (error_info.length > 0) {
      for (let err = 0; err < error_info.length; err++) {
        for (let j = err + 1; j < error_info.length; j++) {
          if (error_info[err] == error_info[j]) {
            error_info.splice(j, 1);
            j--;
          }
        }
        error_info[err] = error_info[err] + " \n ";
      }
    }
    return { error_info };
  }
}
exports({ entryPoint: MyAPIHandler });