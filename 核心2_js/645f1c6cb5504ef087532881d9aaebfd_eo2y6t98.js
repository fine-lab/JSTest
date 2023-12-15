let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  //通用的查询方法
  getQueryResult(url, ids, domain, idColumn, querySql) {
    if (!url || !ids || url.length === 0 || ids.length === 0) {
      throw new Error("getQueryResult()方法参数错误！");
    }
    let sql = null;
    if (querySql && querySql.length > 0) {
      sql = querySql;
    } else {
      sql = "select * from " + url + " where ";
      if (idColumn && idColumn.length > 0) {
        sql += idColumn;
      } else {
        sql += "id";
      }
      if (ids.length > 1) {
        let idsStr = ids[0];
        for (let i = 1; i < ids.length; i++) {
          idsStr = idsStr + "," + ids[i];
        }
        sql = sql + " in " + idsStr;
      } else {
        sql = sql + " = " + ids;
      }
    }
    let res = null;
    if (!domain || domain.length === 0) {
      res = ObjectStore.queryByYonQL(sql);
    } else {
      res = ObjectStore.queryByYonQL(sql, domain);
    }
    if (!res || res.length <= 0) {
      return res;
    }
    return res;
  }
  //根据name或则code获取id
  getIdByName(url, name, domain) {
    if (!url || !name || url.length === 0 || name.length === 0) {
      throw new Error("getIdByName()方法参数错误，请传入正确的参数！");
    }
    let sql = "select id from " + url + " where ";
    sql += "(code='" + name + "' or name='" + name + "')";
    let res = null;
    if (!domain || domain.length === 0) {
      res = ObjectStore.queryByYonQL(sql);
    } else {
      res = ObjectStore.queryByYonQL(sql, domain);
    }
    if (!res || res.length === 0) {
      return null;
    }
    return res[0].id + "";
  }
  isEmpty(data) {
    if (!data || data.length === 0) {
      return true;
    } else {
      return false;
    }
  }
}
exports({ entryPoint: MyTrigger });