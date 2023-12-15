let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //后端函数调用后端函数
    //也可以调用api函数
    //批量更新实体 参照更新单个实体
    let url = "https://www.example.com/";
    let apiResponse = openLinker("GET", url, "GT79146AT92", null);
    var object = { id: "youridHere", dawenben: apiResponse };
    var res = ObjectStore.updateById("GT79146AT92.GT79146AT92.funcStore", object);
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });