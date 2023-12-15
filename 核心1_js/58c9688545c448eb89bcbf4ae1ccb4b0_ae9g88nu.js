let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取页面传参对象
    var verifystate = request.verifystate;
    if (verifystate == 2) {
      throw new Error("已审核的解除停售单不允许修改！");
    }
    // 以下是表体校验
    // 获取表体，但是存在表体不变后端函数获取到空的情况
    var detaillist = request.detaillist;
    // 校验是不是存在相同的物料或已审批，或者开立态 (若动作为修改，则需要去掉当前行)
    if (detaillist == "undefined" || detaillist.length == 0) {
      // 若表体没有变化直接返回
      return {};
    }
    var errors = [];
    var currentMap = {};
    // 循环表体
    for (var i = 0; i < detaillist.length; i++) {
      var detail = detaillist[i];
      var sqlstr = "select id,SY_01relievetopsale_id.code as code from GT22176AT10.GT22176AT10.SY01_detailson where sourcechild_id ='" + detail.sourcechild_id + "'";
      if (detail.id != "undefined" && detail.id != null) {
        sqlstr += " and id != '" + detail.id + "'";
      }
      var res = ObjectStore.queryByYonQL(sqlstr);
      if (res.length > 0) {
        //查询到
        errors.push("第" + (i + 1) + "行已经药品存在相同批次的解除停售单！单号:" + res[0].code);
      }
      var tmp = detail.sourcechild_id;
      if (tmp == "undefined" || tmp == null) {
        errors.push("第" + (i + 1) + "行记录没有来源！");
      }
      // 将当前行号及批号放入实体
      currentMap[tmp] = i + 1;
    }
    // 拼装错误返回提示
    if (errors.length > 0) {
      var errStr = "";
      for (var i = 0; i < errors.length; i++) {
        errStr = errStr + (errStr.length == 0 ? "" : "\n");
        errStr = errStr + errors[i];
      }
      return { errInfo: errStr };
    }
    return { flag: true };
  }
}
exports({ entryPoint: MyAPIHandler });