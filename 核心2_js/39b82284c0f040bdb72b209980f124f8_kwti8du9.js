let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let arrivalOrders = param.arrivalOrders;
    let order = param;
    let details = new Array();
    let func1 = extrequire("GT101792AT1.common.getDateTime");
    let resDate = func1.execute(null, null);
    let dhWarehouse = "";
    let func2 = extrequire("GZTBDM.backDesignerFunction.getVendor");
    let func3 = extrequire("GZTBDM.backDesignerFunction.getWarehouse");
    let func4 = extrequire("GZTBDM.backDesignerFunction.getMaterial");
    let func5 = extrequire("GZTBDM.backDesignerFunction.getVendorContact");
    let func6 = extrequire("GZTBDM.backDesignerFunction.getVendorDZ");
    let vendor = order.vendor;
    let vendorList = func2.execute(null, order.vendor).res;
    let vendorCode = vendorList[0].code;
    let vendorDZList = func6.execute(null, order.vendor).res;
    let vendorDZ = "";
    if (vendorDZList.length > 0) {
      vendorDZ = vendorDZList[0].detailAddress;
    } else {
      throw new Error("供应商未维护详细地址");
    }
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
        //查询生产厂商
        let sccssql = "select manufacturer_code from GT101792AT1.GT101792AT1.manufacturer	where dr=0 and id=" + arrivalOrder.define8;
        let sccsRes = ObjectStore.queryByYonQL(sccssql, "developplatform");
        let sccsCode = "";
        if (sccsRes.length > 0) {
          sccsCode = sccsRes[0].manufacturer_code;
        }
        let materialList = func4.execute(null, arrivalOrder.product).res;
        let producedateValue = arrivalOrder.producedate == null ? "" : substring(arrivalOrder.producedate, 0, 10);
        let invaliddateValue = arrivalOrder.invaliddate == null ? "" : substring(arrivalOrder.invaliddate, 0, 10);
        let lotAtt03 = arrivalOrder.define2 == null ? "" : substring(arrivalOrder.define2, 0, 10);
        let detail = {
          referenceNo: order.code,
          lineNo: i + 1,
          sku: materialList[0].cCode,
          qtyOrdered: arrivalOrder.qty * -1,
          lotAtt01: producedateValue,
          lotAtt02: invaliddateValue,
          lotAtt03: lotAtt03,
          lotAtt04: arrivalOrder.define4,
          lotAtt05: arrivalOrder.batchno,
          lotAtt08: "03",
          lotAtt09: sccsCode,
          dedi05: arrivalOrder.mainid,
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
    let asnType = "";
    if (order.busType == "1501340049359765512") {
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
            orderType: asnType,
            docNo: order.code,
            createSource: "YS",
            consigneeId: vendorCode,
            consigneeName: order.vendor_name,
            consigneeAddress1: order.contactAddress,
            hedi02: dhWarehouse, //出库编码
            details: details
          }
        ]
      }
    };
    return { body };
  }
}
exports({ entryPoint: MyTrigger });