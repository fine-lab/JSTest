let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let dataOut = {};
    if (param != null && param != undefined) {
      dataOut = param.data[0];
      //动态获取code
      //测试code
      let salesRequestUrl = "https://www.example.com/";
      salesRequestUrl += `?id=${dataOut.id}`;
      var strResponseSales = openLinker("GET", salesRequestUrl, "SCMSA", null);
      var salesDetail = JSON.parse(strResponseSales);
      var serviceCode = salesDetail.data.headFreeItem.define15;
      if (salesDetail.data.orderDetails != null && salesDetail.data.orderDetails != undefined) {
        if (serviceCode == null || serviceCode == undefined) {
          return;
        } else {
          var sqlExec = `select id from pes.sos.SmsSos where code = '${serviceCode}'`;
          var serviceId = ObjectStore.queryByYonQL(sqlExec, "imppes");
          //调用开放接口获取soEquipmentId
          let serviceRequestUrl = "https://www.example.com/";
          serviceRequestUrl += `?id=${serviceId[0].id}`;
          var strResponsePes = openLinker("GET", serviceRequestUrl, "SCMSA", null);
          let responseObjPes = JSON.parse(strResponsePes);
          let soEquipment_Id = responseObjPes.data.smsSosEquipmentList[0].id;
          let soEquipment_IdStr = soEquipment_Id.toString();
          //获取配件code
          let productCode = salesDetail.data.orderDetails[0].productCode;
          //获取费用信息
          var oriPrice = 0;
          for (var i = 0; i < salesDetail.data.orderDetails.length; i++) {
            oriPrice = oriPrice + salesDetail.data.orderDetails[i].oriSum;
          }
          //获取配件信息
          var y = new Array();
          var productNum;
          for (var i = 0; i < salesDetail.data.orderDetails.length; i++) {
            var x = {};
            x.itemCode = salesDetail.data.orderDetails[i].productCode;
            productNum = salesDetail.data.orderDetails[i].priceQty;
            x.qty = productNum.toString();
            y.push(x);
          }
          //写入配件信息给服务工单
          let body = {
            code: serviceCode,
            soEquipmentId: soEquipment_IdStr,
            soItemlines: y
          };
          var service_Id = serviceId[0].id;
          let priceData = {
            soId: service_Id,
            priceOther: oriPrice
          };
          if (responseObjPes.data.status == "received") {
            var strResponseSos = openLinker("POST", "https://www.example.com/", "SCMSA", JSON.stringify(body));
            var strResponseUpdatePrice = openLinker("POST", "https://www.example.com/", "SCMSA", JSON.stringify(priceData));
          } else {
            throw new Error("工单不是接收状态");
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });