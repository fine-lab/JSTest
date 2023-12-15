let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let planCuringArr = request.planCuringArr;
    let error_info = [];
    let sql = "select * from GT22176AT10.GT22176AT10.SY01_commodity_plan where source_id=" + id;
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
            let upSourcechildId = curingRes[j].sourcechild_id;
            for (var k = 0; k < planCuringArr.length; k++) {
              if (planCuringArr[k][upSourcechildId] - curingRes[j].plan_number <= 0) {
                error_info.push("第" + (k + 1) + "行物料剩余数量不足,无法下推生成养护计划");
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