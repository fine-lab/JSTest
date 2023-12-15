let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let appcode = "AT164B201408C00003"; // 应用的code
    let data = {
      appcode: appcode,
      apiurl: {
        salesDelegate: "/yonbip/digitalModel/salesDelegate/list"
      }
    };
    return { appcode: data.appcode, apiurl: data["apiurl"][context] };
  }
}
exports({ entryPoint: MyTrigger });