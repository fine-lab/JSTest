let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    // 如果是服务 价格信息必填
    if (data.cs_is_or_not === "true") {
      if (data.base_price === "" || data.base_price === null || data.base_price === undefined) {
        throw new Error("请输入基础价格！");
      }
      if (data.is_alone === "true" && data.is_by_user === "true") {
        if (data.unit_Price === null || data.unit_Price === "" || data.unit_Price === undefined) {
          throw new Error("请输入单价！");
        }
        if (data.include_licenses === null || data.include_licenses === "" || data.include_licenses === undefined) {
          throw new Error("请输入用户包含许可数！");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });