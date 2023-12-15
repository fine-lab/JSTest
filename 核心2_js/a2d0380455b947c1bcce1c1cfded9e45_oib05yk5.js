let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("GT44903AT33.backDefaultGroup.search");
    let res = func1.execute("", "");
    var bz1 = res.res.wenben + new Date();
    var id1 = res.res.id;
    var object = { id: id1, beizhu: bz1 };
    var res1 = ObjectStore.updateById("GT44903AT33.GT44903AT33.simpletest", object, "fd579244");
    //调用后端函数，修改返回值后内容后更新数据，列表上检查更新的字段
    return { res1 };
  }
}
exports({ entryPoint: MyTrigger });