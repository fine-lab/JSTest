let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let planCuringArr = request.planCuringArr;
    let error_info = [];
    let sql = "select id from GT22176AT10.GT22176AT10.SY01_Warehousev2 where source_id=" + id;
    let res = ObjectStore.queryByYonQL(sql);
    let childList = [];
    if (typeof res != "undefined") {
      for (let i = 0; i < res.length; i++) {
        let curingId = res[i].id;
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
    return { error_info };
  }
}
exports({ entryPoint: MyAPIHandler });