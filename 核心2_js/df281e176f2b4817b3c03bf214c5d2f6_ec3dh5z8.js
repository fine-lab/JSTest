let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgId = request.orgId;
    var billDate = request.billDate.substr(0, 4);
    //查询同组织下，未审核状态的销售发票已引用客开发票税号主键
    var queryDefSql = " select saleInvoiceDefineCharacter.attrext4 from voucher.invoice.SaleInvoice where status in('0','3')";
    var defRes = ObjectStore.queryByYonQL(queryDefSql, "udinghuo");
    //查询同组织下，未用状态的客开发票税号主键、发票税号
    var querySql = "select id,fapiaoshuihao from AT1590F01809B00007.AT1590F01809B00007.invoiceTaxNo where dr=0 and fpzt='10' and org_id=" + orgId + " and yearValue=" + billDate + " order by pubts ";
    var res = ObjectStore.queryByYonQL(querySql, "developplatform");
    var returnData = null;
    if (res.length == 0) {
      //未查询到满足条件的发票税号
      return { returnData };
    } else if (defRes.length == 0) {
      //不存在同组织下未审核状态的销售发票
      returnData = res[0];
      return { returnData };
    } else {
      let defResValue = "";
      for (var k = 0; k < defRes.length; k++) {
        defResValue = defResValue + "," + defRes[k].saleInvoiceDefineCharacter_attrext4;
      }
      for (var i = 0; i < res.length; i++) {
        //循环未用状态的客开发票税号
        let newdata = res[i].id;
        if (defResValue.indexOf(newdata) == -1) {
          //不存在与同组织下未审核状态的销售发票已引用客开发票税号主键数组，即没有被引用
          returnData = res[i];
          return { returnData };
        }
      }
    }
    return { returnData }; //defRes与res完全相同
  }
}
exports({ entryPoint: MyAPIHandler });