let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //拿到前端函数传过来的业务员id
    var id = param.id;
    //根据业务员id查询关键数据的客户id
    var sql = "select kehu from GT5812AT145.GT5812AT145.guanjianshuju where yewuyuan in (''))";
    var res = ObjectStore.queryByYonQL(sql);
    console.log("hello");
    return { res: res };
  }
}
exports({ entryPoint: MyTrigger });