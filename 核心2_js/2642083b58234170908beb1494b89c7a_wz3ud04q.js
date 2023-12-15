let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0]; //保存json获取的数据：因为是单卡类型的，保存的时候只会保存一条
    var { isdefault, supplier, id } = data; //从模型里面获取 isdefault, supplier, id 这3个字段
    var sql = "select id from AT15DCD4700808000A.AT15DCD4700808000A.supplierbankaccsc where supplier ='" + supplier + "' and isdefault='1' and id != '" + id + "'";
    //如果当前设置了default，默认账户选了 是 的，才会去做校验
    if (isdefault == "1") {
      let resp = ObjectStore.queryByYonQL(sql);
      resp.map((v) => {
        if (v.id !== null) {
          throw new Error("当前供应商唯一默认账户已存在，请检查");
        }
      });
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });