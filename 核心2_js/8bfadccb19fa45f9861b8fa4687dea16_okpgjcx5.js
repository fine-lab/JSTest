let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    var data = param.data;
    var id = data[0].ceshi002List[0].id;
    var code = data[0].code;
    var date = "2021-05-01"; // 需求时间
    var date1 = "2021-04-29"; // 合同到期时间
    return {};
  }
}
exports({ entryPoint: MyTrigger });