let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = {
      appkey: "yourkeyHere",
      appsecret: "yoursecretHere"
    };
    let url = "https://www.example.com/";
    let apiResponse = apiman("get", url, JSON.stringify(header), null);
    console.log(apiResponse);
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });