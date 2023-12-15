let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.convBills[0];
    console.log(JSON.stringify(data));
    let func1 = extrequire("GT101792AT1.common.sendRgGd");
    let method = "CANCEL_ASN";
    let deliveryDetails = data.details;
    let arrivalOrder = deliveryDetails[0];
    //正式环境需要切换
    //普通销售发货、大贸订单发货、活动样品发货、客情订单发货
    let kdOrg = "2390178757465088";
    let bw47Org = "2369205391741184";
    let yaOrg = "2522102344422656";
    console.log("调入组织：" + data.inorg + "交易类型：" + data.bustype + "调入仓库：" + data.inwarehouse);
    if (data.inorg == kdOrg || data.inorg == bw47Org || data.inorg == yaOrg) {
      if (
        data.bustype == "1501323891684409354" ||
        data.bustype == "1536641768536145926" ||
        data.bustype == "1536641510849642501" ||
        data.bustype == "1536641510849642501" ||
        data.bustype == "1602085198849114120"
      ) {
        let Body = {};
        if (data.inorg == yaOrg) {
          //依安工厂
          Body.warehouseId = "yourIdHere";
          Body.customerId = "yourIdHere";
        } else if (data.inorg == kdOrg) {
          //克东
          Body.warehouseId = "yourIdHere";
          Body.customerId = "yourIdHere";
        } else if (data.inorg == bw47Org) {
          //北纬47西安与克东
          Body.customerId = "001";
          //西安仓、西安管控仓
          if (data.inwarehouse == "2522045846426624" || data.inwarehouse == "2522052830026496") {
            Body.warehouseId = "XADS";
            //苏州仓
          } else if (data.inwarehouse == "1533684855346298884") {
            Body.warehouseId = "KSDS";
          }
        }
        Body.docNo = data.code;
        let type = "";
        if (data.bustype == "1501343219054018566") {
          //生产退料
          type = "DR04";
        }
        if (data.bustype == "1536641768536145926") {
          //工厂间调拨
          type = "DR02";
        }
        if (data.bustype == "1501323891684409354") {
          //工厂与物流仓间调拨
          type = "DR03";
        }
        if (data.bustype == "1536641510849642501") {
          //物流仓间调拨
          type = "DR05";
        }
        if (data.bustype == "1602085198849114120") {
          //物流仓间调拨
          type = "DR07";
        }
        Body.asnType = type;
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
          let res = func1.execute(null, param);
          console.log(JSON.stringify(res));
          let sendWMSResult = res.jsonResponse;
          let Response = sendWMSResult.Response.return;
          if (Response.returnCode != "0000") {
            throw new Error("YS删除调出单调用WMS【入库单改单接口】异常：" + JSON.stringify(Response.returnDesc));
          } else if (Response.returnFlag != "1") {
            throw new Error("YS删除调出单调用WMS【入库单改单接口】成功：returnFlag为" + JSON.stringify(Response.returnFlag) + ",此数据不可修改!");
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });