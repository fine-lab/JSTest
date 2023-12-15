let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("GT101792AT1.common.getApiToken");
    let res = func1.execute(null);
    var token = res.access_token;
    let func2 = extrequire("GT101792AT1.common.getGatewayUrl");
    let res2 = func2.execute(null);
    var gatewayUrl = res2.gatewayUrl;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let body = {};
    //调用YS现存量接口获取数据
    let getsdUrl = gatewayUrl + "/yonbip/scm/stock/QueryCurrentStocksByCondition?access_token=" + token;
    var apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(body));
    let result = JSON.parse(apiResponse);
    if (result.code == 200) {
      let stockDatas = result.data;
      let returnStock = new Map();
      let currentqty = 0;
      let orgList = new Array();
      //按照SKU编码+批次号进行分组计算数量
      for (var i = 0; i < stockDatas.length; i++) {
        let stockData = stockDatas[i];
        if ((stockData.org == "1473045320098643975" || stockData.org == "1473041368737644546") && stockData.batchno != null) {
          let batchno = stockData.batchno == undefined ? "" : stockData.batchno;
          let key = stockData.productsku_code + "|" + batchno;
          if (returnStock[key] != undefined) {
            currentqty = stockData.currentqty + returnStock[key];
            returnStock[key] = currentqty;
          } else {
            currentqty = stockData.currentqty;
            returnStock[key] = currentqty;
          }
          orgList.push(stockData.org);
        }
      }
      // 标记
      let number = 0;
      let wmsDatas = new Array();
      //获取对照日期
      let datefunc = extrequire("GT101792AT1.common.getDate");
      let dateRes = datefunc.execute(null);
      //组装WMS接口参数
      for (let stockkey in returnStock) {
        let keyRes = stockkey.split("|");
        var customerId = "";
        if (orgList[number] == "1473045320098643975") {
          //依安工厂
          customerId = "yourIdHere";
        } else if (orgList[number] == "1473041368737644546") {
          //克东
          customerId = "yourIdHere";
        }
        let wmsData = {
          customerId: customerId, //"YA001",//货主ID
          sku: keyRes[0], //sku编码
          lotAtt04: keyRes[1], //批次
          qty: returnStock[stockkey] + "", //数量
          invDate: dateRes.dateStr //对账日期
        };
        wmsDatas.push(wmsData);
        // 初始化参数
        number++;
      }
      let header = {
        header: wmsDatas
      };
      let body = {
        data: header
      };
      let method = "putSKInventory";
      let param = {
        data: body,
        method: method
      };
      let func3 = extrequire("GT101792AT1.common.sendWMSInventory");
      let sendWMSResult = func3.execute(null, param);
      let response = sendWMSResult.jsonResponse.Response.return;
      if (response.returnCode != "0000") {
        throw new Error("Ys库存对账下传Wms失败：" + JSON.stringify(response.returnDesc));
      }
    }
  }
}
exports({ entryPoint: MyTrigger });