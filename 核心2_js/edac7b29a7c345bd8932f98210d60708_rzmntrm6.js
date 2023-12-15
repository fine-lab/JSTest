let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //返回数据
    let ruturnData = {};
    //前台传递数据
    let billData = request.billdata;
    var xsList = new Array();
    var dbList = new Array();
    var cgList = new Array();
    //子表数据
    var bodyRes = billData.salesAdvanceOrder_bList;
    let total = 0;
    for (var i = 0; i < bodyRes.length; i++) {
      let bodyData = bodyRes[i];
      if (bodyData.subQty > 0) {
        //销售数量
        total = total + bodyData.oriSum;
        xsList.push(bodyData);
      }
      if (bodyData.tranQty > 0) {
        //调拨数量
        dbList.push(bodyData);
      }
      if (bodyData.purcQty > 0) {
        //采购数量
        cgList.push(bodyData);
      }
    }
    billData.payMoney = total;
    var isok = true;
    if (xsList.length > 0) {
      let func1 = extrequire("GT83441AT1.backDefaultGroup.insertSalesOrder");
      let xsRes = func1.execute(billData, xsList);
      if (xsRes.result.code != 200) {
        ruturnData = { code: xsRes.result.code, message: "生成销售订单失败：" + xsRes.result.message };
        isok = false;
      }
    }
    if (isok && dbList.length > 0) {
      for (var j = 0; j < dbList.length && isok; j++) {
        let dbdata = dbList[j];
        let func2 = extrequire("GT83441AT1.backDefaultGroup.insertTransferApply");
        billData.ss = j;
        let dbRes = func2.execute(billData, dbdata);
        if (dbRes.result.data.messages.length > 0) {
          ruturnData = { code: 999, message: "生成调拨订单失败：" + dbRes.result.data.messages };
          isok = false;
        }
      }
    }
    if (isok && cgList.length > 0) {
      let func3 = extrequire("GT83441AT1.backDefaultGroup.insertApplyOrder");
      let cgRes = func3.execute(billData, cgList);
      if (cgRes.result.code != 200) {
        ruturnData = { code: cgRes.result.code, message: "生成请购单失败：" + cgRes.result.message };
        isok = false;
      }
    }
    var updateobject = { id: billData.id, pushdown: "true" };
    var res = ObjectStore.updateById("GT83441AT1.GT83441AT1.salesAdvanceOrder", updateobject, "c1591890");
    if (isok) {
      ruturnData = {
        code: 200,
        message: "下推成功！"
      };
    }
    return { ruturnData };
  }
}
exports({ entryPoint: MyAPIHandler });