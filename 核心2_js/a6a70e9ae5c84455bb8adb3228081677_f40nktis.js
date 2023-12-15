let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {
      tips: "请对以下财务数据进行综合分析，并进行打分",
      message: "优化现金流管理：企业需要建立完善的现金流管理体系、包括制定现金流预算、监测现金流情况、控制现金流风险等。提高现金流的稳定性和安全性。 "
    };
    let header = {};
    let strResponse = postman("post", "http://49.235.103.254:5000/spark", "form", JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });