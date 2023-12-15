let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var jsonData = JSON.stringify(context); // 转成JSON格式
    var jsonparam = JSON.stringify(param); // 转成JSON格式
    var parentId = param.data[0].id;
    var object = { parent: parentId, dr: 0, tenant_id: tid };
    var res = ObjectStore.selectByMap("IDX_02.IDX_02.dxq_location", object);
    if (res.length > 0) {
      throw new Error("该数据有子数据，不能删除！");
    }
    var sqllocaltionNum = "select count(1) as num from IDX_02.IDX_02.dxq_location where dr=0 and parent='" + parentId + "'";
    var res = ObjectStore.queryByYonQL(sqllocaltionNum);
    var checkNum = res[0]["num"];
    if (checkNum > 0) {
      throw new Error("该数据有子数据，不能删除！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });