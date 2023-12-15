let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data;
    for (let i = 0; i < Data.length; i++) {
      var id = Data[i].id;
      var bustype = Data[i].bustype;
      // 调用公共脚本
      let param1 = { context: "12312" };
      let param2 = { param: id };
      let func = extrequire("PU.rule.TestAfter");
      let kpl = func.execute(param1, param2);
      var OrderList = kpl.returnList.OrderList;
      var MainData = kpl.returnList.mainData;
      if (OrderList.length > 0) {
        if (MainData != undefined || MainData != null) {
          if (bustype == "1460887556171235509") {
            let jsonBody = {
              outBizOrderCode: MainData.outBizOrderCode,
              bizOrderType: "OUTBOUND",
              subBizOrderType: "TGCK",
              createTime: MainData.createTime,
              warehouseCode: MainData.warehouseCode,
              ownerCode: MainData.ownerCode,
              orderLines: OrderList,
              channelCode: "XDQD",
              supplierCode: MainData.supplierCode,
              supplierName: MainData.supplierName,
              senderInfo: null,
              SourcePlatformCode: "DY",
              status: "WAIT_INBOUND"
            };
            let body = {
              appCode: "beiwei-ys",
              appApiCode: "ys.to.oms.tgck.order.cancel",
              schemeCode: "bw47",
              jsonBody: jsonBody
            };
            let header = { key: "yourkeyHere" };
            let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(body));
            let str = JSON.parse(strResponse);
            if (str.success != true) {
              throw new Error("调用OMS退供订单取消API失败！" + str.message);
            }
          } else {
            let jsonBody = {
              outBizOrderCode: MainData.outBizOrderCode,
              bizOrderType: "INBOUND",
              subBizOrderType: "CGRK",
              createTime: MainData.createTime,
              warehouseCode: MainData.warehouseCode,
              ownerCode: MainData.ownerCode,
              orderLines: OrderList,
              channelCode: "XDQD",
              supplierCode: MainData.supplierCode,
              supplierName: MainData.supplierName,
              senderInfo: null,
              SourcePlatformCode: "DY",
              status: "WAIT_INBOUND"
            };
            let body = {
              appCode: "beiwei-ys",
              appApiCode: "ys.to.oms.cancel.order",
              schemeCode: "bw47",
              jsonBody: jsonBody
            };
            let header = { key: "yourkeyHere" };
            let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(body));
            let str = JSON.parse(strResponse);
            if (str.success != true) {
              throw new Error("调用OMS退供订单取消API失败!" + str.message);
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });