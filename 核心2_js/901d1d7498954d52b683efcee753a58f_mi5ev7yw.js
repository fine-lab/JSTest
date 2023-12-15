let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let sourceId = data[0].id;
    //查询放行单
    let releaseSql = "select * from ISY_2.ISY_2.release_order where source_id = '" + sourceId + "'";
    let releaseRes = ObjectStore.queryByYonQL(releaseSql, "sy01");
    if (typeof releaseRes != "undefined" && releaseRes != null && typeof releaseRes != "{}") {
      if (Array.isArray(releaseRes)) {
        if (releaseRes.length > 0) {
          throw new Error("该单据已下推放行单，不可弃审");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });