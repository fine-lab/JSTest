let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var { id, ParentNo } = request;
    //根据父报价单和主报价单标识，获取该报价单的ID
    let querySql = "select id from GT9604AT11.GT9604AT11.QuoteBill_M where 1=1 and dr = 0 and IsMaster=1 and ParentNo ='" + ParentNo + "'";
    var res = ObjectStore.queryByYonQL(querySql);
    //基于ID的更新--将原本的主报价单标志IsMaster改为0
    var object_o = { id: res[0].id, IsMaster: "0" };
    res = ObjectStore.updateById("GT9604AT11.GT9604AT11.QuoteBill_M", object_o);
    //根据传递进来的报价单id，将该报价单设置为主报价单
    var object_m = { id: id, IsMaster: "1" };
    res = ObjectStore.updateById("GT9604AT11.GT9604AT11.QuoteBill_M", object_m);
    return { result: res };
  }
}
exports({ entryPoint: MyAPIHandler });