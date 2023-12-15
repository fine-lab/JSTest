let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let appcode = "AT1832AE3609F80004";
    let data = {
      //沙箱环境
      sandbox: {
        appcode: appcode,
        apiurl: {
          salesDelegate: "https://www.example.com/"
        }
      }
    };
    return { appcode: data.appcode, apiurl: data["apiurl"][context] };
  }
}
exports({ entryPoint: MyTrigger });