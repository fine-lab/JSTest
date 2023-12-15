let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute();
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = { "Content-Type": contenttype };
    var getpriceUrl = "https://www.example.com/" + token;
    var priceRes = postman("POST", getpriceUrl, JSON.stringify(header), JSON.stringify(param));
    var priceObj = JSON.parse(priceRes);
    var priceList = undefined;
    if (priceObj.code == "200") {
      var data = priceObj.data;
      var recordList = data.recordList;
      if (recordList != undefined && recordList.length > 0) {
        priceList = recordList;
      }
    }
    return { priceList };
  }
}
exports({ entryPoint: MyTrigger });