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
    let totarray = new Array();
    let orgList = ["2390178757465088"];
    let warehouseList = ["2433026575818240", "2433026117410048", "2433025316279552"];
    for (var a = 0; a < orgList.length; a++) {
      for (var b = 0; b < warehouseList.length; b++) {
        let org = orgList[a];
        let warehouse = warehouseList[b];
        let body = { org: org, warehouse: warehouse, bStockStatusDocNotNull: true };
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
            if ((stockData.org == "2390178757465088" || stockData.org == "2522102344422656") && stockData.batchno != null) {
              let batchno = stockData.batchno == undefined ? "" : stockData.batchno;
              let producedate = stockData.producedate == undefined ? "" : substring(stockData.producedate, 0, 10);
              let invaliddate = stockData.invaliddate == undefined ? "" : substring(stockData.invaliddate, 0, 10);
              let LOTATT08 = stockData.stockStatusDoc == undefined ? "" : stockData.stockStatusDoc == "2367300957197839" ? "01" : stockData.stockStatusDoc == "2367300957197840" ? "02" : "03";
              let key = stockData.productsku_code + "|" + batchno + "|" + producedate + "|" + invaliddate + "|" + LOTATT08;
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
            if (orgList[number] == "2522102344422656") {
              //依安工厂
              customerId = "yourIdHere";
            } else if (orgList[number] == "2390178757465088") {
              //克东
              customerId = "yourIdHere";
            }
            let wmsData = {
              customerId: customerId, //"YA001",//货主ID
              sku: keyRes[0], //sku编码
              lotAtt04: keyRes[1], //批次
              qty: returnStock[stockkey] + "", //数量
              invDate: dateRes.dateStr, //对账日期
              LOTATT01: keyRes[2], //生产日期：
              LOTATT02: keyRes[3], //失效日期:
              LOTATT08: keyRes[4] //库存状态
            };
            wmsDatas.push(wmsData);
            totarray.push(wmsData);
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
  }
}
exports({ entryPoint: MyTrigger });