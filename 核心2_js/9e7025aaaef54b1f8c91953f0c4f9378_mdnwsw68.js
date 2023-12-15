let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = {
      appcode: "AT18F69F5C08E0000A",
      apiurl: {
        customer: "https://www.example.com/"
      }
    };
    let apiurl;
    if (context == null) {
      apiurl = data["apiurl"];
    } else {
      apiurl = data["apiurl"][context];
    }
    return { appcode: data.appcode, apiurl: apiurl };
  }
}
exports({ entryPoint: MyTrigger });