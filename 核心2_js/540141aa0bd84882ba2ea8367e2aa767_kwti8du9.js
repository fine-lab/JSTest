let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.realModelData[0];
    let func1 = extrequire("GT101792AT1.common.sendCkGd");
    let method = "CANCEL_SO";
    let deliveryDetails = data.deliveryDetails;
    let arrivalOrder = deliveryDetails[0];
    console.log(JSON.stringify(data));
    //正式环境需要切换
    //普通销售发货、大贸订单发货、活动样品发货、客情订单发货
    if (data.stockOrgId == "2390178757465088" || data.stockOrgId == "2369205391741184" || data.stockOrgId == "2522102344422656" || data.stockOrgId == "2522015793665536") {
      if (
        data.transactionTypeId == "2369198632079875" ||
        data.transactionTypeId == "1520983941275189257" ||
        data.transactionTypeId == "2658145815138560" ||
        data.transactionTypeId == "2658145605177600" ||
        data.transactionTypeId == "2658146061472000" ||
        data.transactionTypeId == "2658146233372928" ||
        data.transactionTypeId == "2682033932931328" ||
        data.transactionTypeId == "1484956613142380548" ||
        data.transactionTypeId == "1490763915744247812" ||
        data.transactionTypeId == "1490774318155038730" ||
        data.transactionTypeId == "1606525430515367942" ||
        data.transactionTypeId == "1613253264865230858" ||
        data.transactionTypeId == "1613268005196660743" ||
        data.transactionTypeId == "1765417410629206019" ||
        data.transactionTypeId == "1765426653396729858" ||
        data.transactionTypeId == "1765427100071231496" ||
        data.transactionTypeId == "1765427469449429002" ||
        data.transactionTypeId == "1770407630065893383" ||
        data.transactionTypeId == "1770407913519054856" ||
        data.transactionTypeId == "1770408128276856838" ||
        data.transactionTypeId == "1770410292942471171" ||
        data.transactionTypeId == "1770411564239159297" ||
        data.transactionTypeId == "1770411916427526145" ||
        data.transactionTypeId == "1770412251450703878" ||
        data.transactionTypeId == "1770412466195922947"
      ) {
        let Body = {};
        if (data.stockOrgId == "2522102344422656") {
          //依安工厂
          Body.warehouseId = "yourIdHere";
          Body.customerId = "yourIdHere";
        } else if (data.stockOrgId == "2390178757465088") {
          //克东
          Body.warehouseId = "yourIdHere";
          Body.customerId = "yourIdHere";
        } else if (data.stockOrgId == "2369205391741184" || data.stockOrgId == "2522015793665536") {
          //北纬47西安与克东
          Body.customerId = "001";
          //西安仓、西安管控仓
          if (arrivalOrder.stockId == "2522045846426624" || arrivalOrder.stockId == "2522052830026496") {
            Body.warehouseId = "XADS";
            //苏州仓
          } else if (arrivalOrder.stockId == "1533684855346298884") {
            Body.warehouseId = "KSDS";
          }
        }
        Body.docNo = data.code;
        if (data.transactionTypeId == "2369198632079875") {
          Body.orderType = "XC01";
        }
        if (data.transactionTypeId == "1520983941275189257") {
          Body.orderType = "XC02";
        }
        if (data.transactionTypeId == "2658145815138560") {
          Body.orderType = "XC03";
        }
        if (data.transactionTypeId == "2658145605177600") {
          Body.orderType = "XC04";
        }
        if (data.transactionTypeId == "2658146061472000") {
          Body.orderType = "XC05";
        }
        if (data.transactionTypeId == "2658146233372928") {
          Body.orderType = "XC06";
        }
        if (data.transactionTypeId == "2682033932931328") {
          Body.orderType = "XC07";
        }
        if (data.transactionTypeId == "1484956613142380548") {
          Body.orderType = "XC05";
        }
        if (data.transactionTypeId == "1490763915744247812") {
          Body.orderType = "XC06";
        }
        if (data.transactionTypeId == "1490774318155038730") {
          Body.orderType = "XC07";
        }
        if (data.transactionTypeId == "1606525430515367942") {
          Body.orderType = "XC100";
        }
        if (data.transactionTypeId == "1613253264865230858") {
          Body.orderType = "XC101";
        }
        if (data.transactionTypeId == "1613268005196660743") {
          Body.orderType = "XC102";
        }
        if (data.transactionTypeId == "1765417410629206019") {
          Body.orderType = "XSCKBCP";
        }
        if (data.transactionTypeId == "1765426653396729858") {
          Body.orderType = "KQDDCKBCP";
        }
        if (data.transactionTypeId == "1765427100071231496") {
          Body.orderType = "HDYPCKBCP";
        }
        if (data.transactionTypeId == "1765427469449429002") {
          Body.orderType = "DMDDCKBCP";
        }
        if (data.transactionTypeId == "1770407630065893383") {
          Body.orderType = "GSFLCKBCP";
        }
        if (data.transactionTypeId == "1770407913519054856") {
          Body.orderType = "CZKXSCKBCP";
        }
        if (data.transactionTypeId == "1770408128276856838") {
          Body.orderType = "KSLPCKBCP";
        }
        if (data.transactionTypeId == "1770410292942471171") {
          Body.orderType = "DMDDCKWCCPBCP";
        }
        if (data.transactionTypeId == "1770411564239159297") {
          Body.orderType = "PTXSCKWCCPBCP";
        }
        if (data.transactionTypeId == "1770411916427526145") {
          Body.orderType = "CKDDWCCPBCP";
        }
        if (data.transactionTypeId == "1770412251450703878") {
          Body.orderType = "ZNBMKQCKBCP";
        }
        if (data.transactionTypeId == "1770412466195922947") {
          Body.orderType = "BFDDCKBCP";
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
        console.log(JSON.stringify(res));
        let sendWMSResult = res.jsonResponse;
        let Response = sendWMSResult.Response.return;
        if (Response.returnCode != "0000") {
          throw new Error("YS销售发货调用WMS【出库单改单接口】异常：" + JSON.stringify(Response.returnDesc));
        } else if (Response.returnFlag != "1") {
          throw new Error("YS销售发货调用WMS【出库单改单接口】成功：returnFlag为" + JSON.stringify(Response.returnFlag) + ",此数据不可修改!");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });