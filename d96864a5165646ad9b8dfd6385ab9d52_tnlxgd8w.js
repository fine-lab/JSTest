let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 值范围：返回Map，key为range
    let sources = request.sources; // 条件数组
    let s1 = sources.filter((item) => {
      return (item.code == "yptcsb_zyx005") & (item.type == "FreeCT");
    })[0]; //物料属性特征组.zxc-产品分类//类字段值可以从右侧规则条件中选取
    let target = request.target; // 结果数组
    if (
      (s1 != undefined) &
      (s1.value == "123") & //盘元
      (target != undefined) &
      (target.type == "FreeCT") &
      (target.code == "yptcsb_zyx019")
    ) {
      return { range: ["1599251757618692101", "1599251757618692102"] }; ////1599251757618692101(汉族)，1599251757618692102(满族) 参照类字段值可以从右侧规则条件中选取
    } else if (
      (s1 != undefined) &
      (s1.value == "456") & // 直棒
      (target != undefined) &
      (target.type == "FreeCT") &
      (target.code == "yptcsb_zyx019")
    ) {
      return { range: ["1599251757618692105", "1599251757618692106"] }; ////1599251757618692105(回族)，1599251757618692106(高山族) 参照类字段值可以从右侧规则条件中选取
    } else {
      return {}; // 注意：不能return null
    }
  }
}
exports({ entryPoint: MyAPIHandler });