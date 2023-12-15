let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //列表页面推采购
    let rows = request.rows;
    //获取销售订单详情
    let func_1 = extrequire("SCMSA.backDefaultGroup.getSaleOrderDetail");
    //获取采购订单body
    let func_2 = extrequire("SCMSA.backDefaultGroup.makeCGDDbody");
    //更改销售订单下推采购订单状态
    let func_3 = extrequire("SCMSA.backDefaultGroup.updateXTcgddData");
    //发送采购订单
    let func_4 = extrequire("SCMSA.backDefaultGroup.addCGDD");
    //判断下游是否有采购订单
    let func_5 = extrequire("SCMSA.backDefaultGroup.getCGDDorder");
    let rst = [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      let id = {
        id: row.id
      };
      let isCGDD = func_5.execute(null, row.code);
      if (isCGDD.result == true) {
        let haveCGDD = {
          result: { code: "999", message: "该销售订单已下推采购订单，请勿重复下推" }
        };
        rst.push(haveCGDD);
      } else {
        let func_1Return = func_1.execute(id);
        let saleOrder = func_1Return.data;
        let param = {
          saleOrder: saleOrder,
          id: row.id
        };
        let func_2Return = func_2.execute(null, param);
        let func_4Return = func_4.execute(null, func_2Return.body);
        rst.push(func_4Return);
      }
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });