let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.convBills[0];
    let func1 = extrequire("GT101792AT1.common.sendCkGd");
    let method = "CANCEL_SO";
    let deliveryDetails = data.transferApplys;
    let arrivalOrder = deliveryDetails[0];
    //正式环境需要切换
    //普通销售发货、大贸订单发货、活动样品发货、客情订单发货
    let kdOrg = "2390178757465088";
    let bw47Org = "2369205391741184";
    let yaOrg = "2522102344422656";
    if (data.outorg == kdOrg || data.outorg == bw47Org || data.outorg == yaOrg) {
      if (data.bustype == "1501322817959362570" || data.bustype == "1536629235828391938" || data.bustype == "1501323118598684682" || data.bustype == "1536628694667231233") {
        let Body = {};
        if (data.outorg == yaOrg) {
          //依安工厂
          Body.warehouseId = "yourIdHere";
          Body.customerId = "yourIdHere";
        } else if (data.outorg == kdOrg) {
          //克东
          Body.warehouseId = "yourIdHere";
          Body.customerId = "yourIdHere";
        } else if (data.outorg == bw47Org) {
          //北纬47西安与克东
          Body.customerId = "001";
          //西安仓、西安管控仓
          if (data.outwarehouse == "2522045846426624" || data.outwarehouse == "2522052830026496") {
            Body.warehouseId = "XADS";
            //苏州仓
          } else if (data.outwarehouse == "1533684855346298884") {
            Body.warehouseId = "KSDS";
          }
        }
        Body.docNo = data.code;
        let type = "";
        if (data.bustype == "1501322817959362570") {
          //生产领用调拨
          type = "DC01";
        }
        if (data.bustype == "1536629235828391938") {
          //工厂间调拨
          type = "DC02";
        }
        if (data.bustype == "1501323118598684682") {
          //工厂与物流仓间调拨
          type = "DC03";
        }
        if (data.bustype == "1536628694667231233") {
          //工厂与物流仓间调拨
          type = "DC05";
        }
        if (data.bustype == "1602084606140481537") {
          //工厂与物流仓间调拨
          type = "DC07";
        }
        Body.orderType = type;
        let wmsBody = {
          data: {
            ordernos: Body
          }
        };
        if (Body.warehouseId) {
          let param = {
            data: wmsBody,
            method: method
          };
          console.log(JSON.stringify(param));
          let res = func1.execute(null, param);
          let sendWMSResult = res.jsonResponse;
          let Response = sendWMSResult.Response.return;
          console.log(Response);
          if (Response.returnCode != "0000") {
            let uspaceReceiver = ["6177310f-2b4f-46a4-8f7c-ce82202859ff"];
            let channelses = ["uspace"];
            let title = "调拨订单审核推送WMS系统错误预警！";
            let content = "单据编号为：" + data.code + "，报错节点：审核，报错信息：YS调拨订单弃审调用WMS【出库单改单接口】异常：" + JSON.stringify(Response.returnDesc);
            let messageInfos = {
              sysId: "yourIdHere",
              tenantId: "yourIdHere",
              uspaceReceiver: uspaceReceiver,
              channels: channelses,
              subject: title,
              content: content,
              groupCode: "prewarning"
            };
            let resulte = sendMessage(messageInfos);
            throw new Error("YS调拨订单弃审调用WMS【出库单改单接口】异常：" + JSON.stringify(Response.returnDesc));
          } else if (Response.returnFlag != "1") {
            let uspaceReceiver = ["6177310f-2b4f-46a4-8f7c-ce82202859ff"];
            let channelses = ["uspace"];
            let title = "调拨订单审核推送WMS系统错误预警！";
            let content =
              "单据编号为：" + data.code + "，报错节点：审核，报错信息：YS调拨订单弃审调用WMS【出库单改单接口】成功：returnFlag为：" + JSON.stringify(Response.returnFlag) + ",此数据不可修改!";
            let messageInfos = {
              sysId: "yourIdHere",
              tenantId: "yourIdHere",
              uspaceReceiver: uspaceReceiver,
              channels: channelses,
              subject: title,
              content: content,
              groupCode: "prewarning"
            };
            let resulte = sendMessage(messageInfos);
            throw new Error("YS调拨订单弃审调用WMS【出库单改单接口】成功：returnFlag为" + JSON.stringify(Response.returnFlag) + ",此数据不可修改!");
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });