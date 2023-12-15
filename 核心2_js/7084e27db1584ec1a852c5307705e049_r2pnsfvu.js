let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var psnId = "yourIdHere";
    let psnInfoUrl = `https://api.diwork.com/yonbip/digitalModel/staff/detail?id=${psnId}`;
    var ublinkerRes = ublinker(
      "get",
      psnInfoUrl,
      JSON.stringify({
        appkey: "yourkeyHere",
        appsecret: "yoursecretHere"
      }),
      null
    );
    return { ublinkerRes };
  }
}
exports({ entryPoint: MyAPIHandler });