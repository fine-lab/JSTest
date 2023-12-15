let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ProjectCode = request.ProjectCode;
    var ProjectName = request.ProjectName;
    //检验项目编码或项目名称是否为空
    if (ProjectCode === "undefined" || ProjectCode === null || ProjectCode === "" || ProjectName === "undefined" || ProjectName === null || ProjectName === "") {
      throw new Error("项目编码或项目名称不能为空！");
    }
    //检验当前项目编码是否已存在
    let sql = "select * from GT9603AT10.GT9603AT10.QuoteBill_Prj_wz where 1=1 and ProjectCode='" + ProjectCode + "'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      throw new Error("当前项目编码已存在！");
    }
    //检验当前项目名称是否已存在
    sql = "select * from GT9603AT10.GT9603AT10.QuoteBill_Prj_wz where 1=1 and ProjectName='" + ProjectName + "'";
    res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      throw new Error("当前项目名称已存在！");
    }
    var object = { ProjectCode: ProjectCode, ProjectName: ProjectName };
    res = ObjectStore.insert("GT9603AT10.GT9603AT10.QuoteBill_Prj_wz", object, "QuoteBill_Prj_wz");
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });