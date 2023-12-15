let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let APPCODE = "GT3734AT5";
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let sqlStr = "select operatorName,count(1) as custNum from GT3734AT5.GT3734AT5.FTCustNOrg group by operatorName";
    sqlStr = "select shiBaiYuanYin,count(1) as num from GT3734AT5.GT3734AT5.GongSi_YL group by shiBaiYuanYin having count(1)>1"; //游乐
    let queryLogRes = ObjectStore.queryByYonQL(sqlStr, "developplatform"); //pageNum>1500 and (
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 9, description: "统计无组织客户信息", reqt: JSON.stringify(queryLogRes), resp: sqlStr })); //调用领域内函数写日志
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });