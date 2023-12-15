let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var uri = "GT21859AT11.GT21859AT11.ceshi002"; //拿到需要修改的表uri
    //用来查询三个月最高最低价
    //分离查询sql  先从子表通过物料中获取最近一次时间的订单，再从主表中获取采购价格
    //查询子表 拿到字段的物料编码
    //设变量 拿值  赋值
    //查询重点物资sql
    var sql = "select * from GT21859AT11.GT21859AT11.productzsb where productcode = '" + id + "' ";
    var req = ObjectStore.queryByYonQL(sql);
    var ceshi = "";
    if (req.length == 1) {
      ceshi = "1";
    } else {
      ceshi = "2";
    }
    var sql1 = "select * " + "from pu.purchaseorder.PurchaseOrder t " + "left join pu.purchaseorder.PurchaseOrders t1 on t.id=t1.mainid"; //查询sql
    let req1 = ObjectStore.queryByYonQL(sql1, "upu");
    //查询周期定价协议合同
    //设置一个查询sql判断查出数据是否为一条 如果是一条则返回查出的数据 如果不是一条则让前端弹出选择框
    return { shenqingrenid: "123", ceshi: ceshi, request: request };
  }
}
exports({ entryPoint: MyAPIHandler });