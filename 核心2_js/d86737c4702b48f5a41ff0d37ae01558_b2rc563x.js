let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取并进行校验
    if (param.pageIndex <= 0 || param.pageSize <= 0) {
      return {
        success: false,
        error: "分页查询参数不合法，请使用合法参数"
      };
    }
    //进行分页查询-拼接SQL语句
    let pageSql = "select ";
    let lines = param.lines;
    let conditions = param.conditions;
    let lineString = "";
    //判定lines的情况并进行预处理
    if (lines != undefined) {
      for (var i = 0; i < lines.length; i++) {
        if (i < lines.length - 1) {
          lineString += lines[i] + ", ";
        } else {
          lineString += lines[i];
        }
      }
    } else {
      lineString = "*";
    }
    //对conditions进行判定
    if (conditions == undefined || conditions == null) {
      conditions = " ";
    }
    pageSql = pageSql + lineString + " from " + param.tableUrl + conditions + " limit " + param.pageIndex + "," + param.pageSize;
    var res = ObjectStore.queryByYonQL(pageSql);
    return {
      success: true,
      datas: res,
      pageSql: pageSql
    };
  }
}
exports({ entryPoint: MyTrigger });