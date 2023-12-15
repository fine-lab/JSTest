let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    const value1 = param.data[0].xingming;
    const value2 = param.data[0].lianxifangshi;
    const value3 = param.data[0].kouling;
    if (typeof value1 == "undefined" || value1 == null || value1 == "") {
      throw new Error("请输入名字");
    }
    if (typeof value2 == "undefined" || value2 == null || value2 == "") {
      throw new Error("请输入联系方式");
    }
    if (typeof value3 == "undefined" || value3 == null || value3 == "") {
      throw new Error("请输入口令");
    }
    //查询人员表是否存在
    var sql1 = "select * from GT65548AT19.GT65548AT19.text_hzyV2_4_1	 where name = '" + value1 + "' and iphone ='" + value2 + "'";
    var sql2 = "select * from GT65548AT19.GT65548AT19.text_hzyV2_12	 where kouling = '" + value3 + "'and kaosheng ='" + value1 + "'";
    var res1 = ObjectStore.queryByYonQL(sql1);
    var res2 = ObjectStore.queryByYonQL(sql2);
    if ((typeof res1 == "undefined" || res1 == null || res1 == "") && (typeof res2 == "undefined" || res2 == null || res2 == "")) {
      throw new Error("没有考生信息");
    }
    throw new Error("成功");
    return {};
  }
}
exports({ entryPoint: MyTrigger });