let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var jsonData = JSON.stringify(context); // 转成JSON格式
    var jsonparam = JSON.stringify(param); // 转成JSON格式
    var parentId = param.data[0].id;
    var object = { id: parentId, dr: 0, tenant_id: tid };
    var res = ObjectStore.selectByMap("Idx3.Idx3.dxq_location", object);
    if (res.length == 0) {
      throw new Error("该数据操作异常");
    }
    var objentity = res[0];
    var objectList = { parent: parentId, dr: 0, tenant_id: tid };
    var resList = ObjectStore.selectByMap("Idx3.Idx3.dxq_location", objectList);
    var objList = [];
    for (var i = 0; i < resList.length; i++) {
      var objItem = resList[i];
      objList.push({ id: objItem.id, parentName: objentity.locationName });
    }
    if (objList.length > 0) {
      var resEdit = ObjectStore.updateBatch("Idx3.Idx3.dxq_location", objList, "708186e0");
      if (resEdit.length == 0) throw new Error(JSON.stringify("操作失败！"));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });