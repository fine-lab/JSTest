let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //业务逻辑coding
    var object = { address: "用友产业园", name: "张三丰", email: "123114@w", sex: "男", age: "23", telephone: "13445678901" }; //元数据
    var res = ObjectStore.insert("GT100036AT155.GT100036AT155.uerinfo_j", object, "6ee39e31");
    return { res };
    //然后去配置调度任务
  }
}
exports({ entryPoint: MyTrigger });