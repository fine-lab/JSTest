let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var merchantApplyRangeId = request.merchantId;
    var merchant = request.Merchant;
    let url = "https://www.example.com/" + merchant + "&merchantApplyRangeId=" + merchantApplyRangeId;
    let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
    return { result: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });