let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var hetong_ids = request.hetong_ids;
    var sql =
      "select sum(jiesuanjine),jixiepaigongdan_id.hetong from GT74730AT37.GT74730AT37.jixiepaigongdanzb1 t left join jixiepaigongdan_id t1 on t.jixiepaigongdan_id=t1.id" +
      " where jixiepaigongdan_id.hetong in (" +
      hetong_ids +
      ") group by jixiepaigongdan_id.hetong";
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler }); //查询内容