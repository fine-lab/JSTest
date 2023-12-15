let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var Yhtaccesstoken =
      "bttcWo1QUR0NTI3T0t4Wkx0bW5RbGR4L3BydllFYVpFQXhEaVI5a2FadTZURmlNL0hMbWN4ZkxYOG15UGlpSTNpYUxsemhGaThBOEZySndtNGk4aXpGaU9ORUJEbkMyVDN4d0htVEdhOHpZTWw0SmZMNHhJQjd5emc4c1dmR0NZZDhfX2V1Yy55b255b3VjbG91ZC5jb20.__2375d28a49f1463740932fd5fe0c1773_1652603024468";
    var orgcode = request; //组织code
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype,
      Yhtaccesstoken: Yhtaccesstoken
    };
    var body = {
      mid: "youridHere",
      status: 4,
      trade_code: "BZ202205111658289468",
      trade_date: "2022-05-11",
      goods_type: 1,
      goods_code: "9901009",
      goods_name: "HD-铂兹/1.60/A3",
      quantity: 20,
      sum: 3000,
      pay_sum: 3000,
      trade_source: "",
      memo: "备注信息",
      digest: "摘要xx",
      out_sys_key: "",
      out_sys_main_key: ""
    };
    var reqkhdetailurl = "https://www.example.com/";
    let returnData = {};
    var khcustResponse = postman("POST", reqkhdetailurl, JSON.stringify(header), JSON.stringify(body));
    var kehucustresponseobj = JSON.parse(khcustResponse);
    return { khcustResponse, reqkhdetailurl };
  }
}
exports({ entryPoint: MyAPIHandler });