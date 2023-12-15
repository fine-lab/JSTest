let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //  保存后回写另一个实体的某个字段。
    let a = "10";
    return { a };
  }
}
exports({ entryPoint: MyTrigger });