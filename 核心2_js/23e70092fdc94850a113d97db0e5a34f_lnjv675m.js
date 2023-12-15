let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { domain, table, params, condition, pageNum, pageSize, count, yhtUserId, serviceCode, tenantId, mainOrgKey } = request;
    if (!serviceCode) {
      serviceCode = "1728814436602871815";
    }
    if (!tenantId) {
      tenantId = "yourIdHere";
    }
    if (!mainOrgKey) {
      mainOrgKey = "yourKeyHere";
    }
    if (!!yhtUserId) {
      let param1 = { yhtUserId, serviceCode, tenantId };
      let funcQueryOrg = extrequire("GT9912AT31.auth.queryMainOrgs");
      let resultOrg = funcQueryOrg.execute(param1).res;
      let orgs = resultOrg.data;
      let typex = checkConditionType(condition);
      let condition1 = JSON.parse(JSON.stringify(condition));
      let ncondition = {
        logic: "and",
        condition: [condition1]
      };
      ncondition.condition.push({
        key: mainOrgKey,
        value1: orgs,
        symbol: "in"
      });
      condition = ncondition;
    }
    if (!count) {
      count = false;
    }
    if (!domain) {
      domain = "developplatform";
    }
    if (!pageNum) {
      pageNum = 1;
    }
    if (!pageSize) {
      pageSize = 20;
    }
    let select = "select tenant_id,";
    if (!!params && !!params.length && params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        let param = params[i];
        if (i < params.length - 1) {
          select += param + ",";
        } else {
          select += param + " ";
        }
      }
    } else {
      select += " * ";
    }
    let from = "from " + table + " ";
    let where = "where ";
    if (checkCondition(condition)) {
      where += returnCondition(condition) + " ";
    } else {
      where += "id is null ";
    }
    where += "and dr=0 ";
    let limit = "limit " + pageNum + "," + pageSize;
    let total = 0;
    if (count) {
      let countsql = "select count(id),tenant_id,version from " + table + " " + where + "order by version desc";
      let numlist = ObjectStore.queryByYonQL(countsql, domain);
      total = numlist[0].id;
    }
    let sql = select + from + where + limit;
    let recordList = ObjectStore.queryByYonQL(sql, domain);
    function checkCondition(condition) {
      if (!!condition.logic && !!condition.condition) {
        return true;
      } else if (!!condition.key && !!condition.value1 && !!condition.symbol && condition.symbol !== "between") {
        return true;
      } else if (!!condition.key && !!condition.value1 && !!condition.value2 && !!condition.symbol && condition.symbol == "between") {
        return true;
      }
      return false;
    }
    // 判断是哪一层condition
    function checkConditionType(condition) {
      if (!!condition.logic && !!condition.condition) {
        return "box";
      } else if (
        (!!condition.key && !!condition.value1 && !!condition.symbol && condition.symbol !== "between") ||
        (!!condition.key && !!condition.value1 && !!condition.value2 && !!condition.symbol && condition.symbol == "between")
      ) {
        return "ele";
      }
      return null;
    }
    function returnCondition(conditions) {
      let type = checkConditionType(conditions);
      let sql = "";
      switch (type) {
        case "box":
          let { logic, condition } = conditions;
          let sqlc = "";
          if (condition.length > 1) {
            sqlc += " ( ";
          }
          switch (logic) {
            case "and":
              for (let i = 0; i < condition.length; i++) {
                let cd = condition[i];
                let c1 = returnCondition(cd);
                if (i < condition.length - 1) {
                  if (c1 !== "") {
                    sqlc += c1 + " and ";
                  } else {
                    sqlc += c1;
                  }
                } else {
                  sqlc += c1;
                }
              }
              break;
            case "or":
              for (let i = 0; i < condition.length; i++) {
                let cd = condition[i];
                let c2 = returnCondition(cd);
                if (i < condition.length - 1) {
                  if (c2 !== "") {
                    sqlc += c2 + " or ";
                  } else {
                    sqlc += c2;
                  }
                } else {
                  sqlc += c2;
                }
              }
              break;
          }
          if (condition.length > 1) {
            sqlc += " ) ";
          }
          sql += sqlc;
          break;
        case "ele":
          let { key, value1, value2, symbol } = conditions;
          if (!!value2 && (symbol == "between" || symbol == "not between")) {
            sql += " " + key + " " + symbol + " " + value1 + " and " + value2 + " ";
          } else if (symbol == "in" || symbol == "not in") {
            if (!!value1.length && value1.length > 1) {
              sql += " " + key + " " + symbol + " (";
              for (let i = 0; i < value1.length; i++) {
                let value = value1[i];
                if (i < value1.length - 1) {
                  sql += value1 + ",";
                } else {
                  sql += value1;
                }
              }
              sql += ")";
            } else if (value1.length > 0) {
              sql += " " + key + " = " + value1[0] + " ";
            } else {
              sql += " " + key + " = " + value1 + " ";
            }
          } else {
            sql += " " + key + " " + symbol + " " + value1 + " ";
          }
          break;
      }
      return sql;
    }
    return { recordList, total };
  }
}
exports({ entryPoint: MyAPIHandler });