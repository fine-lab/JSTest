let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //列表页面销售订单齐套检查
    //获取销售出库
    let rows = request.rows;
    //获取销售订单详情
    let func_1 = extrequire("SCMSA.backDefaultGroup.getSaleOrderDetail");
    //获取物料现存量
    let func_2 = extrequire("SCMSA.backDefaultGroup.getQuantityonhand");
    //更改销售订单
    let func_3 = extrequire("SCMSA.backDefaultGroup.updateSaleOrder");
    let rst = [];
    let response = [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      let id = {
        id: row.id
      };
      let func_1Return = func_1.execute(id);
      let saleOrder = func_1Return.data;
      let orderDetails = saleOrder.orderDetails;
      let availableqtyCheck = [];
      for (var j = 0; j < orderDetails.length; j++) {
        let orderDetail = orderDetails[j];
        let xclBody = {
          org: saleOrder.salesOrgId + "",
          warehouse: orderDetail.stockId + "",
          product: orderDetail.productId + "",
          productsku: orderDetail.skuId + ""
        };
        let quantit = func_2.execute(xclBody);
        let quantitResult = quantit.result;
        let availableqty = quantitResult.availableqty;
        let qty = orderDetail.qty;
        let checkResult = {
          orderDetailId: orderDetail.id + "",
          result: ""
        };
        if (availableqty >= qty) {
          checkResult.result = true;
        } else {
          checkResult.result = false;
        }
        availableqtyCheck.push(checkResult);
      }
      let updateBody = {
        saleBody: saleOrder,
        availableqtyCheck: availableqtyCheck
      };
      rst.push(func_3.execute(updateBody));
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });