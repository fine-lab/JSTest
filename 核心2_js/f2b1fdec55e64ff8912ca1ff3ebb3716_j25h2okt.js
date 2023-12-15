let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let Data = param.data;
    var code = "";
    // 供应商
    let vendor = Data.vendor;
    // 供应商主表
    let vendorSql = "select code,name from aa.vendor.Vendor where id = '" + vendor + "'";
    let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
    let vendor_Name = vendorRes[0].name;
    let vendor_Code = vendorRes[0].code;
    // 入库单上游单据编号
    var srcBillNO = Data.srcBillNO;
    var srcBill = Data.srcBill;
    let srcBillType = Data.srcBillType;
    if (srcBillType == "pu_arrivalorder") {
      // 上游为到货单
      code = Data.code;
    } else if (srcBillType == "st_purchaseorder") {
      // 上游为订单
      let stSQL = "select code,bustype_code from pu.purchaseorder.PurchaseOrder where id = '" + srcBill + "'";
      let stRES = ObjectStore.queryByYonQL(stSQL, "upu");
      code = stRES[0].code;
      var bustype_code = stRES[0].bustype_code;
    }
    let warehouse_name = Data.warehouse_name;
    let org = Data.org;
    let createTime = Data.createTime;
    let date = new Date(createTime);
    let Y = date.getFullYear() + "-";
    let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
    let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    // 入库时间
    var finishTime = Y + M + D;
    // 子表数组
    let purInRecords = Data.purInRecords;
    let func1 = extrequire("ST.api001.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    // 仓库
    let warehouse = Data.warehouse;
    let warehouseSql = "select bWMS,code from aa.warehouse.Warehouse where id = '" + warehouse + "'";
    let warehouseRes = ObjectStore.queryByYonQL(warehouseSql, "productcenter");
    // 是否WMS
    let bWMS = warehouseRes[0].bWMS;
    var warehouse_code = warehouseRes[0].code;
    // 组织单元详情查询
    let OrgSQL = "select code from org.func.BaseOrg where id = '" + org + "'";
    let OrgRES = ObjectStore.queryByYonQL(OrgSQL, "ucf-org-center");
    var OrgCode = OrgRES[0].code;
    let bustype = Data.bustype;
    // 查询交易类型
    let busSQL = "select code from bd.bill.TransType where id = '" + bustype + "'";
    let busRES = ObjectStore.queryByYonQL(busSQL, "transtype");
    let bustype_name = Data.bustype_name;
    // 快递信息
    let logisticsInfo = {};
    // 定义主表数组
    let fulfilOperations = new Array();
    let fulfilOperation = {};
    // 定义子表数组
    let SunList = new Array();
    // 子表信息
    let OperationOrderLine = {};
    // 交易类型为原料玉米时
    if (busRES[0].code == "RK01") {
      if (purInRecords.length > 0) {
        for (let j = 0; j < purInRecords.length; j++) {
          // 物料信息
          let itemInfo = {};
          // 批次号数组
          let batchList = new Array();
          // 批次号信息
          let batchInfos = {};
          let extendProps = {};
          // 物料SKUcode
          let productsku_cCode = purInRecords[j].productsku_cCode;
          let productsku_cName = purInRecords[j].productsku_cName;
          // 批次管理
          let isBatchManage = purInRecords[j].isBatchManage;
          let producedate = "";
          let invaliddate = "";
          let batchno = "";
          if (isBatchManage == true) {
            // 批次
            batchno = purInRecords[j].batchno;
            if (null == batchno) {
              throw new Error("商品编码：" + product_Code + " 该商品为批次管理商品，批次号必填！");
            } else {
              let body = { pageIndex: 1, pageSize: 10, batchno: batchno };
              let url = "https://www.example.com/";
              let BatapiResponse = openLinker("POST", url, "ST", JSON.stringify(body));
              let BatApi = JSON.parse(BatapiResponse);
              if (BatApi.code == "200") {
                let recordList = BatApi.data.recordList;
                if (recordList.length > 0) {
                  // 生产日期
                  producedate = recordList[0].producedate;
                  // 有效期至
                  invaliddate = recordList[0].invaliddate;
                }
              }
            }
          }
          // 物料
          let product = purInRecords[j].product;
          // 数量
          let qty = purInRecords[j].qty;
          // 应收数量
          let contactsQuantity = purInRecords[j].contactsQuantity;
          let SunId = purInRecords[j].id;
          // 物料分类
          let productClass = purInRecords[j].productClass;
          // 单位名称
          let stockUnit_name = purInRecords[j].stockUnit_name;
          batchInfos = {
            batchCode: batchno,
            productDate: producedate,
            expireDate: invaliddate,
            quantity: qty
          };
          batchList.push(batchInfos);
          itemInfo = {
            itemCode: productsku_cCode,
            itemName: productsku_cName
          };
          OperationOrderLine = {
            planQty: qty,
            actualQty: qty,
            currentActualQty: qty,
            itemInfo: itemInfo,
            inventoryType: "FX",
            batchInfos: batchList
          };
          SunList.push(OperationOrderLine);
        }
      }
    } else {
      if (purInRecords.length > 0) {
        for (let j = 0; j < purInRecords.length; j++) {
          // 源头子表id
          let sourceautoid = "";
          let lineno = "";
          let RecordsState = purInRecords[j].hasOwnProperty("sourceautoid");
          if (RecordsState == true) {
            sourceautoid = purInRecords[j].sourceautoid;
          }
          // 物料信息
          let itemInfo = {};
          // 批次号数组
          let batchList = new Array();
          // 批次号信息
          let batchInfos = {};
          let extendProps = {};
          // 物料SKUCode
          let productsku_cCode = purInRecords[j].productsku_cCode;
          let productsku_cName = purInRecords[j].productsku_cName;
          // 生产日期
          let producedate = "";
          // 有效期至
          let invaliddate = "";
          // 批次管理
          let isBatchManage = purInRecords[j].isBatchManage;
          let batchno = "";
          if (isBatchManage == true) {
            // 批次
            batchno = purInRecords[j].batchno;
            if (null == batchno) {
              throw new Error("商品编码：" + productsku_cCode + " 该商品为批次管理商品，批次号必填！");
            } else {
              let body = { pageIndex: 1, pageSize: 10, batchno: batchno };
              let url = "https://www.example.com/";
              let BatapiResponse = openLinker("POST", url, "ST", JSON.stringify(body));
              let BatApi = JSON.parse(BatapiResponse);
              if (BatApi.code == "200") {
                let recordList = BatApi.data.recordList;
                if (recordList.length > 0) {
                  // 生产日期
                  producedate = recordList[0].producedate;
                  // 有效期至
                  invaliddate = recordList[0].invaliddate;
                }
              }
            }
          }
          // 数量
          let qty = purInRecords[j].qty;
          // 应收数量
          let contactsQuantity = purInRecords[j].contactsQuantity;
          let SunId = purInRecords[j].id;
          // 物料分类
          let productClass = purInRecords[j].productClass;
          // 单位名称
          let stockUnit_name = purInRecords[j].stockUnit_name;
          batchInfos = {
            batchCode: batchno,
            productDate: producedate,
            expireDate: invaliddate,
            quantity: qty
          };
          batchList.push(batchInfos);
          extendProps = {
            bustype: bustype_name
          };
          itemInfo = {
            itemCode: productsku_cCode,
            itemName: productsku_cName
          };
          OperationOrderLine = {
            orderLineNo: sourceautoid,
            inventoryType: "FX",
            planQty: qty,
            actualQty: qty,
            unit: stockUnit_name,
            itemInfo: itemInfo,
            batchInfos: batchList,
            extendProps: extendProps
          };
          SunList.push(OperationOrderLine);
        }
      }
    }
    return {
      vendor_Name: vendor_Name,
      vendor_Code: vendor_Code,
      OrgCode: OrgCode,
      warehouse_code: warehouse_code,
      finishTime: finishTime,
      srcBillNO: srcBillNO,
      SunList: SunList,
      bustypeCode: busRES[0].code,
      bWMS: bWMS,
      bustype_code: bustype_code,
      code: code
    };
  }
}
exports({ entryPoint: MyTrigger });