let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let dataOut = {};
    if (param != null && param != undefined) {
      dataOut = param.data[0].id;
      let salesOutRequestUrl = "https://www.example.com/";
      salesOutRequestUrl += `?id=${dataOut}`;
      var strResponseSalesOut = openLinker("GET", salesOutRequestUrl, "ST", null);
      let salesOutDetail = JSON.parse(strResponseSalesOut);
      //动态获取code
      var serviceCode = salesOutDetail.data["defines!define9"];
      //测试code
      if (salesOutDetail.data.othOutRecords != null && salesOutDetail.data.othOutRecords != undefined) {
        if (salesOutDetail.data.bustype_name == "质保内配件更换") {
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
            var y = new Array();
            var productNum;
            for (var i = 0; i < salesOutDetail.data.othOutRecords.length; i++) {
              var x = {};
              x.itemCode = salesOutDetail.data.othOutRecords[i].product_cCode;
              productNum = salesOutDetail.data.othOutRecords[i].qty;
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
            if (responseObjPes.data.status == "received") {
              var strResponseSos = openLinker("POST", "https://www.example.com/", "ST", JSON.stringify(body));
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