let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取
    var pid = param.data[0].contractNumber;
    var sql = ObjectStore.queryByYonQL('select * from GT102917AT3.GT102917AT3.subcontract where id = "' + pid + '"');
    var count = sql[0].frequency;
    var sum = count - 1;
    var sid = sql[0].id;
    var object = { id: sid, frequency: sum };
    var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", object, "5ff76a5f");
    return {};
  }
}
exports({ entryPoint: MyTrigger });