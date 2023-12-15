let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url = "https://www.example.com/";
    //查询申报期别ID
    let apiResponse = postman("GET", url, null, null);
    throw new Error(apiResponse);
    return {};
  }
}
exports({ entryPoint: MyTrigger });