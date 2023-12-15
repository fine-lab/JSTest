let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = ObjectStore.queryByYonQL("select * from AT18CC720817C80006.AT18CC720817C80006.will0805");
    let a1 = res[0].id;
    let a2 = res[1].id;
    //查询内容
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT18CC720817C80006", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });