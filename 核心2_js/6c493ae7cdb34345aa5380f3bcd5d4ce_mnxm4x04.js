let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var profile = "prod";
    if (obj.currentUser.tenantId == "qtptj577") {
      return { url: "https://cmp.1024hero.com:59999", profile: "dev" };
    }
    if (profile == "prod") {
      return { url: "https://www.example.com/", profile: "prod" };
    } else if (profile == "test") {
      return { url: "https://cmptest.1024hero.com:7002", profile: "test" };
    } else {
      return { url: "https://cmp.1024hero.com:59999", profile: "dev" };
    }
  }
}
exports({ entryPoint: MyTrigger });