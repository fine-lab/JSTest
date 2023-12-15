let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data;
    var pk_handlepsn = data.pk_handlepsn;
    var name = data.pk_cusdoc_name;
    var code = data.vdef1;
    var pk = data.pk_cusdoc;
    if (name != undefined || code != undefined || pk != undefined) {
      //供应商有值 供应商 把供应商的银行信息赋值给结算信息
      var jsxx = {};
      var querysql1 = "select * from aa.vendor.VendorBank left join aa.vendor.Vendor gys on vendor = gys.id  where (gys.code = '" + code + "' or gys.name = '" + name + "' or gys.id = '" + pk + "') ";
      var res1 = ObjectStore.queryByYonQL(querysql1, "yssupplier");
      var bankid = res1[0].openaccountbank; //银行网点id
      var account = res1[0].account; //收款方账号
      var querysql2 = " select * from bd.bank.BankDotVO where id='" + bankid + "'";
      var res2 = ObjectStore.queryByYonQL(querysql2, "ucfbasedoc");
      var bankname1 = res2[0].name; //银行开户行
      var querysql3 = "select * from aa.vendor.Vendor where (code = '" + code + "' or name = '" + name + "' or id = '" + pk + "') ";
      var res3 = ObjectStore.queryByYonQL(querysql3, "yssupplier");
      var bankzhname = res3[0].name;
      //收款方类型;银行账户;收款方账号;收款方户名;收款方开户行
      jsxx["skf"] = 1; //收款方类型
      jsxx["yhzh"] = bankzhname; //银行账户
      jsxx["skfzh"] = account; //收款方账号
      jsxx["skfhm"] = bankzhname; //收款方户名
      jsxx["skfkhh"] = bankname1; //收款方开户行
      jsxx["skfkhhid"] = bankkhhid;
    } else {
      //收款方类型;银行账户;收款方账号;收款方户名;收款方开户行
      var jsxx = {};
      var querysql1 = "select bankname from bd.staff.StaffBankAcct left join bd.staff.Staff yg on staff_id = yg.id  where staff_id = '" + pk_handlepsn + "'and dr = 0";
      var res1 = ObjectStore.queryByYonQL(querysql1, "ucf-staff-center");
      var bankid = res1[0].bankname; //银行网点id
      var querysql2 = " select * from bd.bank.BankDotVO where id='" + bankid + "'";
      var res2 = ObjectStore.queryByYonQL(querysql2, "ucfbasedoc");
      var bankname1 = res2[0].name; //银行开户行
      var bankkhhid = res2[0].id; //银行开户行id
      var querysql3 = " select * from bd.staff.StaffBankAcct  where staff_id = '" + pk_handlepsn + "' and dr = 0 ";
      var res3 = ObjectStore.queryByYonQL(querysql3, "ucf-staff-center");
      var account1 = res3[0].account; //收款方账号
      var bankzh = res3[0].id; //银行账户ID
      var querysql4 = " select * from bd.staff.Staff  where id = '" + pk_handlepsn + "' and dr = 0 ";
      var res4 = ObjectStore.queryByYonQL(querysql4, "ucf-staff-center");
      var bankzhname = res4[0].name; //收款方户名
      jsxx["skf"] = 0; //收款方类型
      jsxx["yhzh"] = bankzhname; //银行账户
      jsxx["skfzh"] = account1; //收款方账号
      jsxx["skfhm"] = bankzhname; //收款方户名
      jsxx["skfkhh"] = bankname1; //收款方开户行
      jsxx["skfkhhid"] = bankkhhid;
    }
    return { jsxx: jsxx };
  }
}
exports({ entryPoint: MyAPIHandler });