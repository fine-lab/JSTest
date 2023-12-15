let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data;
    var pk_handlepsn = data.pk_handlepsn;
    var pk_endaddr = data.pk_endaddr;
    var ts = data.ts;
    var jsxx = {};
    var zwxx = {};
    var clxx = {};
    //银行信息
    //收款方类型;银行账户;收款方账号;收款方户名;收款方开户行
    var querysql = "select bankname from bd.staff.StaffBankAcct left join bd.staff.Staff yg on staff_id = yg.id  where staff_id = '" + pk_handlepsn + "'and dr = 0";
    var res = ObjectStore.queryByYonQL(querysql, "ucf-staff-center");
    var bankid = res[0].bankname; //银行id
    var querysql1 = " select * from bd.bank.BankDotVO where id='" + bankid + "'";
    var res1 = ObjectStore.queryByYonQL(querysql1, "ucfbasedoc");
    var bankname1 = res1[0].name; //银行名称
    var querysql2 = " select * from bd.staff.StaffBankAcct  where staff_id = '" + pk_handlepsn + "' and dr = 0 ";
    var res2 = ObjectStore.queryByYonQL(querysql2, "ucf-staff-center");
    var account1 = res2[0].account; //收款方账号
    var bankzh = res2[0].id; //银行账户ID
    var querysql3 = " select * from bd.staff.Staff  where id = '" + pk_handlepsn + "' and dr = 0 ";
    var res3 = ObjectStore.queryByYonQL(querysql3, "ucf-staff-center");
    var bankzhname = res3[0].name;
    jsxx["skf"] = 0; //收款方类型
    jsxx["yhzh"] = bankzhname; //银行账户
    jsxx["skfzh"] = account1; //收款方账号
    jsxx["skfhm"] = bankzhname; //收款方户名
    jsxx["skfkhh"] = bankname1; //收款方开户行
    //职务信息
    var querysql4 = "select * from bd.staff.StaffMainJob where staff_id = '" + pk_handlepsn + "'and dr = 0";
    var res4 = ObjectStore.queryByYonQL(querysql4, "ucf-staff-center");
    var job_id = res4[0].job_id; //职务主键
    zwxx["zw"] = job_id; //职务主键
    var querysql7 = "select name from bd.duty.Duty where id = '" + job_id + "'and dr = 0";
    var res7 = ObjectStore.queryByYonQL(querysql7, "ucf-staff-center");
    zwxx["zwmc"] = res7[0].name;
    //城市分级主键
    var query5 = " select pk_areaclass from znbzbx.areaclass.AreaClassRegionCorpVO where pk_regioncorp = '" + pk_endaddr + "' ";
    var res5 = ObjectStore.queryByYonQL(query5, "znbzbx");
    var csfj = res5[0].pk_areaclass; //城市分级主键
    //差旅住宿标准(先查出城市等级)
    var query6 = "select * from znbzbx.abodestand.AbodestandVO where pk_dutyjob = '" + job_id + "' and pk_areaclass = '" + csfj + "'";
    var res6 = ObjectStore.queryByYonQL(query6, "znbzbx");
    var nhotelstandmny = res6[0].nhotelstandmny; //住宿标准
    clxx["zsbz"] = nhotelstandmny; //住宿标准
    clxx["ts"] = ts; //住宿标准
    return { zwxx: zwxx, jsxx: jsxx, clxx: clxx };
  }
}
exports({ entryPoint: MyAPIHandler });