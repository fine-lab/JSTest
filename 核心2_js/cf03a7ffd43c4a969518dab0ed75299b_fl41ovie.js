let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var student = '{"name":"zhangsan","sex":"famle","address":"chaoyangqu"}';
    var res = jsonParse(student);
    return res; //{"name":"zhangsan","sex":"famle","address":"chaoyang"}
  }
}
exports({ entryPoint: MyTrigger });