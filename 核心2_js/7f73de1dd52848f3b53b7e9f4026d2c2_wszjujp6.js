let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      apicode: "afb15ceac3464a58848fc6c3d619799b",
      appkey: "yourkeyHere"
    };
    let apiResponse = apiman("post", "http://120.24.58.145:8118/cttlab/V1/getWebServiceRes", JSON.stringify(header), JSON.stringify(request.data));
    let resp = JSON.parse(apiResponse);
    if (resp.returnCode != null && resp.returnCode == "200") {
      return {
        apiResponse
      };
    } else {
      return {
        apiResponse
      };
    }
  }
}
exports({ entryPoint: MyAPIHandler });