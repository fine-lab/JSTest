let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let Data = param.data;
    let srcBillType = Data[0].srcBillType;
    let srcBill = Data[0].srcBill;
    let orderCode = "";
    let bustype_code = "";
    let WMSCode = "";
    if (srcBillType == "pu_arrivalorder") {
      // 上游为到货单
      // 到货单主表
      let puSQL = "select srcBill from pu.arrivalorder.ArrivalOrder where id = '" + srcBill + "'";
      let puRES = ObjectStore.queryByYonQL(puSQL, "upu");
      // 订单主表
      let stSQL = "select code from pu.purchaseorder.PurchaseOrder where id = '" + puRES[0].srcBill + "'";
      let stRES = ObjectStore.queryByYonQL(stSQL, "upu");
      orderCode = stRES[0].code;
      // 自由自定义
      let definesSQL = "select define1 from st.purinrecord.PurInRecordDefine where id = '" + Data[0].id + "'";
      let definesRES = ObjectStore.queryByYonQL(definesSQL, "ustock");
      if (definesRES.length > 0) {
        WMSCode = definesRES[0].define1;
      }
    } else if (srcBillType == "st_purchaseorder") {
      // 上游为订单
      // 订单主表
      let stSQL = "select code,bustype_code from pu.purchaseorder.PurchaseOrder where id = '" + srcBill + "'";
      let stRES = ObjectStore.queryByYonQL(stSQL, "upu");
      orderCode = stRES[0].code;
      bustype_code = stRES[0].bustype_code;
      // 自由自定义
      let definesSQL = "select define1 from st.purinrecord.PurInRecordDefine where id = '" + Data[0].id + "'";
      let definesRES = ObjectStore.queryByYonQL(definesSQL, "ustock");
      if (definesRES.length > 0) {
        WMSCode = definesRES[0].define1;
      }
    }
    var inventoryType = "";
    if (bustype_code == "CG02") {
      inventoryType = "DJ";
    } else if (bustype_code == "CG03") {
      inventoryType = "DISABLE";
    } else {
      inventoryType = "FX";
    }
    let InData = getOtherOutRecoeds([Data[0].id]);
    // 供应商主表
    let vendorSql = "select code,name from aa.vendor.Vendor where id = '" + InData[0].vendor + "'";
    let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
    let vendor_Name = vendorRes[0].name;
    let vendor_Code = vendorRes[0].code;
    // 组织单元
    let OrgSQL = "select code from org.func.BaseOrg where id = '" + InData[0].org + "'";
    let OrgRES = ObjectStore.queryByYonQL(OrgSQL, "ucf-org-center");
    let orgCode = OrgRES[0].code;
    // 仓库档案
    let warehouseSQL = "select code from aa.warehouse.Warehouse where id = '" + InData[0].warehouse + "'";
    let warehouseRES = ObjectStore.queryByYonQL(warehouseSQL, "productcenter");
    let warehouseCode = warehouseRES[0].code;
    var orderList = new Array();
    for (let j = 0; j < InData[0].purInRecords.length; j++) {
      let proSkuSQL = "select code,name from pc.product.ProductSKU where id = '" + InData[0].purInRecords[j].productsku + "'";
      let proSkuRES = ObjectStore.queryByYonQL(proSkuSQL, "productcenter");
      var productskuCode = proSkuRES[0].code;
      var productskuName = proSkuRES[0].name;
      var batchno = InData[0].purInRecords[j].batchno;
      var expireDate = InData[0].purInRecords[j].invaliddate;
      var productDate = InData[0].purInRecords[j].producedate;
      var qty = InData[0].purInRecords[j].qty;
      var firstsourceautoid = "";
      if (srcBillType == "pu_arrivalorder") {
        firstsourceautoid = InData[0].purInRecords[j].firstsourceautoid;
      } else {
        let OrderSQL = "select id from pu.purchaseorder.PurchaseOrders where mainid = '" + srcBill + "' and product = '" + InData[0].purInRecords[j].product + "'";
        let OrderRES = ObjectStore.queryByYonQL(OrderSQL, "upu");
        firstsourceautoid = OrderRES[0].id;
      }
      orderList.push({
        planQty: qty,
        actualQty: qty,
        relationOrderLineNo: firstsourceautoid,
        inventoryType: inventoryType,
        itemInfo: { itemCode: productskuCode, itemName: productskuName },
        batchInfos: [{ batchCode: batchno, expireDate: expireDate, productDate: productDate, quantity: qty }],
        currentActualQty: qty
      });
    }
    var body = {
      appCode: "beiwei-oms",
      appApiCode: "ys.del.cgrk.order.interface",
      schemeCode: "bw47",
      jsonBody: {
        outBizOrderCode: Data[0].code,
        wmsFulfilOperationCode: WMSCode,
        purchaseOrderCode: orderCode,
        bizOrderType: "INBOUND",
        subBizOrderType: "CGRK",
        ownerCode: orgCode,
        warehouseCode: warehouseCode,
        supplierName: vendor_Name,
        supplierCode: vendor_Code,
        orderLines: orderList,
        orderSource: "YS",
        channelCode: "DEFAULT"
      }
    };
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
    return { orderBody: body };
  }
}
exports({ entryPoint: MyTrigger });