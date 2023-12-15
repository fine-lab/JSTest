let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取单据详情
    let bill = JSON.parse(param.requestData);
    let saleOrderId = bill.id + "";
    let func1 = extrequire("SCMSA.backDefaultGroup.OpenApiUtil");
    let param2 = {
      url: "saleOrder/approveRule",
      params: { saleOrderId }
    };
    let res = func1.execute(param2);
    if ("200" != res.code) {
      throw new Error(res.message || "审批规则 审批时后端服务异常，请联系管理员");
    }
    // 将id转为string类型
    function transLongId(billdata) {
      if (!billdata) {
        return;
      }
      for (let [key, value] of Object.entries(billdata)) {
        if (value instanceof Object || value instanceof Array) {
          transLongId(value);
        }
        if (typeof value === "number" && !isNaN(value) && value.toString().length >= 15) {
          billdata[key] = value + "";
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });