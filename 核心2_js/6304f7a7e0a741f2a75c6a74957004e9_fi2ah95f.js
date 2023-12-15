let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //对已经进行过恢复值处理的数据在风险隐患排查模型中的def4字段设置为1
    //查询所有符合条件需要进行复值操作的隐患排查记录
    let riskBillEndObj = {
      verifystate: 1,
      def4: "0.0"
    };
    let riskBillEndRest = ObjectStore.selectByMap("GT37369AT26.GT37369AT26.YHC004", riskBillEndObj);
    //调试存储日志
    var object = {
      mes: JSON.stringify(riskBillEndRest)
    };
    ObjectStore.insert("GT37369AT26.GT37369AT26.logMes", object, "8cb617ec");
    return {};
  }
}
exports({ entryPoint: MyTrigger });