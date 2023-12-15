let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var urllog2 = "https://www.example.com/";
    var bodylog2 = { fasongren: "21", SrcJSON: "124", ToJSON: "141", Actype: 2 }; //请求参数
    var apiResponselog2 = openLinker("POST", urllog2, "AT18DC6E5E09E00008", JSON.stringify(bodylog2));
    return {};
  }
}
exports({ entryPoint: MyTrigger });