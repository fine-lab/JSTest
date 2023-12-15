let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    throw new Error("1111111111111111111111111111");
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute();
    let token = res.access_token;
    //获取门店
    var body = {
      pageSize: 1000,
      pageIndex: 1
    };
    var reqwlurl = "https://www.example.com/" + token;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    let rst = "";
    var custResponse = postman("POST", reqwlurl, JSON.stringify(header), JSON.stringify(body));
    var custresponseobj = JSON.parse(custResponse);
    if ("200" == custresponseobj.code) {
      rst = custresponseobj.data;
    }
    return { rst };
  }
}
exports({ entryPoint: MyTrigger });