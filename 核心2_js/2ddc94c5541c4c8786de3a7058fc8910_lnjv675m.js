let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var tenantId = currentUser.tenantId; //用户id
    let olddata = request.org; //添加的组织信息
    let obj = {
      createTime: olddata.creationtime, //创建时间
      creator: olddata.creator, //创建人
      own_enable: olddata.enable, //启用状态
      name: olddata.name.zh_CN, //名称
      own_orgtype: olddata.orgtype, //部门类型
      shortname: olddata.name.zh_CN, //简称
      sys_orgId: olddata.id, //系统组织
      sys_parent: olddata.parentid, //上级系统组织
      sys_code: olddata.code //系统编码
    };
    if (request.par !== undefined && request.par !== null) {
      obj.parent = request.par;
    }
    let func1 = extrequire("GT34544AT7.ownOrg.ownOrgInsert");
    request.object = obj;
    let accept = func1.execute(request);
    let acc = accept.res;
    return { olddata: olddata, acc: acc };
  }
}
exports({ entryPoint: MyAPIHandler });