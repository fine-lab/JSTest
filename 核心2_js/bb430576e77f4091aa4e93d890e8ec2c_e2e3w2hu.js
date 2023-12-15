let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = {
      appcode: "AT199C09C609D80006",
      apiurl: {
        product: "https://www.example.com/",
        productupdate: "https://www.example.com/",
        apilog: "https://www.example.com/"
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