let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //业务逻辑coding
    var object = { name: "张三", email: "https://www.example.com/", telephone: "13866778899" }; //元数据属性数据
    var URI = "GT2841AT10.GT2841AT10.test_app"; //元数据URI
    var billNum = "7aa442a0"; //单据编码
    // 新增一条数据
    var res = ObjectStore.insert("URI", object, "billNum");
    return { res };
    // 然后去配置 调度任务
  }
}
exports({ entryPoint: MyTrigger });