let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let o2o_sku_id = request.o2o_sku_id;
    let o2o_sku_name = request.o2o_sku_name;
    let o2o_sku_spec = request.o2o_sku_spec;
    let o2o_sku = {
      o2o_sku_id: o2o_sku_id,
      o2o_sku_name: o2o_sku_name,
      o2o_sku_spec: o2o_sku_spec,
      o2o_plat: 1,
      o2o_qty: 1
    };
    //保存美团物料信息
    var res = ObjectStore.insert("AT18D4028C3F280009.AT18D4028C3F280009.o2oys_sku_mapping", o2o_sku, "o2oys_sku_mappingList");
    //查询美团物料变更维护人员
    var sql = "select customer from AT18D4028C3F280009.AT18D4028C3F280009.o2o_sku_push_recevier where o2o_plat = 1 and dr = 0 ";
    var mtusers = ObjectStore.queryByYonQL(sql);
    if (mtusers.length == 0) {
      return { res };
    }
    var uspaceReceiver = [];
    for (let i = 0; i < mtusers.length; i++) {
      uspaceReceiver.push(mtusers[i].customer);
    }
    //通过相关人员处理美团-YS映射关系
    var channels = ["uspace"];
    var title = "美团更新菜品通知";
    var content = "美团新增了物料[" + o2o_sku_name + "],请到【O2O-YS物料对照】页面维护两边对照关系";
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content
    };
    var result = sendMessage(messageInfo);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });