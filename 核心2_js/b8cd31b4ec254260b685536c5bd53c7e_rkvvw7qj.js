let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //创建文档对象
    //提取数据
    var xml =
      '<it:Envelope xmlns:it="https://www.example.com/" ' +
      'xmlns:q0="https://www.example.com/" xmlns:xsd="https://www.example.com/" ' +
      'xmlns:xsi="https://www.example.com/">' +
      "<it:Body><q0:getAll /></it:Body></it:Envelope>";
    var res = $(xml).find("it:body").text();
    throw new Error("订单同步CRM失败!" + res);
    return {};
  }
}
exports({ entryPoint: MyTrigger });