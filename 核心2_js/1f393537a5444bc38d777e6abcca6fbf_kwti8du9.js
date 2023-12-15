let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let wgbgfunc = extrequire("PO.backDesignerFunction.getWGBG");
    let wgbgBody = wgbgfunc.execute(null, param.id);
    param = wgbgBody.body;
    let arrivalOrders = param.finishedReportDetail;
    let order = param;
    let details = new Array();
    let func1 = extrequire("GT101792AT1.common.getDateTime");
    //获取仓库
    let func3 = extrequire("GZTBDM.backDesignerFunction.getWarehouse");
    //获取物料
    let func4 = extrequire("GZTBDM.backDesignerFunction.getMaterial");
    let func5 = extrequire("GZTBDM.backDesignerFunction.getSKU");
    //获取生产订单
    let func6 = extrequire("PO.backOpenApiFunction.getScddDetail");
    let scddData = new Object();
    let resDate = func1.execute(null, null);
    let dhWarehouse = undefined;
    let gyspc = "";
    if (arrivalOrders.length > 0) {
      a: for (var i = 0; i < arrivalOrders.length; i++) {
        let arrivalOrder = arrivalOrders[i];
        let batchNo = arrivalOrder.isBatchManage == false ? "" : arrivalOrder.batchNo; // 批次号
        let productDateValue = arrivalOrder.produceDate == null ? "" : substring(arrivalOrder.produceDate, 0, 10); // 生产日期
        let expirationDate = arrivalOrder.expirationDate == null ? "" : substring(arrivalOrder.expirationDate, 0, 10); // 失效日期
        let lotAtt03 = substring(resDate.dateStr, 0, 10);
        let strarrivalOrder = JSON.stringify(arrivalOrder);
        let strstrarrivalOrder = replace(strarrivalOrder, "finishedReportDetailUserdefItem!", "finishedReportDetailUserdefItem");
        arrivalOrder = JSON.parse(strstrarrivalOrder);
        if (i == 0) {
          if (arrivalOrder.warehouseId) {
            let dhWarehouseList = func3.execute(null, arrivalOrder.warehouseId).res;
            if (dhWarehouseList.length > 0) {
              dhWarehouse = dhWarehouseList[0].code;
            } else {
              throw new Error("完工报告未维护仓库");
            }
          } else {
            throw new Error("完工报告未维护仓库");
          }
          scddData = func6.execute(null, arrivalOrder.sourceid).body;
          let strParam = JSON.stringify(scddData);
          let strReplace = replace(strParam, "orderAttrextItem!", "orderAttrextItem");
          scddData = JSON.parse(strReplace);
          let scddarrivalOrder = scddData.orderProduct[0];
          scddarrivalOrder = JSON.stringify(scddarrivalOrder);
          scddarrivalOrder = replace(scddarrivalOrder, "orderProductUserdefItem!", "orderProductUserdefItem");
          scddarrivalOrder = JSON.parse(scddarrivalOrder);
          gyspc = scddarrivalOrder.orderProductUserdefItemdefine4;
        }
        let materialList = func5.execute(null, arrivalOrder.skuId).res;
        let detail = {
          referenceNo: order.code,
          lineNo: i + 1,
          sku: arrivalOrder.skuCode,
          expectedQty: arrivalOrder.quantity,
          lotAtt01: productDateValue,
          lotAtt02: expirationDate,
          lotAtt03: lotAtt03,
          lotAtt04: gyspc,
          lotAtt08: "02",
          dedi05: order.id, //上游单据主表id
          dedi06: arrivalOrder.id //上游单据子表id
        };
        details.push(detail);
      }
    } else {
      throw new Error("表体行无数据");
    }
    let warehouseId = "";
    let customerId = "";
    if (order.orgId == "2522102344422656") {
      //依安工厂
      warehouseId = "yourIdHere";
      customerId = "yourIdHere";
    } else if (order.orgId == "2390178757465088") {
      //克东
      warehouseId = "yourIdHere";
      customerId = "yourIdHere";
    }
    let body = {
      data: {
        header: [
          {
            warehouseId: warehouseId,
            customerId: customerId,
            asnType: scddData.transTypeCode,
            docNo: order.code,
            createSource: "YS",
            expectedArriveTime1: resDate.dateStr,
            supplierId: scddData.orderAttrextItemdefine3,
            supplierName: scddData.orderAttrextItemdefine2,
            hedi01: dhWarehouse, //入库编码
            details: details
          }
        ]
      }
    };
    return { body };
  }
}
exports({ entryPoint: MyTrigger });