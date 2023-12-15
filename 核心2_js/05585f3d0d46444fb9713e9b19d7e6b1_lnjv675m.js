let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let showsize = request.showsize;
    let table = request.table;
    let params = request.params;
    let conditions = request.conditions;
    let pageIndex = !request.pageIndex ? 1 : parseInt(request.pageIndex);
    let pageSize = !request.pageSize ? 10 : parseInt(request.pageSize);
    let sort = request.sort;
    function checkObject(value) {
      let check = false;
      if (typeof value == "object") {
        if (value.length == undefined) {
          check = true;
        } else {
          check = false;
        }
      } else {
        check = false;
      }
      return check;
    }
    function checkArray(value) {
      let check = false;
      if (typeof value == "object") {
        if (value.length) {
          check = true;
        } else {
          check = false;
        }
      } else {
        check = false;
      }
      return check;
    }
    function checkString(value) {
      let check = typeof value == "string";
      return check;
    }
    // 获取对象的字符串
    function getObjstr(condition) {
      let conditionstr = "";
      let keys = Object.keys(condition);
      for (let i in keys) {
        let key = keys[i];
        let value = condition[key];
        let valueitem = "";
        if (checkString(value)) {
          valueitem = "'" + value + "'";
        } else {
          valueitem = value;
        }
        if (i < keys.length - 1) {
          conditionstr += key + "=" + valueitem + " and ";
        } else {
          conditionstr += key + "=" + valueitem;
        }
      }
      return conditionstr;
    }
    let type = checkObject(conditions) == true ? "obj" : checkArray(conditions) == true ? "arr" : "null";
    let conditionstr = "";
    switch (type) {
      case "obj":
        conditionstr += getObjstr(conditions);
        break;
      case "arr":
        for (let i in conditions) {
          if (conditions.length > 1) {
            let condition = conditions[i];
            let str = getObjstr(condition);
            if (i < conditions.length - 1) {
              conditionstr += "(" + str + ") or ";
            } else {
              conditionstr += "(" + str + ")";
            }
          } else if (conditions.length == 1) {
            conditionstr += getObjstr(conditions[0]);
          }
        }
        break;
      default:
        throw new Error("条件无法识别");
    }
    let paramsstr = "";
    if (checkArray(params) == true && params.length > 0) {
      for (let i in params) {
        let key = params[i];
        if (i < params.length - 1) {
          paramsstr += key + ",";
        } else {
          paramsstr += key;
        }
      }
    } else {
      paramsstr += "*";
    }
    let sql = "";
    if (conditionstr.indexOf("dr=0") < 0) {
      if (conditionstr !== "") {
        sql += "select " + paramsstr + " from " + table + " where " + conditionstr + " and dr=0";
      } else {
        sql += "select " + paramsstr + " from " + table + " where dr=0";
      }
    } else {
      sql += "select " + paramsstr + " from " + table + " where " + conditionstr;
    }
    let limit = pageIndex - 1;
    if (params.length > 0) {
      sql += " order by " + params[0] + " " + sort + " limit " + limit + "," + pageSize;
    } else {
      sql += " order by id " + sort + " limit " + limit + "," + pageSize;
    }
    let recordList = ObjectStore.queryByYonQL(sql);
    let sqlcount = "select count(id) from " + table + " where " + conditionstr;
    let count = ObjectStore.queryByYonQL(sqlcount);
    let total = 0;
    let pageCount = 0;
    if (showsize) {
      total = count[0].id;
      pageCount = Math.ceil(total / pageSize);
    }
    return { pageIndex: pageIndex, pageSize: pageSize, recordCount: total, recordList: recordList, pageCount: pageCount };
  }
}
exports({ entryPoint: MyAPIHandler });