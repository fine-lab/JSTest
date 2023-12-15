let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    const value1 = param.xingming;
    const value2 = param.lianxifangshi;
    const value3 = param.kouling;
    //查询人员表是否存在
    var sql1 = "select * from GT65548AT19.GT65548AT19.text_hzyV2_4_1	 where name = 'value1' and iphone = 'value2'";
    var sql2 = "select * from GT65548AT19.GT65548AT19.text_hzyV2_12	 where kouling = 'value3' and kaosheng ='value1";
    var res1 = ObjectStore.queryByYonQL(sql1);
    var res2 = ObjectStore.queryByYonQL(sql2);
    if (res1 === null && res2 === null) {
      throw new Error("信息错误");
    }
    console.log("成功");
    return {};
  }
}
exports({ entryPoint: MyTrigger });