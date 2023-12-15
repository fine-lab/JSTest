let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 赋值：返回一个key，assign 结果值
    let sources = request.sources; //条件数组
    let s1 = sources.filter((item) => {
      return (item.code == "qwe001") & (item.type == "MaterialPropCT");
    })[0]; // 条件：
    let target = request.target; //结果
    if (
      (s1 != undefined) &
      (s1.value == "10") & //
      (target != undefined) &
      (target.type == "MaterialPropCT") &
      (target.code == "qwe002")
    ) {
      return { assign: "1494464167541211141" }; //ISO  1494464167541211141                                    //
    } else if (
      (s1 != undefined) &
      (s1.value == "20") & //C棒
      (target != undefined) &
      (target.type == "MaterialPropCT") &
      (target.code == "qwe003")
    ) {
      return { assign: "30" }; //ASTM   1494464158951276560
    } else {
      return {}; // 注意：不能return null
    }
  }
}
exports({ entryPoint: MyAPIHandler });