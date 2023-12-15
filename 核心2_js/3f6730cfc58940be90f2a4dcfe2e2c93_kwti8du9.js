let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = JSON.parse(param.requestData);
    let func1 = extrequire("GT101792AT1.common.sendRgGd");
    //获取销售退货详情
    let func = extrequire("SCMSA.xs001.getXsThDetail");
    let thdata = func.execute(null, data.id).data;
    let arrivalOrder = thdata.saleReturnDetails[0];
    let method = "CANCEL_ASN";
    //正式环境需要切换
    //普通销售退货、大贸订单退货、活动样品退货、客情订单退货
    if (
      arrivalOrder.stockOrgId == "2390178757465088" ||
      (arrivalOrder.stockOrgId == "2369205391741184" && (arrivalOrder.stockId == "2522045846426624" || arrivalOrder.stockId == "2522052830026496" || arrivalOrder.stockId == "1533684855346298884")) ||
      arrivalOrder.stockOrgId == "2522102344422656"
    ) {
      if (
        data.transactionTypeId == "2665174840054016" ||
        data.transactionTypeId == "1501331493769707530" ||
        data.transactionTypeId == "1501331656978464771" ||
        data.transactionTypeId == "1501331820191940614"
      ) {
        let Body = {};
        if (arrivalOrder.stockOrgId == "2522102344422656") {
          //依安工厂
          Body.warehouseId = "yourIdHere";
          Body.customerId = "yourIdHere";
        } else if (arrivalOrder.stockOrgId == "2390178757465088") {
          //克东
          Body.warehouseId = "yourIdHere";
          Body.customerId = "yourIdHere";
        } else if (arrivalOrder.stockOrgId == "2369205391741184") {
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
        if (data.transactionTypeId == "2665174840054016") {
          Body.asnType = "TH01";
        }
        if (data.transactionTypeId == "1501331493769707530") {
          Body.asnType = "TH02";
        }
        if (data.transactionTypeId == "1501331656978464771") {
          Body.asnType = "TH03";
        }
        if (data.transactionTypeId == "1501331820191940614") {
          Body.asnType = "TH04";
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
          throw new Error("YS销售退货调用WMS【入库单改单接口】异常：" + JSON.stringify(Response.returnDesc));
        } else if (Response.returnFlag != "1") {
          throw new Error("YS销售退货调用WMS【入库单改单接口】成功：returnFlag为" + JSON.stringify(Response.returnFlag) + ",此数据不可修改!");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });