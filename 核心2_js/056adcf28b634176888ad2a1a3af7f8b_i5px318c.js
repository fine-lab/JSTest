let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    throw new Error("回写终端信息至U订货异常");
    Marketingpublic.CRM01.custSave;
    const params = { ...data };
    cosole.log("params", params);
    var url = "http://219.133.71.172:39066/uapws/rest/integration/writeCust";
    //调用post请求
    var interfaceRes = null;
    try {
      interfaceRes = postman("POST", bipUrl, null, JSON.stringify(params));
    } catch (e) {
      throw new Error("\n 回写终端信息至U订货异常：" + e);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });