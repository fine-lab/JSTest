let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let action = param.action;
    let source = param.data[0].source;
    if (source != "developplatform.yba160dbe1") {
      return {};
    }
    //新增或者删除更新囤货入库指令的下单数量和余量
    let sendData = { inType: "1" }; // 单据类型=采购订单
    let result = []; // 结果数据
    if (action == "save") {
      //保存或者更新
      let orderDetails = param.data[0].purchaseOrders;
      let oldOrderDetails = param.beforeUpdateBill ? param.beforeUpdateBill.purchaseOrders : "";
      if (oldOrderDetails == "") {
        //保存
        for (let i = 0; i < orderDetails.length; i++) {
          let item = {};
          item.actionType = "S";
          //囤货入库主表ID
          item.id = orderDetails[i].sourceid;
          //下单数量--数量
          item.resQuantity = orderDetails[i].qty;
          result.push(item);
        }
      } else {
        //更新
        for (let i = 0; i < orderDetails.length; i++) {
          let item = {};
          let newId = orderDetails[i].id;
          item.resQuantity = orderDetails[i].qty;
          for (let j = 0; j < oldOrderDetails.length; j++) {
            let oldId = oldOrderDetails[j].id;
            if (newId == oldId) {
              //下单数量--数量
              item.resQuantity = item.resQuantity - oldOrderDetails[j].qty;
            }
          }
          item.actionType = "S";
          //囤货入库主表ID
          item.id = orderDetails[i].sourceid;
          result.push(item);
        }
      }
    } else {
      //删除
      let orderDetails = param._originalObjLst;
      for (let i = 0; i < orderDetails.length; i++) {
        let item = {};
        item.actionType = "D";
        //囤货入库主表ID
        item.id = orderDetails[i].sourceid;
        //下单数量--数量
        item.resQuantity = orderDetails[i].qty;
        result.push(item);
      }
    }
    if (result.length > 0) {
      sendData.result = result;
      // 调接口回写数据
      let env = ObjectStore.env();
      let tenantid = env.tenantId;
      let url = "https://www.example.com/" + tenantid + "/product_ref/product_ref_01/updateInNumApi";
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