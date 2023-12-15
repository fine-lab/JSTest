let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取页面传参对象
    var obj = param.data[0];
    var verifystate = obj.verifystate;
    if (verifystate == 2) {
      throw new Error("已审核的停售单不允许修改！");
    }
    // 以下是表体校验
    // 获取表体，但是存在表体不变后端函数获取到空的情况
    var detaillist = obj.SY01_suspensionsonList;
    // 校验是不是存在相同的物料或已审批，或者开立态 (若动作为修改，则需要去掉当前行)
    if (detaillist == "undefined" || detaillist.length == 0) {
      // 若表体没有变化直接返回
      return;
    }
    // 循环表体
    for (var i = 0; i < detaillist.length; i++) {
      var detail = detaillist[i];
      var sqlstr = "select * GT22176AT10.GT22176AT10.SY01_suspensionson limit 0,2";
      var res = ObjectStore.queryByYonQL("sql代码");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });