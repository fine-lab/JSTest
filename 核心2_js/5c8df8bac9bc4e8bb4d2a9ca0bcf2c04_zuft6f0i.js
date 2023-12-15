let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sndata = {
      sns: [""],
      coupon_id: "",
      action_type: "coupon"
    };
    sndata.coupon_id = request.coupon_id;
    sndata.sns[0] = request.sn;
    let body = {
      billnum: "pt_couponreceivelist",
      action: "abandonAndReturn",
      data: JSON.stringify(sndata)
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1767B4C61D580001", JSON.stringify(body));
    let data = JSON.parse(apiResponse);
    return {
      data
    };
  }
}
exports({ entryPoint: MyAPIHandler });