let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let Data = JSON.parse(request.data);
    throw new Error(Data);
    var headers = { "Content-Type": "application/json;charset=UTF-8" };
    // 采购入库表体
    let param2 = { data: Data };
    let func = extrequire("ST.unit.publicInOrder");
    let orderData = func.execute(null, param2);
    console.log(JSON.stringify(orderData));
    // 页面状态
    let state = Data.hasOwnProperty("srcBillNO");
    if (state == true) {
      if (orderData.bustypeCode == "RK01") {
        let jsonBody = {
          outBizOrderCode: orderData.code,
          bizOrderType: "INBOUND",
          subBizOrderType: "CGRK",
          ownerCode: orderData.OrgCode,
          warehouseCode: orderData.warehouse_code,
          supplierCode: orderData.vendor_Code,
          supplierName: orderData.vendor_Name,
          channelCode: "DEFAULT",
          orderLines: orderData.SunList,
          orderSource: "PLATFORM_SYNC"
        };
        let body = {
          appCode: "beiwei-oms",
          appApiCode: "cgrk.di.bang.interface",
          schemeCode: "bw47",
          jsonBody: jsonBody
        };
        console.log(JSON.stringify(body));
        let header = { "Content-Type": "application/json;charset=UTF-8" };
        let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(body));
        let str = JSON.parse(strResponse);
        if (str.success != true) {
          throw new Error("调用OMS采购入库创建API失败：" + str.errorMessage);
        }
      } else {
        let fulfilOperations = new Array();
        let fulfilOperation = {};
        if (orderData.bWMS == false) {
          if (orderData.bustype_code == "A20001" || orderData.bustype_code == "CG02") {
            //正常采购
            fulfilOperation = {
              entryOrderCode: orderData.code,
              outBizOrderCode: orderData.code,
              omsOrderCode: orderData.srcBillNO,
              ownerCode: orderData.OrgCode,
              bizOrderType: "INBOUND",
              subBizOrderType: "CGRK",
              status: "INBOUND",
              warehouseCode: orderData.warehouse_code,
              finishTime: orderData.finishTime,
              operationOrderLines: orderData.SunList,
              confirmType: 0,
              systemType: "YS"
            };
            fulfilOperations.push(fulfilOperation);
            let body = {
              appCode: "beiwei-ys",
              schemeCode: "ys",
              appApiCode: "ys.cgrk.to.oms.confirm",
              jsonBody: { fulfilOperations }
            };
            console.log(JSON.stringify(body));
            let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(headers), JSON.stringify(body));
            let str = JSON.parse(strResponse);
            if (str.success != true) {
              throw new Error("调用OMS采购入库确认创建API失败，失败原因：" + str.errorMessage);
            }
          } else if (orderData.bustype_code == "A20003" || orderData.bustype_code == "CG03") {
            //退供
            fulfilOperation = {
              entryOrderCode: orderData.code,
              outBizOrderCode: orderData.code,
              omsOrderCode: orderData.srcBillNO,
              ownerCode: orderData.OrgCode,
              bizOrderType: "OUTBOUND",
              subBizOrderType: "CGRK",
              status: "OUTBOUND",
              warehouseCode: orderData.warehouse_code,
              finishTime: orderData.finishTime,
              operationOrderLines: SunList,
              confirmType: 0,
              systemType: "YS"
            };
            fulfilOperations.push(fulfilOperation);
            let body = {
              appCode: "beiwei-ys",
              schemeCode: "ys",
              appApiCode: "ys.tgck.to.oms.confirm",
              jsonBody: { fulfilOperations }
            };
            console.log(JSON.stringify(body));
            let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(headers), JSON.stringify(body));
            let str = JSON.parse(strResponse);
            if (str.success != true) {
              throw new Error("调用OMS采购入库确认创建API失败，失败原因：" + str.errorMessage);
            }
          }
        }
      }
    }
    function getOtherOutRecoeds(ids) {
      var object = {
        ids: ids,
        compositions: [
          {
            name: "purInRecords"
          }
        ]
      };
      return ObjectStore.selectBatchIds("st.purinrecord.PurInRecord", object);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });