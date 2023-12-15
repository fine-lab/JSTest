let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ProjectCode = request.ProjectCode;
    var ProjectName = request.ProjectName;
    var CustomerCode = request.CustomerCode;
    var CustomerName = request.CustomerName;
    //校验项目编码是否为空
    if (typeof ProjectCode === "undefined" || ProjectCode === null || ProjectCode === "") {
      throw new Error("项目编码不能为空！");
    }
    //校验项目名称是否为空
    if (typeof ProjectName === "undefined" || ProjectName === null || ProjectName === "") {
      throw new Error("项目名称不能为空！");
    }
    //校验客户编码是否为空
    if (typeof CustomerCode === "undefined" || CustomerCode === null || CustomerCode === "") {
      throw new Error("客户编码不能为空！");
    }
    //校验客户名称是否为空
    if (typeof CustomerName === "undefined" || CustomerName === null || CustomerName === "") {
      throw new Error("客户名称不能为空！");
    }
    //检验当前项目编码是否已存在
    let sql = "select * from GT9604AT11.GT9604AT11.QuoteBill_Prj where 1=1 and ProjectCode='" + ProjectCode + "'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      throw new Error("当前项目编码已存在！");
    }
    //检验当前项目名称是否已存在
    sql = "select * from GT9604AT11.GT9604AT11.QuoteBill_Prj where 1=1 and ProjectName='" + ProjectName + "'";
    res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      throw new Error("当前项目名称已存在！");
    }
    var object = { ProjectCode: ProjectCode, ProjectName: ProjectName, CustomerCode: CustomerCode, CustomerName: CustomerName, enable: 1 };
    res = ObjectStore.insert("GT9604AT11.GT9604AT11.QuoteBill_Prj", object, "QuoteBill_Prj_wz");
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });