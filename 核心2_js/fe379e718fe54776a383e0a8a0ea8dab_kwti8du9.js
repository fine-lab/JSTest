let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let Data = JSON.parse(request.data);
    let state = Data.hasOwnProperty("srcBillNO");
    if (state == true) {
      // 供应商
      let vendor = Data.vendor;
      // 供应商主表
      let vendorSql = "select code,name from aa.vendor.Vendor where id = '" + vendor + "'";
      let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
      let vendor_Name = vendorRes[0].name;
      let vendor_Code = vendorRes[0].code;
      // 入库单上游单据编号
      let srcBillNO = Data.srcBillNO;
      let warehouse_name = Data.warehouse_name;
      let org = Data.org;
      let code = Data.code;
      let createTime = Data.createTime;
      let date = new Date(createTime);
      let Y = date.getFullYear() + "-";
      let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // 入库时间
      let finishTime = Y + M + D;
      // 子表数组
      let purInRecords = Data.purInRecords;
      let func1 = extrequire("ST.api001.getToken");
      let res = func1.execute(require);
      let token = res.access_token;
      let headers = { "Content-Type": "application/json;charset=UTF-8" };
      // 仓库
      let warehouse = Data.warehouse;
      let warehouseSql = "select code from aa.warehouse.Warehouse where id = '" + warehouse + "'";
      let warehouseRes = ObjectStore.queryByYonQL(warehouseSql, "productcenter");
      // 查询仓库是否下推WMS
      let CKDefineSql = "select * from aa.warehouse.WarehouseFreeDefine where id = '" + warehouse + "'";
      let CKDefineRes = ObjectStore.queryByYonQL(CKDefineSql, "productcenter");
      // 是否WMS
      let bWMS = CKDefineRes[0].define1;
      let warehouse_code = warehouseRes[0].code;
      // 组织单元详情查询
      let OrgSQL = "select code from org.func.BaseOrg where id = '" + org + "'";
      let OrgRES = ObjectStore.queryByYonQL(OrgSQL, "ucf-org-center");
      let OrgCode = OrgRES[0].code;
      let bustype = Data.bustype;
      // 查询交易类型
      let busSQL = "select code from bd.bill.TransType where id = '" + bustype + "'";
      let busRES = ObjectStore.queryByYonQL(busSQL, "transtype");
      let bustype_name = Data.bustype_name;
      console.log(JSON.stringify(busRES[0].code));
      if (busRES[0].code == "RK01") {
        // 快递信息
        let logisticsInfo = {};
        // 定义主表数组
        let fulfilOperations = new Array();
        let fulfilOperation = {};
        // 定义子表数组
        let SunList = new Array();
        // 子表信息
        let OperationOrderLine = {};
        if (purInRecords.length > 0) {
          for (let j = 0; j < purInRecords.length; j++) {
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
            // 物料编码
            let product_Code = purInRecords[j].product_code;
            // 物料名称
            let product_cName = purInRecords[j].product_cName;
            // 批次管理
            let isBatchManage = purInRecords[j].isBatchManage;
            // 批次
            let batchno = "";
            let producedate = "";
            let invaliddate = "";
            if (isBatchManage == true) {
              // 批次
              batchno = purInRecords[j].batchno;
              if (null == batchno) {
                throw new Error("商品编码：" + productsku_cCode + " 该商品为批次管理商品，批次号必填！");
              } else {
                let body = { pageIndex: 1, pageSize: 10, batchno: [batchno] };
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
              inventoryType: "FX",
              planQty: qty,
              actualQty: qty,
              currentActualQty: qty,
              itemInfo: itemInfo,
              batchInfos: batchList
            };
            SunList.push(OperationOrderLine);
          }
        }
        let jsonBody = {
          outBizOrderCode: code,
          bizOrderType: "INBOUND",
          subBizOrderType: "CGRK",
          ownerCode: OrgCode,
          warehouseCode: warehouse_code,
          supplierCode: vendor_Code,
          supplierName: vendor_Name,
          channelCode: "DEFAULT",
          orderLines: SunList,
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
        let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
        let str = JSON.parse(strResponse);
        console.log(JSON.stringify(str));
        if (str.success != true) {
          throw new Error("调用OMS采购入库创建API失败：" + str.errorMessage);
        }
      } else {
        // 采购订单列表查询
        let bodys = { pageIndex: 1, pageSize: 10, isSum: false, simpleVOs: [{ field: "code", op: "eq", value1: srcBillNO }] };
        let URL = "https://www.example.com/";
        let APIReturnList = openLinker("POST", URL, "ST", JSON.stringify(bodys));
        let APIList = JSON.parse(APIReturnList);
        if (APIList.code == "200") {
          // 采购订单返回的集合
          let DDrecordList = APIList.data.recordList;
          // 采购订单交易类型
          let Orderbustype = DDrecordList[0].bustype;
          // 查询交易类型
          let busOrderSQL = "select code from bd.bill.TransType where id = '" + Orderbustype + "'";
          let busOrderRES = ObjectStore.queryByYonQL(busOrderSQL, "transtype");
          // 采购订单交易类型编码
          let bustype_Code = busOrderRES[0].code;
          if (!bWMS || bWMS == "false") {
            if (bustype_Code == "A20001" || bustype_Code == "CG02" || bustype_Code == "CG03" || bustype_Code == "CG06") {
              //正常采购
              // 快递信息
              let logisticsInfo = {};
              // 定义主表数组
              let fulfilOperations = new Array();
              let fulfilOperation = {};
              // 定义子表数组
              let SunList = new Array();
              // 子表信息
              let OperationOrderLine = {};
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
                  let productsku_cCode = purInRecords[j].productsku_cCode;
                  let productsku_cName = purInRecords[j].productsku_cName;
                  // 物料编码
                  let product_Code = purInRecords[j].product_code;
                  // 物料名称
                  let product_cName = purInRecords[j].product_cName;
                  // 批次
                  let batchno = purInRecords[j].batchno;
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
              fulfilOperation = {
                entryOrderCode: code,
                outBizOrderCode: code,
                omsOrderCode: srcBillNO,
                ownerCode: OrgCode,
                bizOrderType: "INBOUND",
                subBizOrderType: "CGRK",
                status: "INBOUND",
                warehouseCode: warehouse_code,
                finishTime: finishTime,
                operationOrderLines: SunList,
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
              let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
              let str = JSON.parse(strResponse);
              console.log(JSON.stringify(str));
              if (str.success != true) {
                throw new Error("调用OMS采购入库确认创建API失败，失败原因：" + str.errorMessage);
              }
            } else if (bustype_Code == "A20003" || bustype_Code == "CG04" || bustype_Code == "CG05") {
              //退供
              // 快递信息
              let logisticsInfo = {};
              // 定义主表数组
              let fulfilOperations = new Array();
              let fulfilOperation = {};
              // 定义子表数组
              let SunList = new Array();
              // 子表信息
              let OperationOrderLine = {};
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
                  let batchLists = new Array();
                  // 批次号信息
                  let batchInfoses = {};
                  let extendProps = {};
                  let productsku_cCode = purInRecords[j].productsku_cCode;
                  let productsku_cName = purInRecords[j].productsku_cName;
                  // 库存状态名称
                  // 物料编码
                  let product_Code = purInRecords[j].product_code;
                  // 物料名称
                  let product_cName = purInRecords[j].product_cName;
                  // 批次
                  let batchno = purInRecords[j].batchno;
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
                  batchInfoses = {
                    batchCode: batchno,
                    quantity: qty
                  };
                  batchLists.push(batchInfoses);
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
                    batchInfos: batchLists,
                    extendProps: extendProps
                  };
                  SunList.push(OperationOrderLine);
                }
              }
              fulfilOperation = {
                entryOrderCode: code,
                outBizOrderCode: code,
                omsOrderCode: srcBillNO,
                ownerCode: OrgCode,
                bizOrderType: "OUTBOUND",
                subBizOrderType: "CGRK",
                status: "OUTBOUND",
                warehouseCode: warehouse_code,
                finishTime: finishTime,
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
              let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
              let str = JSON.parse(strResponse);
              console.log(JSON.stringify(str));
              if (str.success != true) {
                throw new Error("调用OMS采购入库确认创建API失败，失败原因：" + str.errorMessage);
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });