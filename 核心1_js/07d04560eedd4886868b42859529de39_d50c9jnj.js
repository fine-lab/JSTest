let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //审批完之后更新囤货入库指令的
    let data = param.sendDataToFi.data;
    let billSource = data.source;
    if (billSource != "developplatform.yba160dbe1") {
      //来源是囤货入库指令
      return {};
    }
    let orderDetails = data.purchaseOrders;
    let sendData = { inType: "1" }; // 单据类型=采购订单
    let action = param.sendDataToFi.action;
    let result = []; // 结果数据
    for (let i = 0; i < orderDetails.length; i++) {
      let item = {};
      if (action == "delete") {
        //审批完-撤回
        item.approveType = "R";
      } else {
        //审批通过
        item.approveType = "Y";
      }
      //采购订单
      item.billType = "1";
      //补货指令ID(taskDirectiveId)
      item.taskDirectiveId = orderDetails[i].extendTaskDirectiveId;
      //物料编码(resItemCode)
      item.resItemCode = orderDetails[i].extendResItem;
      //指令类型(directiveType)
      item.directiveType = "IN";
      //入库指令ID(directiveId)
      item.directiveId = orderDetails[i].extendDirectiveId;
      item.resPoNumber = data.code;
      //下单数量--数量
      item.resQuantity = orderDetails[i].qty;
      //下单时间--PO单据日期
      item.resOrderTime = data.vouchdate;
      //预计发送日期--采购订单计划到货日期（计划发货日期）
      item.esdDate = orderDetails[i].recieveDate;
      //预计到货日期--采购订单计划到货日期（计划发货日期）
      item.etaDate = orderDetails[i].recieveDate;
      //采购订单子表id
      item.purchaseOrderDetailId = orderDetails[i].id;
      //囤货入库主表id
      item.mainId = orderDetails[i].sourceid;
      result.push(item);
    }
    if (result.length > 0) {
      sendData.result = result;
      // 调接口回写数据
      let env = ObjectStore.env();
      let tenantid = env.tenantId;
      let url = "https://www.example.com/" + tenantid + "/product_ref/product_ref_01/updateInApi";
      let response = openLinker("POST", url, "PU", JSON.stringify({ data: sendData }));
      response = JSON.parse(response);
      if (response.code != "200") {
        throw new Error("同步囤货入库数量出错！请联系管理员！");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });