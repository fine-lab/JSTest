let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let uncertainQty = request.uncertainQty;
    let unqualifiedQty = request.unqualifiedQty;
    let error_info = [];
    let sql = "select id from GT22176AT10.GT22176AT10.Sy01_quareview where source_id=" + id;
    let res = ObjectStore.queryByYonQL(sql);
    let childList = [];
    if (typeof res != "undefined") {
      for (let i = 0; i < res.length; i++) {
        let curingId = res[i].id;
        let curingSql = "select * from GT22176AT10.GT22176AT10.SY01_quareventryv1 where SY01_quareventryv1Fk=" + curingId;
        let curingRes = ObjectStore.queryByYonQL(curingSql);
        //复查数量:newReviewQty
        if (typeof curingRes != "undefined") {
          for (let j = 0; j < curingRes.length; j++) {
            let upSourcechildId = curingRes[j].sourcechild_id;
            if (uncertainQty[upSourcechildId] - curingRes[j].newReviewQty <= 0) {
              error_info.push("第" + (j + 1) + "个商品剩余的可复查数量不足,无法下推生成质量复查");
            }
          }
        }
      }
    }
    for (let i = 0; i < error_info.length; i++) {
      for (let j = i + 1; j < error_info.length; j++) {
        if (error_info[i] == error_info[j]) {
          error_info.splice(j, 1);
          j--;
        }
      }
      error_info[i] = error_info[i] + " \n ";
    }
    return { error_info };
  }
}
exports({ entryPoint: MyAPIHandler });