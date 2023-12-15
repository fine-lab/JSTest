let AbstractTrigger = require("AbstractTrigger");
var accessToken;
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询所有状态为 具有部分退款标识的订单
    getAccessToken();
    //过滤表头自定义项8为allReturned的订单
    let finishedOrders = querySaleOrders();
    if (finishedOrders.length == 0) {
      return;
    }
    //对这些订单进行整单关闭
    for (let order of finishedOrders) {
      try {
        //判断是否关闭
        let body = {
          billnum: "voucher_order",
          datas: [
            {
              id: order.id,
              code: order.code,
              definesInfo: [
                {
                  define8: "inPartReturn",
                  isHead: true,
                  isFree: true
                }
              ]
            }
          ]
        };
        //判断当前订单是否已经全部退货完成
        let totalNum = 0;
        let totaldelivered = 0;
        let totalPartReturn = 0;
        //查询订单详情
        // 根据ID请求订单详情(订单详情不支持code查询)
        order = postman("get", "https://www.example.com/" + accessToken + "&id=" + order.id, "", "");
        order = judge(order, "查询销售订单详情异常").data;
        for (let orderDetail of order.orderDetails) {
          let priceQty = Number(orderDetail.priceQty);
          let sendPriceQty = Number(orderDetail.sendPriceQty);
          let partReturnQty = Number(orderDetail.bodyFreeItem.define4);
          totalNum += priceQty;
          totaldelivered += sendPriceQty;
          totalPartReturn += partReturnQty;
        }
        if (totalNum == totaldelivered + totalPartReturn || totalNum < totaldelivered + totalPartReturn) {
          //全部退货完成修改标记
          body.datas[0].definesInfo[0].define8 = "allReturned";
          //关闭订单
          closeOrder(order);
          //更新自定义项
          alertOrderDefine(body);
        }
      } catch (error) {
        throw new Error(error);
        //什么都不做,继续尝试关闭下一个订单
      }
    }
    return { finishedOrders };
  }
}
exports({ entryPoint: MyTrigger });
function getAccessToken() {
  if (accessToken === undefined) {
    accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
  }
  return accessToken;
}
function querySaleOrders() {
  let reqBody = {
    pageIndex: "1",
    pageSize: "999",
    isSum: true,
    simpleVOs: [
      {
        op: "eq",
        value1: "inPartReturn",
        field: "headFreeItem.define8"
      }
    ]
  };
  // 根据code请求单据列表
  let saleOrderData = postman("post", "https://www.example.com/" + accessToken, "", JSON.stringify(reqBody));
  return judge(saleOrderData, "查询订单列表失败").data.recordList;
}
function closeOrder(order) {
  let body = {
    data: {
      lockIn: false,
      status: 1,
      code: order.code,
      id: order.id
    }
  };
  let header = {};
  let strResponse = postman("post", "https://www.example.com/" + accessToken, JSON.stringify(header), JSON.stringify(body));
  return judge(strResponse, "关闭订单失败");
}
function judge(strResponse, msg) {
  let res = JSON.parse(strResponse);
  if (res.code != "200") {
    throw new Error(msg + " , " + res.message);
  }
  return res;
}
function alertOrderDefine(data) {
  let body = data;
  let header = {};
  let strResponse = postman("post", "https://www.example.com/" + accessToken, JSON.stringify(header), JSON.stringify(body));
  let res = judge(strResponse);
  return res.data;
}