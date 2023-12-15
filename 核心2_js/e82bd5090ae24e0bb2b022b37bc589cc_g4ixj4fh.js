let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取页面的合计字段
    var xiangjinchengdanjineheji = param.data[0].xiangjinchengdanjineheji;
    var zongjineheji = param.data[0].zongjineheji;
    // 获取子表
    var X00301List = param.data[0].X00301List;
    // 计算子表合计信息
    var zibiaocdheji = 0;
    var zibiaoheji = 0;
    for (var i = 0; i < X00301List.length; i++) {
      zibiaocdheji += X00301List[i].xiangjinchengdanjine;
      zibiaoheji += X00301List[i].heji;
    }
    //校验子表合计是否与主表合计相等
    if (xiangjinchengdanjineheji != zibiaocdheji || zongjineheji != zibiaoheji) {
      throw new Error("保存前必须先进行合计！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });