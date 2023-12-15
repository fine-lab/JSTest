let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let unqualifiedQty = request.unqualifiedQty;
    let error_info = [];
    let sql = "select id from GT22176AT10.GT22176AT10.SY01_bad_drugv7 where source_id=" + id;
    let res = ObjectStore.queryByYonQL(sql);
    let childList = [];
    if (typeof res != "undefined") {
      for (let i = 0; i < res.length; i++) {
        let curingId = res[i].id;
        let curingSql = "select * from GT22176AT10.GT22176AT10.SY01_unqualison7 where SY01_bad_drugv2_id=" + curingId;
        let curingRes = ObjectStore.queryByYonQL(curingSql);
        //不合格登记数量:unqualified_num
        if (typeof curingRes != "undefined") {
          for (let j = 0; j < curingRes.length; j++) {
            let upSourcechildId = curingRes[j].sourcechild_id;
            if (unqualifiedQty[upSourcechildId] - curingRes[j].unqualified_num <= 0) {
              error_info.push("第" + (j + 1) + "个商品剩余的可登记不合格单的数量不足,无法下推生成不合格登记单");
            }
          }
        }
      }
    }
    return { error_info };
  }
}
exports({ entryPoint: MyAPIHandler });