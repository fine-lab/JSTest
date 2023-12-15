let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {
      tips: "",
      message: context.payload
    };
    let header = {};
    let strResponse = postman("post", "http://49.235.103.254:5000/spark", "form", JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });