let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GZTBDM", JSON.stringify(body));
    let test = JSON.parse(apiResponse);
    let test2 = test.data.y;
    throw new Error(test2);
  }
}
exports({ entryPoint: MyTrigger });