let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var context = {
      org: "2293903580617728", //会计主体ID,必填
      accbook: "1E0644D3-1237-464E-AB1D-0972D3C0B4E3", // 账簿
      period1: "2023-03", //起始期间,必填
      period2: "2023-05" //结束期间,必填
    };
    let func = extrequire("AT17AF88F609C00004.commonII.riskMonitoring");
    let res = func.execute();
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });