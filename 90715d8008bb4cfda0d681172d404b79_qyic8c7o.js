let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let hids = request.hids;
    let body = {};
    let reqBudgetMny = 0;
    for (var i2 = 0; i2 < hids.length; i2++) {
      let url = "https://www.example.com/" + hids[i2];
      let apiResponse = openLinker("GET", url, "ycSouringInquiry", JSON.stringify(body));
      reqBudgetMny += JSON.parse(apiResponse).data.reqBudgetMny;
    }
    return { reqBudgetMny };
  }
}
exports({ entryPoint: MyAPIHandler });