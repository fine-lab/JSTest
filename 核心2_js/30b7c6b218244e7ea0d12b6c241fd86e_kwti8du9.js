let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = JSON.parse(param.requestData);
    let funcRk = extrequire("GT101792AT1.common.sendRgGd");
    let funcCk = extrequire("GT101792AT1.common.sendCkGd");
    let func3 = extrequire("GZTBDM.backDesignerFunction.getWarehouse");
    let func4 = extrequire("PU.cg001.getPurchase");
    let method = "";
    //正式环境需要切换
    if (data.org == "2390178757465088" || data.org == "2369205391741184" || data.org == "2522102344422656") {
      if (data.busType == "1501321452140888070" || data.busType == "1501340049359765512" || data.busType == "1511376485992628230" || data.busType == "1514360680802156551") {
        //包材采购到货、包材采购退货
        let Body = {};
        let arrivalOrders = func4.execute(null, data.id).body.arrivalOrders;
        let dhWarehouse = undefined;
        if (arrivalOrders.length > 0) {
          a: for (var i = 0; i < arrivalOrders.length; i++) {
            let arrivalOrder = arrivalOrders[i];
            if (i == 0) {
              let dhWarehouseList = func3.execute(null, arrivalOrder.warehouse).res;
              if (dhWarehouseList.length > 0) {
                dhWarehouse = dhWarehouseList[0].code;
              } else {
                throw new Error("到货单表体未维护仓库");
              }
            }
          }
        }
        if (data.org == "2522102344422656") {
          //依安工厂
          Body.warehouseId = "yourIdHere";
          Body.customerId = "yourIdHere";
        } else if (data.org == "2390178757465088") {
          //克东
          Body.warehouseId = "yourIdHere";
          Body.customerId = "yourIdHere";
        } else if (data.org == "2369205391741184") {
          //电商仓
          Body.customerId = "001";
          if (includes(dhWarehouse, "KSDS")) {
            Body.warehouseId = "KSDS";
          } else if (includes(dhWarehouse, "XADS") || includes(dhWarehouse, "XAGK")) {
            Body.warehouseId = "XADS";
          } else if (includes(dhWarehouse, "SZC")) {
            Body.warehouseId = "KSDS";
          }
        }
        if (Body.warehouseId != undefined) {
          Body.docNo = data.code;
          let wmsBody = {
            data: {
              ordernos: Body
            }
          };
          if (data.busType == "1501321452140888070") {
            method = "CANCEL_ASN";
            Body.asnType = "RK02"; //采购入库
          } else if (data.busType == "1501340049359765512") {
            method = "CANCEL_SO";
            Body.orderType = "RK02"; //采购退货
          } else if (data.busType == "1511376485992628230") {
            method = "CANCEL_ASN";
            Body.asnType = "RK03"; //外采成品、半成品
          } else if (data.busType == "1514360680802156551") {
            method = "CANCEL_SO";
            Body.asnType = "RK03"; //外采成品、半成品
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
  }
}
exports({ entryPoint: MyTrigger });