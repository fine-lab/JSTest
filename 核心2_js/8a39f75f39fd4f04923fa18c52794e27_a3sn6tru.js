let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取当前时间毫秒值
    let newtime = new Date().getTime();
    //获取当前使用的字段
    let billInstId = 2262676199395584;
    let billno = "voucher_order";
    return {};
  }
}
exports({ entryPoint: MyTrigger });