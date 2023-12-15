let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 校验：返回两个key， validityCode 合法性（1-合法，2-不合法），message 字符串提示信息（即不合法时的原因）
    let sources = []; //条件数组
    let target = []; //结果项
    let validityCode = 0;
    let message = "";
    // 条件一
    let source1 = sources.filter((item) => {
      return (item.code == "ProductType1") & (item.type == "Material1");
    })[0];
    // 条件二
    let source2 = sources.filter((item) => {
      return (item.code == "ProductType2") & (item.type == "Material2");
    })[0];
    // 条件运算
    if ((source1 != undefined) & (source1.value == "D-Strip1") & (source2 != undefined) & (source2.value == "D-Strip2") & (target != undefined)) {
      validityCode = 2;
      message = "错误描述";
    } else if ((source1 != undefined) & (source1.value == "D-Strip1") & (source2 != undefined) & (source2.value == "D-Strip2") & (target == undefined)) {
      validityCode = 1;
      message = "";
    }
    return { validityCode: validityCode, message: message };
  }
}
exports({ entryPoint: MyTrigger });