let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var uv = param.data[0].extend_uv; //一般从param中取规则链中传递的值
    let num = uv + 1;
    param.data[0].set("extend_uv", num + ""); //可以回写修改new1的值,这里的值要加个空引号
    return {};
  }
}
exports({ entryPoint: MyTrigger });