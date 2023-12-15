let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let orderDetails = data[0].orderDetails;
    let sendData = { outType: "1" }; // 单据类型=销售订单
    let result = []; // 结果数据
    for (let i = 0; i < orderDetails.length; i++) {
      if (orderDetails[i].extendOutId) {
        // 囤货出库的数据
        let item = {};
        if (orderDetails[i]._status == "Delete") {
          item.isDelete = "Y";
          item.outCount = -orderDetails[i].qty + "";
        } else {
          item.outCount = orderDetails[i].qty + "";
        }
        item.outType = "1"; // 单据类型=销售订单
        item.outCode = data[0].code; // 单据编码
        item.outDate = data[0].vouchdate; // 出库时间=单据日期
        item.extendOutId = orderDetails[i].extendOutId; // 囤货出库关联标识
        item.extendOutItem = orderDetails[i].extendOutItem; // 物料ID
        result.push(item);
      }
    }
    if (result.length > 0) {
      sendData.result = result;
      // 调接口回写数据
      let env = ObjectStore.env();
      let tenantid = env.tenantId;
      let url = "https://www.example.com/" + tenantid + "/product_ref/product_ref_01/updateOutApi";
      let response = openLinker("POST", url, "SCMSA", JSON.stringify({ data: sendData }));
      response = JSON.parse(response);
      if (response.code != "200") {
        throw new Error("同步囤货出库数量出错！请联系管理员！");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });