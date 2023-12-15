let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = openLinker("GET", url, "GT23196AT14", JSON.stringify(body));
    console.log(apiResponse);
    let test = JSON.parse(apiResponse);
    let test1 = test.data.orderDetails[0].id;
    let test2 = test.data.id;
    throw new Error(test2 + "and" + test1);
  }
}
exports({ entryPoint: MyTrigger });