let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 赋值：返回一个key，assign 结果值
    let sources = request.sources; //条件数组
    let s1 = sources.filter((item) => {
      return (item.code == "ceshiziList.productFreeCT.yptcsb_zyx003") & (item.type == "AT160CC37617400002.AT160CC37617400002.ceshizhu");
    })[0]; // 条件：物料属性特征组.zxc-产品大类//类字段值可以从右侧规则条件中选取
    let target = request.target; //结果
    if (
      (s1 != undefined) &
      (s1.value == "123") & //  A胚1494453172424933387
      (target != undefined) &
      (target.type == "AT160CC37617400002.AT160CC37617400002.ceshizhu") &
      (target.code == "ceshiziList.productFreeCT.yptcsb_zyx018")
    ) {
      return { assign: "1599251456970981383" }; //ISO  1494464167541211141                                    //结果：物料属性特征组.zxc-公差码//1599251456970981383(中国大陆) 参照类字段值可以从右侧规则条件中选取
    } else if (
      (s1 != undefined) &
      (s1.value == "456") & //C棒
      (target != undefined) &
      (target.type == "AT160CC37617400002.AT160CC37617400002.ceshizhu") &
      (target.code == "ceshiziList.productFreeCT.yptcsb_zyx018")
    ) {
      return { assign: "1599251456970981384" }; //ASTM   1494464158951276560//1599251456970981384(中国台湾) 参照类字段值可以从右侧规则条件中选取
    } else {
      return {}; // 注意：不能return null
    }
  }
}
exports({ entryPoint: MyAPIHandler });