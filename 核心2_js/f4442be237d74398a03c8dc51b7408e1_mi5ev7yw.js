let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let suppliernameId = request.suppliernameId;
    let supplierSql = "select id,materialscope,suppliername,createTime from ISY_2.ISY_2.supplierEvaluationForm where suppliername = '" + suppliernameId + "'";
    let supplierRes = ObjectStore.queryByYonQL(supplierSql, "sy01");
    let materialscopeRes = [];
    if (typeof supplierRes != "undefined" && supplierRes != null) {
      if (supplierRes.length > 0) {
        let supplierCreateTimeArr = [];
        for (let i = 0; i < supplierRes.length; i++) {
          supplierCreateTimeArr.push(supplierRes[i].createTime);
        }
        let supplierCreateTimeList = [];
        for (let item of supplierCreateTimeArr) {
          //转时间戳
          supplierCreateTimeList.push(new Date(item).getTime());
        }
        let supplierMaxDate = Math.max(...supplierCreateTimeList);
        let supplierMaxCreateTime = formatDate(supplierMaxDate, "yyyy-MM-dd");
        for (let i = 0; i < supplierRes.length; i++) {
          let supplierCreateTime = formatDate(supplierRes[i].createTime);
          if (supplierCreateTime == supplierMaxCreateTime) {
            let materialscopeSql = "select materialscope from ISY_2.ISY_2.supplierEvaluationForm_materialscope where fkid = '" + supplierRes[i].id + "'";
            materialscopeRes = ObjectStore.queryByYonQL(materialscopeSql, "sy01");
            break;
          }
        }
      }
    }
    function formatDate(timestamp) {
      let date = new Date(timestamp);
      let year = date.getFullYear(); //年
      let month = date.getMonth(); //月
      month += 1;
      if (month < 10) {
        month = "0" + month;
      } else {
        month = date.getMonth();
      }
      let day; //日
      if (date.getDate() < 10) {
        day = "0" + date.getDate();
      } else {
        day = date.getDate();
      }
      return year + "-" + month + "-" + day;
    }
    return { materialscopeRes };
  }
}
exports({ entryPoint: MyAPIHandler });