let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let deliveryDetails = param.deliveryDetails;
    let order = param;
    let details = new Array();
    let func1 = extrequire("GT101792AT1.common.getDateTime");
    //获取仓库
    let func3 = extrequire("GZTBDM.backDesignerFunction.getWarehouse");
    //获取物料
    let func4 = extrequire("GZTBDM.backDesignerFunction.getMaterial");
    //获取sku物料
    let func5 = extrequire("GZTBDM.backDesignerFunction.getSKU");
    //获取客户编码
    let func6 = extrequire("GZTBDM.backDesignerFunction.getMerchant");
    let merchantCodeList = func6.execute(null, order.invoiceAgentId).res;
    let merchantCode = merchantCodeList[0].code;
    let asnType = "";
    if (order.transactionTypeId == "1471579550858608652") {
      asnType = "XC01";
    }
    if (order.transactionTypeId == "1471579696863379465") {
      asnType = "XC02";
    }
    if (order.transactionTypeId == "1471579808550354954") {
      asnType = "XC03";
    }
    if (order.transactionTypeId == "1471579963167604740") {
      asnType = "XC04";
    }
    let resDate = func1.execute(null, null);
    let dhWarehouse = undefined;
    if (deliveryDetails.length > 0) {
      a: for (var i = 0; i < deliveryDetails.length; i++) {
        let arrivalOrder = deliveryDetails[i];
        if (i == 0) {
          let dhWarehouseList = func3.execute(null, arrivalOrder.stockId).res;
          if (dhWarehouseList.length > 0) {
            dhWarehouse = dhWarehouseList[0].code;
          } else {
            throw new Error("到货单表体未维护仓库");
          }
        }
        let materialList = func5.execute(null, arrivalOrder.skuId).res;
        let producedateValue = arrivalOrder.productDate == undefined ? "" : substring(arrivalOrder.productDate, 0, 10);
        let invaliddateValue = arrivalOrder.invalidDate == undefined ? "" : substring(arrivalOrder.invalidDate, 0, 10);
        let bodyItem = arrivalOrder.bodyItem;
        let detail = {
          referenceNo: order.code,
          lineNo: i + 1,
          sku: materialList[0].code,
          qtyOrdered: arrivalOrder.qty,
          price: "",
          lotAtt01: producedateValue,
          lotAtt02: invaliddateValue,
          lotAtt03: "",
          lotAtt04: "",
          lotAtt05: arrivalOrder.batchNo,
          lotAtt06: "",
          lotAtt07: "",
          lotAtt08: "02",
          dedi05: order.id,
          dedi06: arrivalOrder.id,
          dedi09: arrivalOrder.oriTaxUnitPrice
        };
        details.push(detail);
      }
    } else {
      throw new Error("表体行无数据");
    }
    let warehouseId = "";
    let customerId = "";
    if (order.stockOrgId == "1473045320098643975") {
      //依安工厂
      warehouseId = "yourIdHere";
      customerId = "yourIdHere";
    } else if (order.stockOrgId == "1473041368737644546") {
      //克东
      warehouseId = "yourIdHere";
      customerId = "yourIdHere";
    } else if (order.stockOrgId == "2786425894965504") {
      //苏州仓
      warehouseId = "KSDS";
      customerId = "001";
    }
    let body = {
      data: {
        header: [
          {
            warehouseId: warehouseId,
            customerId: customerId,
            orderType: asnType,
            docNo: order.code,
            createSource: "YS",
            soReferenceA: "",
            soReferenceB: "",
            soReferenceC: "",
            soReferenceD: "",
            priority: "",
            orderTime: "",
            expectedShipmentTime1: "",
            requiredDeliveryTime: "",
            deliveryNo: "",
            consigneeId: merchantCode,
            consigneeName: order.agentId_name,
            consigneeContact: "",
            consigneeAddress1: order.receiveAddress,
            consigneeAddress2: "",
            consigneeAddress3: "",
            consigneeAddress4: "",
            consigneeCountry: "",
            consigneeProvince: "",
            consigneeCity: "",
            consigneeDistrict: "",
            consigneeStreet: "",
            consigneeMail: "",
            consigneeTel1: "",
            consigneeTel2: "",
            consigneeZip: "",
            carrierId: "",
            carrierName: "",
            carrierFax: "",
            carrierMail: "",
            issuePartyId: "",
            issuePartyName: "",
            issuePartyAddress1: "",
            issuePartyAddress2: "",
            issuePartyAddress3: "",
            issuePartyAddress4: "",
            channel: "",
            shop: "",
            billingId: "",
            billingName: "",
            billingAddress1: "",
            billingAddress2: "",
            billingAddress3: "",
            billingAddress4: "",
            hedi01: "",
            hedi02: dhWarehouse,
            hedi03: "",
            hedi04: "",
            hedi05: "",
            hedi06: "",
            hedi07: "",
            hedi08: "",
            hedi09: "",
            hedi10: "",
            invoicePrintFlag: "",
            route: "",
            stop: "",
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
            notes: "notes",
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