let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let error_info = [];
    if (typeof id != "undefined" && id.length > 0) {
      for (let d = 0; d < id.length; d++) {
        var planCuringArr = [];
        var planCuringObj = {};
        //查寻本单据子表信息
        let childSql = "select * from GT22176AT10.GT22176AT10.SY01_commodity_info where SY01_commodity_plan_id=" + id[d];
        let childRes = ObjectStore.queryByYonQL(childSql);
        let warehouseSql = "select id from GT22176AT10.GT22176AT10.SY01_Warehousev2 where source_id=" + id[d];
        let warehouseRes = ObjectStore.queryByYonQL(warehouseSql);
        if (typeof childRes != "undefined") {
          for (let z = 0; z < childRes.length; z++) {
            let proCurChildId = childRes[z].id;
            //计划数量
            let planCuringNum = parseFloat(childRes[z].plan_number);
            //关联在库养护数量
            let relateWarehouseCuringNum = parseFloat(childRes[z].glzkyhsl);
            //剩余可生成在库养护的计划数量
            let surPlanCuringQty = parseFloat(planCuringNum - relateWarehouseCuringNum);
            planCuringObj[proCurChildId] = surPlanCuringQty;
            planCuringArr.push(planCuringObj);
          }
        }
        if (typeof warehouseRes != "undefined") {
          for (let i = 0; i < warehouseRes.length; i++) {
            let curingId = warehouseRes[i].id;
            let curingSql = "select * from GT22176AT10.GT22176AT10.SY01_warehousedev2 where SY01_Warehousev2_id=" + curingId;
            let curingRes = ObjectStore.queryByYonQL(curingSql);
            //计划数量:plan_number
            if (typeof curingRes != "undefined") {
              for (let j = 0; j < curingRes.length; j++) {
                let upSourcechildId = curingRes[j].sourcechild_id;
                for (let k = 0; k < planCuringArr.length; k++) {
                  if (planCuringArr[k][upSourcechildId] - curingRes[j].curing_number <= 0) {
                    error_info.push("第" + (j + 1) + "个商品剩余计划数量不足,无法下推生成在库养护");
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
        error_info[err] = error_info[err] + " \n ";
      }
    }
    return { error_info };
  }
}
exports({ entryPoint: MyAPIHandler });