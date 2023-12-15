let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let id = param.id;
    let orgId = param.orgId;
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute();
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var reqVendordetailurl = "https://www.example.com/" + token + "&id=" + id + "&orgId=" + orgId;
    let returnData = {};
    var vendorResponse = postman("GET", reqVendordetailurl, JSON.stringify(header), null);
    var vendorResponseobj = JSON.parse(vendorResponse);
    if ("200" == vendorResponseobj.code) {
      returnData = vendorResponseobj.data;
    }
    return { returnData };
  }
}
exports({ entryPoint: MyTrigger });