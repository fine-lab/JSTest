let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var agentid = request.agentId;
    var orgid = request.orgid;
    var billtype = request.billtype;
    var dept = request.dept;
    var open_vouchdate_begin = request.open_vouchdate_begin;
    var open_vouchdate_end = request.open_vouchdate_end;
    var pageIndex = request.pageIndex;
    var pageSize = request.pageSize;
    let empMap = {};
    //业务员查询
    var sqlEmp = "select id,name from hred.staff.Staff   ";
    var resEmp = ObjectStore.queryByYonQL(sqlEmp, "hrcloud-staff-mgr");
    for (var i = 0; i < resEmp.length; i++) {
      empMap[resEmp[i].id] = resEmp[i].name;
    }
    var sqlOp = "select  code, group_concat(b.operator) as operator    from  arap.oar.OarMain  inner join arap.oar.OarDetail b  on  id= b.mainid  where  tradetype = '1602907650714501262'   ";
    if (agentid != null && agentid != "") {
      sqlOp = sqlOp + " and customer = '" + agentid + "' ";
    }
    if (dept != null && dept != "") {
      if (dept == "1624335113728294928" || dept == "1624335113728294932") {
        sqlOp = sqlOp + " and  b.dept in ('1624335113728294928','1624335113728294932') ";
      } else {
        sqlOp = sqlOp + " and  b.dept  = '" + dept + "' ";
      }
    }
    if (billtype == null || billtype == "" || billtype == "1") {
      sqlOp = sqlOp + " and localbalance != 0   ";
    } else {
      sqlOp = sqlOp + " and localbalance = 0   ";
    }
    if (orgid != null && orgid != "") {
      sqlOp = sqlOp + " and accentity = '" + orgid + "' ";
    }
    if (open_vouchdate_begin != null && open_vouchdate_begin != "") {
      sqlOp = sqlOp + " and vouchdate >=  '" + open_vouchdate_begin + "' ";
    }
    if (open_vouchdate_end != null && open_vouchdate_end != "") {
      sqlOp = sqlOp + " and vouchdate <=  '" + open_vouchdate_end + "' ";
    }
    sqlOp = sqlOp + "   group  by  code   ";
    let opMap = {};
    var opRes = ObjectStore.queryByYonQL(sqlOp, "fiarap");
    for (var j = 0; j < opRes.length; j++) {
      if (opRes[j].operator != null && opRes[j].operator != "") {
        var empStrID = opRes[j].operator;
        var code = opRes[j].code;
        var arr = empStrID.split(",");
        var newArr = arr.filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
        var empNameStr = "";
        for (var k = 0; k < newArr.length; k++) {
          var empid = newArr[k];
          if (empMap[empid] != null && empMap[empid] != "") {
            if (k == 0) {
              empNameStr = empMap[empid];
            } else {
              empNameStr = empNameStr + "," + empMap[empid];
            }
          }
        }
        opMap[code] = empNameStr;
      }
    }
    var sql =
      "select  distinct vouchdate, id,code , writeoffstatus, billdirection, oriSum , localbalance ,description from  arap.oar.OarMain " +
      " inner join arap.oar.OarDetail b  on  id= b.mainid " +
      "where  tradetype = '1602907650714501262'   ";
    if (agentid != null && agentid != "") {
      sql = sql + " and customer = '" + agentid + "' ";
    }
    if (billtype == null || billtype == "" || billtype == "1") {
      sql = sql + " and localbalance != 0   ";
    } else {
      sql = sql + " and localbalance = 0   ";
    }
    if (orgid != null && orgid != "") {
      sql = sql + " and accentity = '" + orgid + "' ";
    }
    if (dept != null && dept != "") {
      if (dept == "1624335113728294928" || dept == "1624335113728294932") {
        sql = sql + " and  b.dept in ('1624335113728294928','1624335113728294932') ";
      } else {
        sql = sql + " and  b.dept  = '" + dept + "' ";
      }
    }
    if (open_vouchdate_begin != null && open_vouchdate_begin != "") {
      sql = sql + " and vouchdate >=  '" + open_vouchdate_begin + "' ";
    }
    if (open_vouchdate_end != null && open_vouchdate_end != "") {
      sql = sql + " and vouchdate <=  '" + open_vouchdate_end + "' ";
    }
    if (pageIndex != null && pageSize != null) {
      sql = sql + "  order by vouchdate desc,code limit " + pageIndex + "," + pageSize + " ";
    } else {
      sql = sql + "  order by vouchdate desc,code limit 1,30 ";
    }
    var yingshouRes = ObjectStore.queryByYonQL(sql, "fiarap");
    for (var m = 0; m < yingshouRes.length; m++) {
      var code = yingshouRes[m].code;
      if (opMap[code] != null && opMap[code] != "") {
        yingshouRes[m].empname = opMap[code];
      }
    }
    return { yingshouRes };
  }
}
exports({ entryPoint: MyAPIHandler });