let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let error_info = [];
    if (typeof id != "undefined" && id.length > 0) {
      for (let d = 0; d < id.length; d++) {
        var planCuringObj = {};
        var planCuringArr = [];
        //查寻本单据子表信息
        let childSql = "select * from GT22176AT10.GT22176AT10.SY01_mainproco_son where SY01_mainprocofmv2_id=" + id[d];
        let childRes = ObjectStore.queryByYonQL(childSql);
        if (typeof childRes != "undefined") {
          for (let z = 0; z < childRes.length; z++) {
            let mainprocChildId = childRes[z].id;
            //计划数量
            let planCuringNum = parseFloat(childRes[z].product_num);
            //关联养护计划数量
            let relateCuringPlanNum = parseFloat(childRes[z].relate_curing_plan_num);
            //剩余可生成养护计划数量
            let surPlanCuringQty = parseFloat(planCuringNum - relateCuringPlanNum);
            planCuringObj[mainprocChildId] = surPlanCuringQty;
            planCuringArr.push(planCuringObj);
          }
        }
        let sql = "select * from GT22176AT10.GT22176AT10.SY01_commodity_plan where source_id=" + id[d];
        let res = ObjectStore.queryByYonQL(sql);
        let childList = [];
        if (typeof res != "undefined") {
          for (let i = 0; i < res.length; i++) {
            let curingId = res[i].id;
            let curingSql = "select * from GT22176AT10.GT22176AT10.SY01_commodity_info where SY01_commodity_plan_id=" + curingId;
            let curingRes = ObjectStore.queryByYonQL(curingSql);
            //计划数量:plan_number
            if (typeof curingRes != "undefined") {
              for (let j = 0; j < curingRes.length; j++) {
                for (let k = 0; k < planCuringArr.length; k++) {
                  let upSourcechildId = curingRes[j].sourcechild_id;
                  if (planCuringArr[k][upSourcechildId] - curingRes[j].plan_number <= 0) {
                    error_info.push("第" + (i + 1) + "行物料剩余的计划数量不足,无法下推生成养护计划");
                  }
                }
              }
            }
          }
        }
      }
    }
    if (error_info.length > 0) {
      for (let err = 0; err < error_info.length; err++) {
        for (var err1 = err + 1; err1 < error_info.length; err1++) {
          if (error_info[err] == error_info[err1]) {
            error_info.splice(err1, 1);
            err1--;
          }
        }
        error_info[err] = error_info[err] + " \n ";
      }
    }
    return { error_info };
  }
}
exports({ entryPoint: MyAPIHandler });