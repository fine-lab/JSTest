let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { param: param.return };
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let url = "http://139.196.156.252:8081/voucher/collectionStatus";
    let strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    var resBody = JSON.parse(strResponse);
    if (resBody.code != 200) {
      throw new Error(JSON.stringify(resBody.msg));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });