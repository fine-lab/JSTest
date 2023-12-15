let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SCMSA", JSON.stringify(body));
    let test = JSON.parse(apiResponse);
    let test1 = test.data.res[0].sonlist[0].productName;
    throw new Error("友企联调用结果为：" + test1);
  }
}
exports({ entryPoint: MyTrigger });