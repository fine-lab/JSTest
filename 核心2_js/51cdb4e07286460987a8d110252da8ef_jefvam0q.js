let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {
      name: "test"
    };
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      // 就是appCode
      apicode: "b099ebdf-9200-4a3e-808e-a3c2577db4ab",
      appkey: "yourkeyHere"
    };
    // 可以是http请求
    // 也可以是https请求
    let responseObj = apiman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return { responseObj };
  }
}
exports({ entryPoint: MyTrigger });