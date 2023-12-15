let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    for (let i = 0; i < param.data.length; i++) {
      let srcBillType = param.data[i].srcBillType;
      let srcBill = param.data[i].srcBill;
      let func1 = extrequire("ST.api001.getToken");
      let res = func1.execute(require);
      let token = res.access_token;
      let orderCode = "";
      let bustype_code = "";
      let WMSCode = "";
      let URL = extrequire("GT101792AT1.common.PublicURL");
      let URLData = URL.execute(null, null);
      let GetTime = extrequire("GT101792AT1.common.LastGetTime");
      let GetTimeReturn = GetTime.execute(null, null);
      let operateType = "删除";
      if (srcBillType == "pu_arrivalorder") {
        // 上游为到货单
        let puSQL = "select sourceid from pu.arrivalorder.ArrivalOrders where mainid = '" + srcBill + "'";
        let puRES = ObjectStore.queryByYonQL(puSQL, "upu");
        console.log(JSON.stringify(puRES));
        let stSQL = "select code from pu.purchaseorder.PurchaseOrder where id = '" + puRES[0].sourceid + "'";
        let stRES = ObjectStore.queryByYonQL(stSQL, "upu");
        orderCode = stRES[0].code;
        console.log(JSON.stringify(stRES));
        // 自由自定义
        let definesSQL = "select define1 from st.purinrecord.PurInRecordDefine where id = '" + param.data[i].id + "'";
        let definesRES = ObjectStore.queryByYonQL(definesSQL, "ustock");
        console.log(JSON.stringify(definesRES));
        if (definesRES.length > 0) {
          WMSCode = definesRES[0].define1;
        }
      } else if (srcBillType == "st_purchaseorder") {
        // 上游为订单
        let stSQL = "select code,bustype_code from pu.purchaseorder.PurchaseOrder where id = '" + srcBill + "'";
        let stRES = ObjectStore.queryByYonQL(stSQL, "upu");
        console.log(JSON.stringify(stRES));
        orderCode = stRES[0].code;
        bustype_code = stRES[0].bustype_code;
        // 自由自定义
        let definesSQL = "select define1 from st.purinrecord.PurInRecordDefine where id = '" + param.data[i].id + "'";
        let definesRES = ObjectStore.queryByYonQL(definesSQL, "ustock");
        console.log(JSON.stringify(definesRES));
        if (definesRES.length > 0) {
          WMSCode = definesRES[0].define1;
        }
      }
      var inventoryType = "";
      if (bustype_code == "CG02") {
        inventoryType = "DJ";
      } else if (bustype_code == "CG05") {
        inventoryType = "DISABLE";
      } else {
        inventoryType = "FX";
      }
      let InData = getOtherOutRecoeds([param.data[i].id]);
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
        var firstsourceautoid = "";
        // 源头单据类型
        var firstsource = InData[0].purInRecords[j].firstsource;
        // 源头为订单
        if (firstsource == "upu.st_purchaseorder") {
          firstsourceautoid = InData[0].purInRecords[j].firstsourceautoid;
        } else if (firstsource == "pu_applyorder") {
          // 源头为请购单
          if (srcBillType == "pu_arrivalorder") {
            // 上游为到货单
            // 查询到货单主表
            let valSQL = "select srcBill from pu.arrivalorder.ArrivalOrder where id = '" + InData[0].purInRecords[j].sourceid + "'";
            let valRES = ObjectStore.queryByYonQL(valSQL, "ustock");
            // 查询采购订单子表
            let OrderSQL =
              "select id from pu.purchaseorder.PurchaseOrders where mainid = '" +
              valRES[0].srcBill +
              "' and product = '" +
              InData[0].purInRecords[j].product +
              "' and firstsourceid = '" +
              InData[0].purInRecords[j].firstsourceid +
              "'";
            let OrderRES = ObjectStore.queryByYonQL(OrderSQL, "upu");
            firstsourceautoid = OrderRES[0].id;
          } else if (srcBillType == "st_purchaseorder") {
            // 上游为订单
            let OrderSQL =
              "select id from pu.purchaseorder.PurchaseOrders where mainid = '" +
              srcBill +
              "' and product = '" +
              InData[0].purInRecords[j].product +
              "' and firstsourceid = '" +
              InData[0].purInRecords[j].firstsourceid +
              "'";
            let OrderRES = ObjectStore.queryByYonQL(OrderSQL, "upu");
            firstsourceautoid = OrderRES[0].id;
          }
        }
        var qty = InData[0].purInRecords[j].qty;
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
      let body = {
        appCode: "beiwei-oms",
        appApiCode: "ys.del.cgrk.order.interface",
        schemeCode: "bw47",
        jsonBody: {
          outBizOrderCode: param.data[i].code,
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
      console.log(JSON.stringify(body));
      let header = { "Content-Type": "application/json;charset=UTF-8" };
      let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
      console.log(strResponse);
      let str = JSON.parse(strResponse);
      // 打印日志
      let LogBody = {
        data: { code: param.data[i].code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
      };
      let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(header), JSON.stringify(LogBody));
      console.log(LogResponse);
      if (str.success != true) {
        if (str.errorCode != "A1000") {
          throw new Error("调用OMS采购入库取消API失败：" + str.errorMessage);
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
    function getOtherIn(ids) {
      var objects = {
        ids: ids,
        compositions: [
          {
            name: "purchaseOrders"
          }
        ]
      };
      return ObjectStore.selectBatchIds("pu.purchaseorder.PurchaseOrder", objects);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });