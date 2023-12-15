let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let dataOut = {};
    if (param != null && param != undefined) {
      dataOut = param.data[0];
      //动态获取code
      var serviceCode = dataOut["headDefine!define13"];
      //测试code
      let salesOutRequestUrl = "https://www.example.com/";
      salesOutRequestUrl += `?id=${dataOut.id}`;
      var strResponseSalesOut = openLinker("GET", salesOutRequestUrl, "ST", null);
      var salesOutDetail = JSON.parse(strResponseSalesOut);
      if (salesOutDetail.data.details != null && salesOutDetail.data.details != undefined) {
        if (salesOutDetail.data.bustype_name == "配件销售出库") {
          if (serviceCode == null || serviceCode == undefined) {
            return;
          } else {
            var sqlExec = `select id from pes.sos.SmsSos where code = '${serviceCode}'`;
            var serviceId = ObjectStore.queryByYonQL(sqlExec, "imppes");
            //调用开放接口获取soEquipmentId
            let serviceRequestUrl = "https://www.example.com/";
            serviceRequestUrl += `?id=${serviceId[0].id}`;
            var strResponsePes = openLinker("GET", serviceRequestUrl, "ST", null);
            let responseObjPes = JSON.parse(strResponsePes);
            let soEquipment_Id = responseObjPes.data.smsSosEquipmentList[0].id;
            let soEquipment_IdStr = soEquipment_Id.toString();
            //获取配件code
            let productCode = salesOutDetail.data.details[0].product_cCode;
            //获取费用信息
            var oriPrice = 0;
            for (var i = 0; i < salesOutDetail.data.details.length; i++) {
              oriPrice = oriPrice + salesOutDetail.data.details[i].oriSum;
            }
            //获取配件信息
            var y = new Array();
            var productNum;
            for (var i = 0; i < salesOutDetail.data.details.length; i++) {
              var x = {};
              x.itemCode = salesOutDetail.data.details[i].product_cCode;
              productNum = salesOutDetail.data.details[i].qty;
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
              var strResponseSos = openLinker("POST", "https://www.example.com/", "ST", JSON.stringify(body));
              var strResponseUpdatePrice = openLinker("POST", "https://www.example.com/", "ST", JSON.stringify(priceData));
            } else {
              throw new Error("工单不是接收状态");
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });