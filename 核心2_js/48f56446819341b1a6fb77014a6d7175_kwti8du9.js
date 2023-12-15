let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let arrivalOrders = param.arrivalOrders;
    let order = param;
    let details = new Array();
    let func1 = extrequire("GT101792AT1.common.getDateTime");
    //获取供应商
    let func2 = extrequire("GZTBDM.backDesignerFunction.getVendor");
    //获取仓库
    let func3 = extrequire("GZTBDM.backDesignerFunction.getWarehouse");
    //获取物料
    let func4 = extrequire("GZTBDM.backDesignerFunction.getMaterial");
    let vendorList = func2.execute(null, order.vendor).res;
    let vendorCode = vendorList[0].code;
    let vendorName = vendorList[0].name;
    let resDate = func1.execute(null, null);
    let dhWarehouse = undefined;
    if (arrivalOrders.length > 0) {
      a: for (var i = 0; i < arrivalOrders.length; i++) {
        let arrivalOrder = arrivalOrders[i];
        if (i == 0) {
          let dhWarehouseList = func3.execute(null, arrivalOrder.warehouse).res;
          if (dhWarehouseList.length > 0) {
            dhWarehouse = dhWarehouseList[0].code;
          } else {
            throw new Error("到货单表体未维护仓库");
          }
        }
        let materialList = func4.execute(null, arrivalOrder.product).res;
        let detail = {
          referenceNo: order.code,
          lineNo: i + 1,
          sku: materialList[0].cCode,
          expectedQty: arrivalOrder.qty,
          totalPrice: "",
          lotAtt01: "",
          lotAtt02: "",
          lotAtt03: "",
          lotAtt04: "",
          lotAtt05: "",
          lotAtt06: "",
          lotAtt07: "",
          lotAtt08: "01",
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
          dedi05: arrivalOrder.mainid, //上游单据主表id
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
    if (order.inInvoiceOrg == "2522102344422656") {
      //依安工厂
      warehouseId = "yourIdHere";
      customerId = "yourIdHere";
    } else if (order.inInvoiceOrg == "2390178757465088") {
      //克东
      warehouseId = "yourIdHere";
      customerId = "yourIdHere";
    } else if (order.inInvoiceOrg == "2369205391741184") {
      customerId = "001";
      if (includes(dhWarehouse, "KSDS")) {
        warehouseId = "KSDS";
      } else if (includes(dhWarehouse, "XADS") || includes(dhWarehouse, "XAGK")) {
        warehouseId = "XADS";
      } else if (includes(dhWarehouse, "SZC")) {
        warehouseId = "KSDS";
      }
    }
    let headFreeItem = order.headFreeItem;
    let asnType = "";
    if (order.busType == "1501321452140888070") {
      asnType = "RK02";
    } else {
      asnType = "RK03";
    }
    if (warehouseId == "" || customerId == "") {
      return null;
    }
    let body = {
      data: {
        header: [
          {
            warehouseId: warehouseId,
            customerId: customerId,
            asnType: asnType,
            docNo: order.code,
            createSource: "YS",
            asnReferenceA: "",
            asnReferenceB: headFreeItem[0].define1, //上游采购订单单号
            asnReferenceC: "",
            asnReferenceD: "",
            asnCreationTime: "",
            expectedArriveTime1: resDate.dateStr,
            expectedArriveTime2: "",
            supplierId: vendorCode,
            supplierName: vendorName,
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
            hedi01: dhWarehouse, //入库编码
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