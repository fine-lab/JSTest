let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    let apiResponse = openLinker(
      "POST",
      url,
      "CUST",
      JSON.stringify({
        fullname: "aa.merchant.MerchantDefine",
        "domain-key": "productcenter",
        data: [
          {
            id: "youridHere",
            define5: "审批通过"
          }
        ]
      })
    );
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });