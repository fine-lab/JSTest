let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data;
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    // 获取token
    let func123 = extrequire("PU.public.GetToken");
    let res = func123.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "弃审";
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    for (let i = 0; i < Data.length; i++) {
      var id = Data[i].id;
      var bustype = Data[i].bustype;
      // 调用公共脚本
      let param1 = { context: "12312" };
      let param2 = { id: id };
      let func = extrequire("PU.public.TestAfter");
      let kpl = func.execute(param1, param2);
      var OrderList = kpl.returnList.OrderList;
      var MainData = kpl.returnList.mainData;
      if (OrderList.length > 0) {
        if (MainData != undefined || MainData != null) {
          if (bustype != "1501320550199853065") {
            if (bustype == "2369198632096257" || bustype == "1765404414066556936" || bustype == "1514364048068050952") {
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
              let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
              let str = JSON.parse(strResponse);
              // 打印日志
              let LogBody = {
                data: { code: param.data[0].code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
              };
              let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(headers), JSON.stringify(LogBody));
              console.log(LogResponse);
              if (str.success != true) {
                throw new Error("调用OMS退供订单取消API失败！失败原因为：" + str.errorMessage);
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
              let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
              let str = JSON.parse(strResponse);
              // 打印日志
              let LogBody = {
                data: { code: param.data[0].code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
              };
              let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(headers), JSON.stringify(LogBody));
              console.log(LogResponse);
              if (str.success != true) {
                throw new Error("调用OMS退供订单取消API失败!失败原因为：" + str.errorMessage);
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });