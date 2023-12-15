let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = {
      "X-HW-ID": "798abce68e8f4b208fe90a277ad24b29",
      "X-HW-APPKEY": "xuAKGrwo4nKVRw/uKQK2qQ=="
    };
    let body = {};
    let url = "http://119.3.126.249/api/rest/nccInfo/syncPsnDocAll";
    let strResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });