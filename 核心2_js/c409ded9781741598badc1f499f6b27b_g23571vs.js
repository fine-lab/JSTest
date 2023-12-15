let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var merchant = request.merchant;
    var merchantCode = request.merchantCode;
    var merchantApplyRangeId = request.merchantApplyRangeId;
    let url = "https://www.example.com/" + merchant + "&code=" + merchantCode + "&merchantApplyRangeId=" + merchantApplyRangeId;
    let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
    return { res: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });