let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var shoudafields = request.shoudafields;
    var shoudawhere = request.shoudawhere;
    var domainKey = request.domainKey;
    var songdafields = request.songdafields;
    var songdawhere = request.songdaWhere; //送达条件要加前缀，Address.songdaCode
    var sql = request.sql;
    var swhere;
    var orders = request.orderby;
    if (!orders) orders = "";
    if (!sql) {
      if (!songdafields && !songdawhere) {
        //查送达子表必传子表字段，因为join不支持*
        swhere = typeof shoudawhere == "undefined" ? "" : "where " + shoudawhere;
        sql = "select distinct " + (typeof shoudafields == "undefined" ? "*" : shoudafields) + " from AT16F632B808C80005.AT16F632B808C80005.Merchant3 " + swhere + orders;
      } else {
        if (typeof shoudawhere == "undefined" && typeof songdawhere == "undefined") {
          swhere = "";
        } else if (typeof shoudawhere == "undefined") {
          swhere = "where " + songdawhere;
        } else if (typeof songdawhere == "undefined") {
          swhere = "where " + shoudawhere;
        } else {
          swhere = "where " + shoudawhere + songdawhere;
        }
        sql =
          "select distinct " +
          (typeof shoudafields == "undefined" ? "*" : shoudafields) +
          (typeof songdafields == "undefined" ? "" : "," + songdafields) +
          " from AT16F632B808C80005.AT16F632B808C80005.Merchant3 left join AT16F632B808C80005.AT16F632B808C80005.Address3 Address on id=Address.Merchant3_id " +
          swhere +
          orders;
      }
    }
    let result = ObjectStore.queryByYonQL(sql, typeof domainKey == "undefined" ? "developplatform" : domainKey);
    return { sql: sql, result: result };
  }
}
exports({ entryPoint: MyAPIHandler });