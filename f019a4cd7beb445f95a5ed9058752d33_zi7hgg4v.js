let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = {
      "X-HW-ID": "c1edf10fc44545bebeb8dde7f7546141",
      "X-HW-APPKEY": "IkKiQWmKN38hRQhjbq7pxw=="
    };
    let body = {};
    let url = "http://119.3.126.249/api/rest/nccInfo/syncPsnDocAll";
    let strResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });