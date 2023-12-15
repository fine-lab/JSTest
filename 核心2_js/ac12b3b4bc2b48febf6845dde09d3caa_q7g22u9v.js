let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    var id;
    var otheroutbusinesstype;
    var stockstatuschangecode;
    //请求头
    let header = {
      appkey: "yourkeyHere",
      appsecret: "yoursecretHere"
    };
    let body = { id: id, otheroutbusinesstype: otheroutbusinesstype, stockstatuschangecode: stockstatuschangecode };
    let url = "https://www.example.com/";
    let apiResponse = ublinker("POST", url, JSON.stringify(header), JSON.stringify(body));
    let supplycategorys = JSON.parse(apiResponse);
    return {};
  }
}
exports({ entryPoint: MyTrigger });