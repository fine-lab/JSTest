let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestDataObject = JSON.parse(param.requestData);
    const c_code = requestDataObject.customer_code;
    let url;
    if (window.location.href.indexOf("dbox.yyuap.com") > -1) {
      url = "https://www.example.com/" + c_code;
    } else {
      url = "https://www.example.com/" + c_code;
    }
    let body = {}; //请求参数
    let apiResponse = openLinker("GET", url, "GZTBDM", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    return { param };
  }
}
exports({ entryPoint: MyTrigger });