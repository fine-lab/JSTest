let AbstractTrigger = require("AbstractTrigger");
let funcdateToString = extrequire("GT52668AT9.CommonUtils.dateToString");
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
  getDateString(data) {
    if (includes(data, "-")) {
      return data;
    }
    let ret = funcdateToString.execute(new Date(data + 28800000));
    return ret;
  }
  joinWhereSql(simpleVOs) {
    let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
    let res = "";
    if (simpleVOs[0]) {
      let tempRes = "";
      var op = simpleVOs[0].op;
      if (op == "eq") {
        tempRes = simpleVOs[0].field + " = " + simpleVOs[0].value1;
      } else if (op == "in") {
        tempRes = simpleVOs[0].field + " in (" + simpleVOs[0].value1 + ")";
      } else if (op == "neq") {
        tempRes = simpleVOs[0].field + " <> " + simpleVOs[0].value1;
      } else if (op == "between") {
        let startdate = simpleVOs[0].value1;
        let enddate = simpleVOs[0].value2;
        if (startdate.length != 10 || enddate.length != 10) {
          throw new Error("请填入标准格式的日期yyyy-mm-dd");
        }
        if (queryUtils.isEmpty(startdate) || queryUtils.isEmpty(enddate)) {
          throw new Error("请填入要查询的单据的时间区间");
        }
        if (startdate > enddate) {
          throw new Error("起始时间必须在截止时间之前");
        }
        let st = queryUtils.getDateString(startdate);
        let ed = queryUtils.getDateString(enddate);
        st = st + " 00:00:00";
        ed = ed + " 23:59:59";
        let pubts = simpleVOs[0].field;
        tempRes = "pubts >= '" + st + "' and  pubts <= '" + ed + "'";
      }
      if (tempRes.length > 0) {
        if (res == "") {
          res = tempRes;
        } else {
          res = res + " and" + tempRes;
        }
      }
    }
    return res;
  }
}
exports({ entryPoint: MyTrigger });