let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    var base_path = "http://106.124.141.53:8989/servlet/saveQuotationServlet";
    let header = { "Content-type": "application/json" };
    var body = {
      value1: ""
    };
    //调用api函数
    let apiResponse = postman("post", base_path, JSON.stringify(header), JSON.stringify(data));
    throw new Error("accesstoken:  " + apiResponse);
    return {};
  }
}
exports({ entryPoint: MyTrigger });