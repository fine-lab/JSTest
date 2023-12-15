let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = ObjectStore.queryByYonQL("select * from 	GT25329AT3.GT25329AT3.YQZPbill");
    let apiResponse = apiman("Post", "https://www.example.com/", "3ccf7853b1884b278d5630ea0c6b3d2e", res);
    return {};
  }
}
exports({ entryPoint: MyTrigger });