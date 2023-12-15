let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var tenantId = JSON.parse(AppContext()).tenantId;
    let url = "https://www.example.com/" + tenantId;
    let apiResponse = openLinker("GET", url, "GT37522AT1", JSON.stringify({}));
    return { apiResponse };
    return {};
  }
}
exports({ entryPoint: MyTrigger });