String.prototype.format = function (args) {
  var result = this;
  if (arguments.length < 1) {
    return result;
  }
  var data = arguments;
  if (arguments.length == 1 && typeof args == "object") {
    data = args;
  }
  for (var key in data) {
    var value = data[key];
    if (undefined != value) {
      result = result.replace("{" + key + "}", value);
    }
  }
  return result;
};
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var paycode = request.paycode;
    var agentid = request.agentid;
    var orgid = request.orgid;
    var dept = request.dept;
    if (paycode) {
      //单位
      let unitMap = {};
      var sqlUnit = "select id,name from  aa.product.ProductUnit  ";
      var resUnit = ObjectStore.queryByYonQL(sqlUnit, "productcenter");
      for (var q = 0; q < resUnit.length; q++) {
        unitMap[resUnit[q].id] = resUnit[q].name;
      }
      var ysdata = [];
      var procountSql =
        "select  count(1) num  from pc.product.Product " +
        "left join pc.product.ProductDetail d on id = d.productId " +
        "left join aa.product.ProductUnit u on d.batchPriceUnit = u.id " +
        "left join aa.product.ProductUnit u2 on d.batchUnit = u2.id " +
        "left join pc.cls.ManagementClass mc on mc.id = manageClass " +
        "left join aa.product.ProductUnit u3 on u3.id = unit " +
        "left join pc.product.ProductAssistUnitExchange pe on pe.productId = id " +
        "left join aa.product.ProductUnit u4 on u4.id = pe.assistUnit " +
        "where  1=1 ";
      var proCountres = ObjectStore.queryByYonQL(procountSql, "productcenter");
      var proCount = proCountres[0].num;
      let proListMap = {};
      if (proCount > 5000) {
        let x = new Big(ysCount);
        let y = new Big(5000);
        let z = x.div(y);
        var maxpage = Math.ceil(z);
        for (var h = 1; h <= maxpage; h++) {
          var newsql =
            " select id productId,unit productUnitId,name productName,code productCode,u.name batchPriceUnit,u.id batchPriceUnitid,u2.name batchUnit ," +
            "u2.id batchUnitid,mc.name productclassName,u3.name productUnitName,pe.assistUnit assistUnitm,u4.name assistUnitName,orgId org, manageClass  productclassId " +
            "from pc.product.Product " +
            "left join pc.product.ProductDetail d on id = d.productId " +
            "left join aa.product.ProductUnit u on d.batchPriceUnit = u.id " +
            "left join aa.product.ProductUnit u2 on d.batchUnit = u2.id " +
            "left join pc.cls.ManagementClass mc on mc.id = manageClass " +
            "left join aa.product.ProductUnit u3 on u3.id = unit " +
            "left join pc.product.ProductAssistUnitExchange pe on pe.productId = id " +
            "left join aa.product.ProductUnit u4 on u4.id = pe.assistUnit  order by code limit " +
            h +
            " ,5000  ";
          var resThis = ObjectStore.queryByYonQL(newsql, "fiarap");
          for (var i = 0; i < resThis.length; i++) {
            var productId = resThis[i].productId;
            proListMap[productId] = resThis[i];
          }
        }
      } else {
        var Mainsql =
          "select id productId,unit productUnitId,name productName,code productCode,u.name batchPriceUnit,u.id batchPriceUnitid,u2.name batchUnit ," +
          "u2.id batchUnitid,mc.name productclassName,u3.name productUnitName,pe.assistUnit assistUnitm,u4.name assistUnitName,orgId org, manageClass  productclassId " +
          "from pc.product.Product " +
          "left join pc.product.ProductDetail d on id = d.productId " +
          "left join aa.product.ProductUnit u on d.batchPriceUnit = u.id " +
          "left join aa.product.ProductUnit u2 on d.batchUnit = u2.id " +
          "left join pc.cls.ManagementClass mc on mc.id = manageClass " +
          "left join aa.product.ProductUnit u3 on u3.id = unit " +
          "left join pc.product.ProductAssistUnitExchange pe on pe.productId = id " +
          "left join aa.product.ProductUnit u4 on u4.id = pe.assistUnit " +
          "where  1=1 ";
        var prores = ObjectStore.queryByYonQL(Mainsql, "productcenter");
        for (var i = 0; i < prores.length; i++) {
          var productId = prores[i].productId;
          proListMap[productId] = prores[i];
        }
      }
      var paycodeStr = "";
      for (var i = 0; i < paycode.length; i++) {
        paycodeStr += paycode[i] + ",";
      }
      paycodeStr = paycodeStr.substr(0, paycodeStr.length - 1);
      var temp = " and  code in  ({0}) ";
      paycodeStr = temp.format(paycodeStr);
      let empMap = {};
      //业务员查询
      var sqlEmp = "select id,name from hred.staff.Staff   ";
      var resEmp = ObjectStore.queryByYonQL(sqlEmp, "hrcloud-staff-mgr");
      for (var i = 0; i < resEmp.length; i++) {
        empMap[resEmp[i].id] = resEmp[i].name;
      }
      var ysCountSql = "select  count(b.id) num from  arap.oar.OarMain  inner join arap.oar.OarDetail b  on  id= b.mainid where   tradetype = '1602907650714501262'   "; //and customer = '"+agentid+"'
      if (dept != null && dept != "") {
        if (dept == "1624335113728294928" || dept == "1624335113728294932") {
          ysCountSql = ysCountSql + " and  b.dept in ('1624335113728294928','1624335113728294932') ";
        } else {
          ysCountSql = ysCountSql + " and  b.dept  = '" + dept + "' ";
        }
      }
      ysCountSql = ysCountSql + " and accentity = '" + orgid + "' " + paycodeStr;
      var ysCountRes = ObjectStore.queryByYonQL(ysCountSql, "fiarap");
      var ysCount = ysCountRes[0].num;
      var yingshouRes = [];
      if (ysCount > 5000) {
        let x = new Big(ysCount);
        let y = new Big(5000);
        let z = x.div(y);
        var maxpage = Math.ceil(z);
        for (var h = 1; h <= maxpage; h++) {
          var newsql =
            "select code , b.batchno batchno ,b.orderno orderno , b.balance  balance ,  b.oriSum oriSum ,b.qty qty , b.unit unit, b.oriTaxUnitPrice  oriTaxUnitPrice ,b.material material ,b.operator  operator ,  b.unit punit " +
            "from  arap.oar.OarMain  inner join arap.oar.OarDetail b  on  id= b.mainid  where   tradetype = '1602907650714501262'  "; //and customer = '"+agentid+"'
          if (dept != null && dept != "") {
            if (dept == "1624335113728294928" || dept == "1624335113728294932") {
              ysCountSql = ysCountSql + " and  b.dept in ('1624335113728294928','1624335113728294932') ";
            } else {
              ysCountSql = ysCountSql + " and  b.dept  = '" + dept + "' ";
            }
          }
          newsql = newsql + " and accentity = '" + orgid + "'  " + paycodeStr + " order by code,b.orderno limit " + h + " ,5000  ";
          var resThis = ObjectStore.queryByYonQL(newsql, "fiarap");
          for (var g = 0; g < resThis.length; g++) {
            yingshouRes.push(resThis[g]);
          }
        }
      } else {
        var yingshouSql =
          "select code ,vouchdate, b.batchno batchno ,b.orderno orderno , b.balance  balance ,  b.oriSum oriSum ,b.qty qty , b.unit unit, b.oriTaxUnitPrice  oriTaxUnitPrice ,b.material material ,b.operator operator,  b.unit punit " +
          "from  arap.oar.OarMain  inner join arap.oar.OarDetail b  on  id= b.mainid  where   tradetype = '1602907650714501262'  "; //and customer = '"+agentid+"'
        if (dept != null && dept != "") {
          if (dept == "1624335113728294928" || dept == "1624335113728294932") {
            ysCountSql = ysCountSql + " and  b.dept in ('1624335113728294928','1624335113728294932') ";
          } else {
            ysCountSql = ysCountSql + " and  b.dept  = '" + dept + "' ";
          }
        }
        yingshouSql = yingshouSql + " and accentity = '" + orgid + "' " + paycodeStr;
        yingshouRes = ObjectStore.queryByYonQL(yingshouSql, "fiarap");
      }
      for (var v = 0; v < yingshouRes.length; v++) {
        var material = yingshouRes[v].material;
        if (proListMap[material] != null && proListMap[material] != "") {
          var ys = yingshouRes[v];
          var proda = proListMap[material];
          ys.materialname = proda.productName;
          ys.materialcode = proda.productCode;
          ys.baseunit = proda.batchUnit;
          var punit = yingshouRes[v].punit;
          if (unitMap[punit] != null && unitMap[punit] != "") {
            ys.unit = unitMap[punit];
            ys.baseunit = unitMap[punit];
          }
          var operator = yingshouRes[v].operator;
          if (empMap[operator] != null && empMap[operator] != "") {
            var operator = empMap[operator];
            ys.operatorname = operator;
          }
          ysdata.push(ys);
        }
      }
      return { ysdata };
    }
    return { ysdata };
  }
}
exports({ entryPoint: MyAPIHandler });