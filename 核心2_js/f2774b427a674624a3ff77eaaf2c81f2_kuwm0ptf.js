let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //元数据属性数据
    var object = { address: "北京", name: "张三", sex: "1", email: "https://www.example.com/", age: "25" };
    //元数据URI，右侧的数据模型中可以获取
    var URI = "GT103422AT170.GT103422AT170.uerInfo_xxx";
    //单据编码，右侧的流程中可以获取
    var bilkNum = "9daec9ac";
    //从右侧函数中，获取函数地址，一会配置调度任务使用：GT103422AT170.rule.taskTest
    //新增一条数据
    var res = ObjectStore.insert(URI, object, bilkNum);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });