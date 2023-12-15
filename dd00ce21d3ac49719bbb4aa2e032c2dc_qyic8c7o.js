let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    // 判断希望支持顾问是否为空
    const sql = "select * from GT65292AT10.GT65292AT10.PresaleAppon_presalesConsultant where fkid=" + param.variablesMap.id;
    const res = ObjectStore.queryByYonQL(sql);
    if (!res || res.length <= 0) {
      throw new Error(JSON.stringify("请维护希望支持顾问"));
    }
    // 判断希望支持开始时间和结束时间
    const supportTime = param.variablesMap.supportTime;
    const endTime = param.variablesMap.xiwangzhichijieshushijian;
    if (!supportTime || !endTime) {
      throw new Error(JSON.stringify("希望支持时间不能为空"));
    }
    throw new Error("======" + JSON.stringify(res));
    return "Y";
  }
}
exports({ entryPoint: MyTrigger });