let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { key: "yourkeyHere", key2: "v2" };
    let header = { key: "yourkeyHere" };
    let strResponse = postman("post", "http://39.106.84.51/queryUsers", JSON.stringify(header), JSON.stringify(body));
    let response = JSON.parse(strResponse);
    if (response.code == "0") {
      let list = response.data;
      var res = ObjectStore.insertBatch("AT181B7E9009F80002.AT181B7E9009F80002.myuser1107", list, "yb30e7d328List");
      return { res };
    }
    return { code: "-200" };
  }
}
exports({ entryPoint: MyTrigger });