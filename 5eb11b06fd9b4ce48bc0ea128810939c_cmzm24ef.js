let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { pageIndex: 1, pageSize: 10, totalCount: 1 };
    let url =
      "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT18C7919E17F8000B", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });