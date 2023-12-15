let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let td = ObjectStore.user().tenantId;
    let env = ObjectStore.env().url;
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1850565017D00005", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });