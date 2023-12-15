let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = JSON.parse(param.requestData);
    let func1 = extrequire("GT101792AT1.common.sendCkGd");
    let method = "CANCEL_SO";
    //正式环境需要切换
    //普通销售发货、大贸订单发货、活动样品发货、客情订单发货
    if (
      data.transactionTypeId == "1471579550858608652" ||
      data.transactionTypeId == "1471579696863379465" ||
      data.transactionTypeId == "1471579808550354954" ||
      data.transactionTypeId == "1471579963167604740"
    ) {
      let Body = {};
      if (data.stockOrgId == "1473045320098643975") {
        //依安工厂
        Body.warehouseId = "yourIdHere";
        Body.customerId = "yourIdHere";
      } else if (data.stockOrgId == "1473041368737644546") {
        //克东
        Body.warehouseId = "yourIdHere";
        Body.customerId = "yourIdHere";
      } else if (data.stockOrgId == "2786425894965504") {
        //苏州仓
        //苏州仓
        Body.warehouseId = "KSDS";
        Body.customerId = "001";
      }
      Body.docNo = data.code;
      if (data.transactionTypeId == "1471579550858608652") {
        Body.orderType = "XC01";
      }
      if (data.transactionTypeId == "1471579696863379465") {
        Body.orderType = "XC02";
      }
      if (data.transactionTypeId == "1471579808550354954") {
        Body.orderType = "XC03";
      }
      if (data.transactionTypeId == "1471579963167604740") {
        Body.orderType = "XC04";
      }
      let wmsBody = {
        data: {
          ordernos: Body
        }
      };
      let param = {
        data: wmsBody,
        method: method
      };
      let res = func1.execute(null, param);
      let sendWMSResult = res.jsonResponse;
      let Response = sendWMSResult.Response.return;
      if (Response.returnCode != "0000") {
        throw new Error("YS销售发货调用WMS【出库单改单接口】异常：" + JSON.stringify(Response.returnDesc));
      } else if (Response.returnFlag != "1") {
        throw new Error("YS销售发货调用WMS【出库单改单接口】成功：returnFlag为" + JSON.stringify(Response.returnFlag) + ",此数据不可修改!");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });