let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url = "https://www.example.com/";
    let header = {
      apicode: "217ced6a86c443df817e7a0d579bc7ed"
    };
    let apiResponse = apiman("get", url, JSON.stringify(header), null);
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });