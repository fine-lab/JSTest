let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = JSON.parse(param.requestData);
    let funcRk = extrequire("GT101792AT1.common.sendRgGd");
    let funcCk = extrequire("GT101792AT1.common.sendCkGd");
    let method = "";
    //正式环境需要切换
    if (data.busType == "1471570368221675524" || data.busType == "1481745515210604554") {
      //包材采购到货、包材采购退货
      let Body = {};
      if (data.org == "1473045320098643975") {
        //依安工厂
        Body.warehouseId = "yourIdHere";
        Body.customerId = "yourIdHere";
      } else if (data.org == "1473041368737644546") {
        //克东
        Body.warehouseId = "yourIdHere";
        Body.customerId = "yourIdHere";
      }
      Body.docNo = data.code;
      let wmsBody = {
        data: {
          ordernos: Body
        }
      };
      if (data.busType == "1471570368221675524") {
        method = "CANCEL_ASN";
        Body.asnType = "RK02"; //入库
      } else if (data.busType == "1481745515210604554") {
        method = "CANCEL_SO";
        Body.orderType = "RK02"; //采购退货出库
      }
      let param = {
        data: wmsBody,
        method: method
      };
      if (method == "CANCEL_ASN") {
        let RKres = funcRk.execute(null, param);
        let sendWMSResult = RKres.jsonResponse;
        let Response = sendWMSResult.Response.return;
        if (Response.returnCode != "0000") {
          throw new Error("YS采购到货调用WMS【入库单改单接口】异常：" + JSON.stringify(Response.returnDesc));
        } else if (Response.returnFlag != "1") {
          throw new Error("YS采购到货调用WMS【入库单改单接口】成功：returnFlag为" + JSON.stringify(Response.returnFlag) + ",此数据不可修改!");
        }
      } else if (method == "CANCEL_SO") {
        let CKres = funcCk.execute(null, param);
        let sendWMSResult = CKres.jsonResponse;
        let Response = sendWMSResult.Response.return;
        if (Response.returnCode != "0000") {
          throw new Error("YS采购退货调用WMS【出库单改单接口】异常：" + JSON.stringify(Response.returnDesc));
        } else if (Response.returnFlag != "1") {
          throw new Error("YS采购退货调用WMS【出库单改单接口】成功：returnFlag为" + JSON.stringify(Response.returnFlag) + ",此数据不可修改!");
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });