let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url = "https://www.example.com/";
    let apiResponse = openLinker("GET", url, "GT46950AT1", JSON.stringify({}));
    throw new Error(apiResponse);
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });