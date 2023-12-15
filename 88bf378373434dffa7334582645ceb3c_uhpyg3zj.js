let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = openLinkerPure("POST", url, "AT18240A981648000A", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });