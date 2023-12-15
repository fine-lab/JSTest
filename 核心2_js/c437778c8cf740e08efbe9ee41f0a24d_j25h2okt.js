let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    if (pdata != null) {
      let biaotouOms = {
        outBizOrderCode: pdata.code //外部单号
      };
      let bodyOms = {
        appCode: "beiwei-ys", //应用编码
        appApiCode: "cprk.ys.cancel.interface", //接口编码
        schemeCode: "ys", //方案编码
        jsonBody: biaotouOms
      };
      let headerOms = { "Content-Type": "application/json;charset=UTF-8" };
      let strResponse = postman("POST", "http://47.100.73.161:888/api/unified", JSON.stringify(headerOms), JSON.stringify(bodyOms));
      strResponse = JSON.parse(strResponse);
      if (strResponse.success == "false") {
        throw new Error("========产品入库同步OMS报错========");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });