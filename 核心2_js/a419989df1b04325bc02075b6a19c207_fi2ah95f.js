let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //条件查询实体
    //实体查询 待确定
    //查询内容
    //查询内容
    var ss = request["data"][1]["name"];
    return { l: ss };
    return {};
  }
}
exports({ entryPoint: MyTrigger });