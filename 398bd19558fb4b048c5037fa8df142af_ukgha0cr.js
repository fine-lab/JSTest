let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 赋值：返回一个key，assign 结果值
    let sources = request.sources; //条件数组
    let s1 = sources.filter((item) => {
      return (item.code == "ZZY00") & (item.type == "FreeCT");
    })[0];
    let target = request.target; //结果
    if (
      (s1 != undefined) &
      (s1.value == "12") & //
      (target != undefined) &
      (target.type == "FreeCT") &
      (target.code == "ZZY01")
    ) {
      return { assign: "21" }; //
    } else if (
      (s1 != undefined) &
      (s1.value == "21") & //C棒
      (target != undefined) &
      (target.type == "FreeCT") &
      (target.code == "ZZY01")
    ) {
      return { assign: "123" }; //AS
    } else {
      return {}; // 注意：不能return null
    }
  }
}
exports({ entryPoint: MyAPIHandler });