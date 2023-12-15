let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data;
    for (var i = data.length - 1; i >= 0; i--) {
      let id = data[i].id;
      let sql = "select id,TasklistNum from GT102917AT3.GT102917AT3.Childtable where subcontracting_aintenance_con_id='" + id + "'";
      let res = ObjectStore.queryByYonQL(sql);
      if (res.length > 0) {
        for (var j = res.length - 1; j >= 0; j--) {
          let TasklistNum = res[j].TasklistNum;
          // 修改任务单
          var object = { id: TasklistNum, isQuote: "否" };
          var res111 = ObjectStore.updateById("GT102917AT3.GT102917AT3.changethecontract", object, "70e7b0f7");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });