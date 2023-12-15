let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let obj = param.data[0]; // param类型为对象,data为数组,数组中存放的是obj
    let initDate = obj.init_expect_back_date;
    // 月度目标回款日期
    let firstTargetDate = obj.aim_back_date;
    if (initDate == null) {
      // 注意此外给对象赋值的方式,直接用对象.属性=xxx方式有问题
      obj.set("init_expect_back_date", firstTargetDate);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });