let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var code = param.code; //发货箱编码
    var signatureImageUrl = param.signatureImageUrl; //签名图片链接
    return {};
  }
}
exports({ entryPoint: MyTrigger });