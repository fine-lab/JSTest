let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //这里检查上级项目的类型，类型为末级的项目无法继续建立下级
    //表：AT15CC6BA016F00007.AT15CC6BA016F00007.WTXM  字段：leixing
    return {};
  }
}
exports({ entryPoint: MyTrigger });