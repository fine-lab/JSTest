let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 合法性：返回Map，key为validityCode、message
    let sources = request.sources; // 条件数组
    let s1 = sources.filter((item) => {
      return (item.code == "merchantCharacter.ZZY00") & (item.type == "aa.merchant.Merchant");
    })[0]; //物料属性特征组.zxc-钢种族群
    let target = request.target; // 结果数组
    let assign = "AssignVal001";
    if (
      (s1 != undefined) &
      (s1.value == "12") & //202
      (target != undefined) &
      (target.type == "aa.merchant.Merchant") &
      (target.code == "merchantCharacter.ZZY01") &
      (target.value == "1")
    ) {
      return { validityCode: 1, message: "合法！" }; //物料属性特征组.zxc-钢种1
    } else if ((s1 != undefined) & (s1.value == "12") & (target != undefined) & (target.type == "aa.merchant.Merchant") & (target.code == "merchantCharacter.ZZY01") & (target.value == "2")) {
      return { validityCode: 1, message: "合法！" };
    } else if ((s1 != undefined) & (s1.value == "12") & (target != undefined) & (target.type == "aa.merchant.Merchant") & (target.code == "merchantCharacter.ZZY01") & (target.value == "3")) {
      return { validityCode: 2, message: "钢种不合法！" };
    } else {
      return { assign }; // 注意：不能return null
    }
  }
}
exports({ entryPoint: MyAPIHandler });