let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute();
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var reqCgdetailurl = "https://www.example.com/" + token;
    let returnData = "";
    var cgResponse = postman("POST", reqCgdetailurl, JSON.stringify(header), JSON.stringify(param));
    var cgresponseobj = JSON.parse(cgResponse);
    returnData = cgresponseobj.code;
    return { returnData };
  }
}
exports({ entryPoint: MyTrigger });