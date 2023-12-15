let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return { urlHead: "https://www.example.com/" };
  }
}
exports({ entryPoint: MyTrigger });