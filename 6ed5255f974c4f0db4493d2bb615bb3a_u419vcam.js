let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url1 = "https://www.example.com/";
    try {
      let apiResponse2 = apiman("post", url1, JSON.stringify(body), "");
    } catch (e) {
      console.log(e);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });