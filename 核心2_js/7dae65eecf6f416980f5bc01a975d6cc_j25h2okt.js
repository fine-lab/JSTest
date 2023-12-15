let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let arrivalOrders = param.saleReturnDetails;
    let order = param;
    let details = new Array();
    let func1 = extrequire("GT101792AT1.common.getDateTime");
    let resDate = func1.execute(null, null);
    if (arrivalOrders.length > 0) {
      a: for (var i = 0; i < arrivalOrders.length; i++) {
        let arrivalOrder = arrivalOrders[i];
        let productDateValue = arrivalOrder.productDate == null ? "" : substring(arrivalOrder.productDate, 0, 10);
        let invalidDateValue = arrivalOrder.invalidDate == null ? "" : substring(arrivalOrder.invalidDate, 0, 10);
        let detail = {
          referenceNo: order.code,
          lineNo: i + 1,
          sku: arrivalOrder.skuCode,
          expectedQty: arrivalOrder.qty,
          totalPrice: "",
          lotAtt01: productDateValue,
          lotAtt02: invalidDateValue,
          lotAtt03: arrivalOrder.define2,
          lotAtt04: arrivalOrder.define6,
          lotAtt05: arrivalOrder.batchNo,
          lotAtt06: "",
          lotAtt07: "",
          lotAtt08: "02",
          lotAtt09: "",
          lotAtt10: "",
          lotAtt11: "",
          lotAtt12: "",
          lotAtt13: "",
          lotAtt14: "",
          lotAtt15: "",
          lotAtt16: "",
          lotAtt17: "",
          lotAtt18: "",
          lotAtt19: "",
          lotAtt20: "",
          lotAtt21: "",
          lotAtt22: "",
          lotAtt23: "",
          lotAtt24: "",
          dedi04: "",
          dedi05: order.id, //上游单据主表id
          dedi06: arrivalOrder.id, //上游单据子表id
          dedi07: "",
          dedi08: "",
          dedi09: arrivalOrder.oriTaxUnitPrice, //单价
          dedi10: "",
          dedi11: "",
          dedi12: "",
          dedi13: "",
          dedi14: "",
          dedi15: "",
          dedi16: "",
          userDefine1: "",
          userDefine2: "",
          userDefine3: "",
          userDefine4: "",
          userDefine5: "",
          userDefine6: "",
          notes: ""
        };
        details.push(detail);
      }
    } else {
      throw new Error("表体行无数据");
    }
    let warehouseId = "";
    let customerId = "";
    if (order.settlementOrgId == "1473045320098643975") {
      //依安工厂
      warehouseId = "yourIdHere";
      customerId = "yourIdHere";
    } else if (order.settlementOrgId == "1473041368737644546") {
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
            asnType: order.transactionTypeId_code,
            docNo: order.code,
            createSource: "YS",
            asnReferenceA: "",
            asnReferenceB: "",
            asnReferenceC: "",
            asnReferenceD: "",
            asnCreationTime: "",
            expectedArriveTime1: resDate.dateStr,
            expectedArriveTime2: "",
            supplierId: "",
            supplierName: "",
            supplierAddress1: "",
            supplierAddress2: "",
            supplierAddress3: "",
            supplierAddress4: "",
            supplierCountry: "",
            supplierProvince: "",
            supplierCity: "",
            supplierDistrict: "",
            supplierStreet: "",
            supplierContact: "",
            supplierFax: "",
            supplierMail: "",
            supplierTel1: "",
            supplierTel2: "",
            supplierZip: "",
            carrierId: "",
            carrierName: "",
            countryOfDestination: "",
            countryOfOrigin: "",
            followUp: "",
            hedi01: arrivalOrders[0].stockCode, //入库编码
            hedi02: "", //出库编码
            hedi03: "",
            hedi04: "",
            hedi05: "",
            hedi06: "",
            hedi07: "",
            hedi08: "",
            hedi09: "",
            hedi10: "",
            placeOfDischarge: "",
            placeOfLoading: "",
            placeOfDelivery: "",
            priority: "",
            userDefine1: "",
            userDefine2: "",
            userDefine3: "",
            userDefine4: "",
            userDefine5: "",
            userDefine6: "",
            userDefine7: "",
            userDefine8: "",
            userDefine9: "",
            userDefine10: "",
            notes: "",
            crossdockFlag: "",
            details: details
          }
        ]
      }
    };
    return { body };
  }
}
exports({ entryPoint: MyTrigger });