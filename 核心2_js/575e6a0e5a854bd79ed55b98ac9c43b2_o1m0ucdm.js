let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //接收采购年度计划数据
    let object = {
      id: request.id,
      name: request.name, //计划标题
      year: request.year, //计划年度
      org: request.org, //组织
      yslx: request.yslx, //预算类型
      project: request.project, //项目
      adminOrgVO: request.adminOrgVO, //部门
      fylx: request.fylx, //费用类型
      planmoney: request.planmoney, //年度预算总额
      oddmoney: request.oddmoney, //年度剩余预算
      yymoney: request.yymoney //年度已用预算
    };
    var result;
    if (request.id) {
      result = ObjectStore.updateById("AT15E7378809680006.AT15E7378809680006.cgndjh", object, "eca4c465");
    } else {
      result = ObjectStore.insert("AT15E7378809680006.AT15E7378809680006.cgndjh", object, "eca4c465");
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });