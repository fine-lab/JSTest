let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    // 如果是按用户 价格信息必填
    if (data.is_by_user === "true") {
      if (data.unit_price === null || data.unit_price === "") {
        throw new Error("请输入单价！");
      }
      if (data.include_licenses === null || data.include_licenses === "") {
        throw new Error("请输入用户包含许可数！");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });