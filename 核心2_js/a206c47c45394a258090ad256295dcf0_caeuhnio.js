let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pageInfo = request.pageInfo;
    var pageIndex = (pageInfo.pageIndex - 1) * 10;
    var pageSize = pageIndex + pageInfo.pageSize;
    let params = pageInfo.params;
    let res;
    let SQL;
    try {
      if (params) {
        let { verifystate, age, name } = params;
        SQL = "select * " + "from AT169D355408F00002.AT169D355408F00002.testperson3_xuyn ";
        if (verifystate && age && name) {
          SQL = SQL + "where  name like '" + name + "'" + " and  verifystate = '" + verifystate + "'" + " and  age ='" + age + "'";
        } else if (verifystate && age) {
          SQL = SQL + "where  verifystate = '" + verifystate + "'" + " and  age ='" + age + "'";
        } else if (name && age) {
          SQL = SQL + "where  name like '" + name + "'" + " and  age ='" + age + "'";
        } else if (verifystate && name) {
          SQL = SQL + "where  name like '" + name + "'" + " and  verifystate = '" + verifystate + "'";
        } else if (name) {
          SQL = SQL + "where  name like '" + name + "'";
        } else if (verifystate) {
          SQL = SQL + "where verifystate = '" + verifystate + "'";
        } else if (age) {
          SQL = SQL + "where  age ='" + age + "'";
        }
        // 查询语句拼接
        // 不好实现集团是在 页面模型中直接匹配了逻辑匹配符 这里 like 和 eq 不好判断
        SQL = SQL + " limit " + pageIndex + "," + pageSize + "";
        res = ObjectStore.queryByYonQL(SQL);
      } else {
        res = ObjectStore.queryByYonQL("select * from AT169D355408F00002.AT169D355408F00002.testperson3_xuyn  limit " + pageIndex + "," + pageSize + "");
      }
      return { res, code: 200 };
    } catch (e) {
      return { code: 10000, message: e, SQL };
    }
  }
}
exports({ entryPoint: MyAPIHandler });