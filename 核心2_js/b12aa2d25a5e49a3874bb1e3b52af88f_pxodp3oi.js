let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let id = pdata.id;
    let APPCODE = "GT3734AT5"; //应用AppCode-固定值
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    throw new Error("订单已经生成发票，不能变更!");
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });