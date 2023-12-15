let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let method = "POST";
    let url = "https://www.example.com/";
    let header = { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" };
    let body = {
      RequestData: [{ OrderCode: "c4bd5906-42ab-4927-8754-d3e0e7a94049", PortName: "HP Lasser MFP 136w" }],
      EBusinessID: "yourIDHere",
      IsPreview: 1,
      DataSign: "ZWNkMDc1MTBmNjdjMjVlM2EzNWYyOTk3NjZkZmZhNzM="
    };
    var strResponse = postman(method, url, "form", JSON.stringify(header), JSON.stringify(body));
    var result = JSON.parse(strResponse);
    return { result: result };
  }
}
exports({ entryPoint: MyAPIHandler });