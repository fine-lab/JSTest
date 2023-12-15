let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let Org = request.org_id;
    //查询的时候，要查询所有的子表记录。
    let sunsql = "select * from AT1833A66C08480009.AT1833A66C08480009.PaymentAlertStrategy where Org = '" + Org + "' and dr = 0";
    let sunres = ObjectStore.queryByYonQL(sunsql);
    //策略对象 每一个策略以及对应的抄送人
    let earlyWarning = [];
    if (sunres.length > 0) {
      //通过子表记录的外键，查询主表记录。
      for (let i = 0; i < sunres.length; i++) {
        let PaymentAlert_id = sunres[i].PaymentAlert_id;
        let massql = "select Userids from AT1833A66C08480009.AT1833A66C08480009.PaymentAlert where id = '" + PaymentAlert_id + "' and enable = 1";
        let masres = ObjectStore.queryByYonQL(massql);
        //用户数组字符串
        let Userids = masres[0].Userids;
        //将用户数组字符串转换为对象，然后将数组对象放入sunres[i]（对应的策略对象）
        Userids = JSON.parse(Userids);
        let obj = sunres[i];
        obj.Userids = Userids;
        earlyWarning.push(obj);
      }
    }
    return { earlyWarning };
  }
}
exports({ entryPoint: MyAPIHandler });