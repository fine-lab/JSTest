let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var str = JSON.stringify(context);
    var para = JSON.stringify(param);
    var poj = {
      context,
      param
    };
    let body = { key: "yourkeyHere" };
    let header = { cookie: "DMWayRequest=defaultway" };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(poj));
    return {};
  }
}
exports({ entryPoint: MyTrigger });