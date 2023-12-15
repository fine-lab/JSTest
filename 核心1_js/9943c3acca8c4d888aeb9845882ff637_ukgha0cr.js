let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 可用性：返回一个Map，key为availability
    let sources = request.sources; //条件数组
    let s1 = sources.filter((item) => {
      return (item.code == "productCharacterDef.AA08162") & (item.type == "pc.product.Product");
    })[0]; //物料属性特征组.zxc-形态码
    let target = request.target; //结果
    if (
      (s1 != undefined) &
      (s1.value == "23") & //  圆胚
      (target != undefined) &
      (target.type == "pc.product.Product") &
      (target.code == "productCharacterDef.ZZY01")
    ) {
      return { availability: "1" }; //宽度只读                       //物料属性特征组.zxc-宽度
    } else if (
      (s1 != undefined) &
      (s1.value == "23") & //圆胚
      (target != undefined) &
      (target.type == "pc.product.Product") &
      (target.code == "productCharacterDef.ZZY00")
    ) {
      return { availability: "2" }; //厚度不可见                //物料属性特征组.zxc-厚度
    } else {
      return {}; // 注意：不能return null
    }
  }
}
exports({ entryPoint: MyAPIHandler });