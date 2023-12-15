let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let Authorization = {
      Authorization: "Basic cmZjY3RwOjY1NDMyMWE=",
      apikey: "yourkeyHere"
    };
    let url = context != undefined ? context : "https://www.example.com/";
    var strResponse = postman("post", url, JSON.stringify(Authorization), JSON.stringify(param));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });