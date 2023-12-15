let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let error_info = "";
    let str_ids = id.join(",");
    //查寻本单据子表信息
    let childSql = "select * from GT22176AT10.GT22176AT10.SY01_commodity_info where SY01_commodity_plan_id in (" + str_ids + ")";
    let childRes = ObjectStore.queryByYonQL(childSql);
    //查询在库养护
    let warehouseSql = "select id from GT22176AT10.GT22176AT10.SY01_Warehousev2 where source_id in (" + str_ids + ")";
    let warehouseRes = ObjectStore.queryByYonQL(warehouseSql);
    let curingId = [];
    if (typeof warehouseRes != "undefined") {
      for (let i = 0; i < warehouseRes.length; i++) {
        curingId.push(warehouseRes[i].id);
      }
    }
    let str_curingIds = curingId.join(",");
    //查询在库养护子表
    let curingSql = "select * from GT22176AT10.GT22176AT10.SY01_warehousedev2 where SY01_Warehousev2_id in (" + str_curingIds + ")";
    let curingRes = ObjectStore.queryByYonQL(curingSql);
    let planCuringObj = {};
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
      }
    }
    //计划数量:plan_number
    if (typeof curingRes != "undefined") {
      for (let j = 0; j < curingRes.length; j++) {
        let upSourcechildId = curingRes[j].sourcechild_id;
        if (planCuringObj[upSourcechildId] - curingRes[j].curing_number <= 0) {
          error_info += "第" + (j + 1) + "个商品剩余计划数量不足,无法下推生成在库养护" + "\n";
        }
      }
    }
    return { error_info };
  }
}
exports({ entryPoint: MyAPIHandler });