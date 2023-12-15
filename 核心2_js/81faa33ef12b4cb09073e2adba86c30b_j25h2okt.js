let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    for (let i = 0; i < param.data.length; i++) {
      let code = param.data[i].code;
      let header = { key: "yourkeyHere" };
      let body = {
        appCode: "beiwei-oms",
        appApiCode: "ys.close.order.dbck",
        schemeCode: "bw47",
        jsonBody: { outBizOrderCode: code, cancellationType: "关闭取消" }
      };
      let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(body));
      let str = JSON.parse(strResponse);
      if (str.success != true) {
        throw new Error("调用OMS调拨订单关单API失败！" + str.errorMessage);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });