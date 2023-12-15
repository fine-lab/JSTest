let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = ObjectStore.queryByYonQL("select * from AT18CA807A09F00007.AT18CA807A09F00007.test0804cd");
    let a1 = res[0].id;
    let a2 = res[1].id;
    var object = [
      { id: a1, new2: "22" },
      { id: a2, new2: "222" }
    ];
    var res = ObjectStore.updateBatch("AT18CA807A09F00007.AT18CA807A09F00007.test0804cd", object, "yb70e8e642");
    //查询内容
    return { res };
  }
}
exports({ entryPoint: MyTrigger });