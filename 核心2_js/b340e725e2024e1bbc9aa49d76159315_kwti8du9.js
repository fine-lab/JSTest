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
    let func7 = extrequire("GT101792AT1.common.getBatchNo");
    let merchantCodeList = func6.execute(null, order.invoiceAgentId).res;
    let merchantCode = merchantCodeList[0].code;
    let asnType = "";
    if (order.transactionTypeId == "2369198632079875") {
      asnType = "XC01";
    }
    if (order.transactionTypeId == "1520983941275189257") {
      asnType = "XC02";
    }
    if (order.transactionTypeId == "2658145815138560") {
      asnType = "XC03";
    }
    if (order.transactionTypeId == "2658145605177600") {
      asnType = "XC04";
    }
    if (order.transactionTypeId == "2658146061472000") {
      asnType = "XC05";
    }
    if (order.transactionTypeId == "2658146233372928") {
      asnType = "XC06";
    }
    if (order.transactionTypeId == "2682033932931328") {
      asnType = "XC07";
    }
    if (order.transactionTypeId == "1484956613142380548") {
      asnType = "XC05";
    }
    if (order.transactionTypeId == "1490763915744247812") {
      asnType = "XC06";
    }
    if (order.transactionTypeId == "1490774318155038730") {
      asnType = "XC07";
    }
    if (order.transactionTypeId == "1606525430515367942") {
      asnType = "XC100";
    }
    if (order.transactionTypeId == "1613253264865230858") {
      asnType = "XC101";
    }
    if (order.transactionTypeId == "1613268005196660743") {
      asnType = "XC102";
    }
    if (order.transactionTypeId == "1765417410629206019") {
      asnType = "XSCKBCP";
    }
    if (order.transactionTypeId == "1765426653396729858") {
      asnType = "KQDDCKBCP";
    }
    if (order.transactionTypeId == "1765427100071231496") {
      asnType = "HDYPCKBCP";
    }
    if (order.transactionTypeId == "1765427469449429002") {
      asnType = "DMDDCKBCP";
    }
    if (order.transactionTypeId == "1770407630065893383") {
      asnType = "GSFLCKBCP";
    }
    if (order.transactionTypeId == "1770407913519054856") {
      asnType = "CZKXSCKBCP";
    }
    if (order.transactionTypeId == "1770408128276856838") {
      asnType = "KSLPCKBCP";
    }
    if (order.transactionTypeId == "1770410292942471171") {
      asnType = "DMDDCKWCCPBCP";
    }
    if (order.transactionTypeId == "1770411564239159297") {
      asnType = "PTXSCKWCCPBCP";
    }
    if (order.transactionTypeId == "1770411916427526145") {
      asnType = "CKDDWCCPBCP";
    }
    if (order.transactionTypeId == "1770412251450703878") {
      asnType = "ZNBMKQCKBCP";
    }
    if (order.transactionTypeId == "1770412466195922947") {
      asnType = "BFDDCKBCP";
    }
    let resDate = func1.execute(null, null);
    let dhWarehouse = undefined;
    let arrivalOrderdetail = undefined;
    if (deliveryDetails.length > 0) {
      a: for (var i = 0; i < deliveryDetails.length; i++) {
        let arrivalOrder = deliveryDetails[i];
        arrivalOrderdetail = deliveryDetails[0];
        if (i == 0) {
          let dhWarehouseList = func3.execute(null, arrivalOrder.stockId).res;
          if (dhWarehouseList.length > 0) {
            dhWarehouse = dhWarehouseList[0].code;
          } else {
            throw new Error("到货单表体未维护仓库");
          }
        }
        let materialList = func5.execute(null, arrivalOrder.skuId).res;
        let batchNoParam = {
          batchno: arrivalOrder.batchNo,
          productsku: arrivalOrder.skuId
        };
        let define2 = ""; //入库日期
        let define4 = ""; //供应商批次
        let producedateValue = "";
        let invaliddateValue = "";
        if (arrivalOrder.batchNo != undefined) {
          let batchNoList = func7.execute(null, batchNoParam).batchNoList;
          if (batchNoList.length > 0) {
            define4 = batchNoList[0].define4;
            define2 = batchNoList[0].define2;
            if (batchNoList[0].producedate != undefined && batchNoList[0].producedate.length > 10) {
              producedateValue = substring(batchNoList[0].producedate, 0, 10);
            }
            if (batchNoList[0].invaliddate != undefined && batchNoList[0].invaliddate.length > 10) {
              invaliddateValue = substring(batchNoList[0].invaliddate, 0, 10);
            }
          }
        }
        let detail = {
          referenceNo: order.code,
          lineNo: i + 1,
          sku: materialList[0].code,
          qtyOrdered: arrivalOrder.qty,
          price: "",
          lotAtt01: producedateValue,
          lotAtt02: invaliddateValue,
          lotAtt03: define2,
          lotAtt04: define4,
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
    if (order.stockOrgId == "2522102344422656") {
      //依安工厂
      warehouseId = "yourIdHere";
      customerId = "yourIdHere";
    } else if (order.stockOrgId == "2390178757465088") {
      //克东
      warehouseId = "yourIdHere";
      customerId = "yourIdHere";
    } else if (order.stockOrgId == "2369205391741184" || order.stockOrgId == "2522015793665536") {
      customerId = "001";
      if (includes(dhWarehouse, "KSDS")) {
        warehouseId = "KSDS";
      } else if (includes(dhWarehouse, "XADS") || includes(dhWarehouse, "XAGK")) {
        warehouseId = "XADS";
      } else if (includes(dhWarehouse, "SZC")) {
        warehouseId = "KSDS";
      }
    }
    let consigneeContact = "";
    let consigneeAddress1 = "";
    let consigneeTel1 = "";
    if (
      order.transactionTypeId == "1484956613142380548" ||
      order.transactionTypeId == "1490763915744247812" ||
      order.transactionTypeId == "1490774318155038730" ||
      order.transactionTypeId == "1606525430515367942"
    ) {
      var bodyFreeItem = arrivalOrderdetail.bodyFreeItem;
      if (bodyFreeItem == undefined || JSON.stringify(bodyFreeItem) === "{}") {
        throw new Error(JSON.stringify("交易类型为礼品卡相关的，请在表头自定义维护对应收货人信息，谢谢"));
      }
      consigneeContact = arrivalOrderdetail.bodyFreeItem[0].define3;
      consigneeAddress1 = arrivalOrderdetail.bodyFreeItem[0].define1;
      consigneeTel1 = arrivalOrderdetail.bodyFreeItem[0].define2;
    } else {
      consigneeContact = arrivalOrderdetail.receiver == undefined ? order.receiver : arrivalOrderdetail.receiver;
      consigneeAddress1 = arrivalOrderdetail.receiveAddress == undefined ? order.receiveAddress : arrivalOrderdetail.receiveAddress;
      consigneeTel1 = arrivalOrderdetail.receiveMobile == undefined ? order.receiveMobile : arrivalOrderdetail.receiveMobile;
    }
    let isbodyFreeItem = typeof arrivalOrderdetail.bodyFreeItem;
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
            consigneeContact: consigneeContact,
            consigneeAddress1: consigneeAddress1,
            consigneeAddress2: "",
            consigneeAddress3: "",
            consigneeAddress4: "",
            consigneeCountry: "",
            consigneeProvince: isbodyFreeItem != "undefined" ? arrivalOrderdetail.bodyFreeItem[0].define12 : "", //省
            consigneeCity: isbodyFreeItem != "undefined" ? arrivalOrderdetail.bodyFreeItem[0].define11 : "", //市
            consigneeDistrict: isbodyFreeItem != "undefined" ? arrivalOrderdetail.bodyFreeItem[0].define10 : "", //区
            consigneeStreet: "",
            consigneeMail: "",
            consigneeTel1: consigneeTel1,
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
            notes: order.shippingMemo,
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