let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var object = { is_unique_identification_control: "1.0" };
    var res = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", object);
    if (res && res.length > 0) {
      for (var index = 0; index < res.length; index++) {
        var productCodingData = processNumber(res[index].product_coding);
        var mainTable = { id: res[index].id, is_unique_identification_control: "1" };
        var updateTableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", mainTable, "3f0c64e9");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });
function processNumber(value) {
  if (typeof value === "number") {
    value = value.toString();
  }
  const regex = /^(\d+)\.0$/;
  const match = regex.exec(value);
  if (match !== null) {
    // 匹配到后缀为.0的情况，返回整数
    return parseInt(match[1]);
  }
  return value;
}