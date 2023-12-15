let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param != null || param != undefined || param != "") {
      var name = param.name;
      throw new error(name);
    }
    let body = { key: "yourkeyHere" };
    let header = { key: "yourkeyHere" };
    let apiResponse = apiman(
      "get",
      "https://www.example.com/",
      JSON.stringify(header),
      JSON.stringify(body)
    );
    let result = apiResponse.name;
    return { result };
  }
}
exports({ entryPoint: MyTrigger });