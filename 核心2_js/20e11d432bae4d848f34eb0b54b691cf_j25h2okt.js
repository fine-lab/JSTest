let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var returnList = getInterface(param, context);
    function getInterface(param, context) {
      var id = param.id;
      var state = param.state;
      if (state == "UnOther") {
        let func1 = extrequire("ST.api001.getToken");
        let res = func1.execute(require);
        let token = res.access_token;
        let headers = { "Content-Type": "application/json;charset=UTF-8" };
        // 查询其他入库详情
        let apiResponse1 = postman("get", "https://www.example.com/" + token + "&id=" + id, JSON.stringify(headers), null);
        let api1 = JSON.parse(apiResponse1);
        if (api1.code == "200") {
          let Data = api1.data;
          // 单据编码
          let code = Data.code;
          // 仓库id
          let warehouse = Data.warehouse;
          // 交易类型id
          let bustype = Data.bustype;
          // 查询交易类型详情
          let bustypeAPI = postman("get", "https://www.example.com/" + token + "&id=" + bustype, JSON.stringify(headers), null);
          let BusTypeParse = JSON.parse(bustypeAPI);
          if (BusTypeParse.code == "200") {
            let BusCode = BusTypeParse.data.code;
            // 组织
            let org = Data.org;
            let othInRecords = Data.othInRecords;
            let createTime = Data.createTime;
            // 组织单元详情查询
            let OrgResponse = postman("get", "https://www.example.com/" + token + "&id=" + org, JSON.stringify(headers), null);
            let OrgObject = JSON.parse(OrgResponse);
            if (OrgObject.code == "200") {
              let orgCode = OrgObject.data.code;
              let Sql = "select code from aa.warehouse.Warehouse where id = '" + warehouse + "'";
              let warehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
              var warehouseCode = warehouseRes[0].code;
              // 质量状态
              let inventoryType = Data["headItem!define1"];
              if (inventoryType == undefined || inventoryType == null) {
                inventoryType = null;
              } else if (inventoryType == "放行") {
                inventoryType = "FX";
              } else if (inventoryType == "待检") {
                inventoryType = "DJ";
              } else if (inventoryType == "禁用") {
                inventoryType = "DISABLE";
              }
              if (othInRecords.length > 0) {
                let productData = {};
                let SunData = {};
                let batchInfo = {};
                var batchInfoList = new Array();
                var orderLines = new Array();
                for (let j = 0; j < othInRecords.length; j++) {
                  let supplier = othInRecords[j].define4;
                  var vendor_Code = null;
                  var vendor_Name = null;
                  if (supplier != undefined || supplier != null) {
                    // 供应商主表
                    let vendorSql = "select code,name from aa.vendor.Vendor where id = '" + supplier + "'";
                    let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
                    vendor_Code = vendorRes[0].code;
                    vendor_Name = vendorRes[0].name;
                  }
                  let productMessage = othInRecords[j].product;
                  let productDeatliSql = "select isBatchManage from pc.product.ProductDetail where productId = '" + productMessage + "'";
                  let productDeatliRes = ObjectStore.queryByYonQL(productDeatliSql, "productcenter");
                  let isBatchManage = productDeatliRes[0].isBatchManage;
                  var batchno = null;
                  if (isBatchManage == true) {
                    let BroNoSql = "select * from st.batchno.Batchno where product = '" + productMessage + "' and org = '" + org + "' order by pubts desc";
                    let BroNoRes = ObjectStore.queryByYonQL(BroNoSql, "yonbip-scm-scmbd");
                    batchno = BroNoRes[0].batchno;
                  }
                  let SunId = othInRecords[j].id;
                  let qty = othInRecords[j].qty;
                  let product_cCode = othInRecords[j].product_cCode;
                  let product_cName = othInRecords[j].product_cName;
                  let productClass = othInRecords[j].productClass;
                  let productClassName = othInRecords[j].productClassName;
                  let stockUnit_name = othInRecords[j].stockUnit_name;
                  // 物料分类详情查询
                  let productClassResponse = postman(
                    "get",
                    "https://www.example.com/" + token + "&id=" + productClass,
                    JSON.stringify(headers),
                    null
                  );
                  let productClassObject = JSON.parse(productClassResponse);
                  if (productClassObject.code == "200") {
                    let productClassCode = productClassObject.data.code;
                    batchInfo = {
                      batchCode: batchno,
                      inventoryType: inventoryType
                    };
                    batchInfoList.push(batchInfo);
                    productData = {
                      itemCode: product_cCode,
                      itemName: product_cName,
                      itemType: productClassCode,
                      itemTypeName: productClassName
                    };
                    SunData = {
                      orderLineNo: SunId,
                      relationOrderLineNo: SunId,
                      planQty: qty,
                      unit: stockUnit_name,
                      itemInfo: productData,
                      inventoryType: inventoryType,
                      batchInfos: batchInfoList
                    };
                    orderLines.push(SunData);
                  }
                }
                let jsonBody = {
                  outBizOrderCode: code,
                  bizOrderType: "INBOUND",
                  subBizOrderType: "QTRK",
                  orderSource: "MANUAL_IMPORT",
                  createTime: createTime,
                  warehouseCode: warehouseCode,
                  ownerCode: orgCode,
                  orderLines: orderLines,
                  channelCode: "XDQD",
                  supplierCode: vendor_Code,
                  supplierName: vendor_Name,
                  senderInfo: null,
                  receiverInfo: null,
                  SourcePlatformCode: "YS",
                  ysId: id,
                  extendProps: { bustype: BusCode },
                  status: "WAIT_INBOUND"
                };
                let body = {
                  appCode: "beiwei-ys",
                  appApiCode: "ys.to.oms.qtrk.cancel",
                  schemeCode: "bw47",
                  jsonBody: jsonBody
                };
                return { body: body };
              }
            }
          }
        }
      } else {
        let func1 = extrequire("ST.api001.getToken");
        let res = func1.execute(require);
        let token = res.access_token;
        let headers = { "Content-Type": "application/json;charset=UTF-8" };
        // 查询其他出库详情
        let apiResponse1 = postman("get", "https://www.example.com/" + token + "&id=" + id, JSON.stringify(headers), null);
        let api1 = JSON.parse(apiResponse1);
        let kssls = JSON.stringify(apiResponse1);
        if (api1.code == "200") {
          let Data = api1.data;
          // 单据编码
          let code = Data.code;
          // 仓库id
          let warehouse = Data.warehouse;
          // 交易类型id
          let bustype = Data.bustype;
          // 查询交易类型详情
          let bustypeAPI = postman("get", "https://www.example.com/" + token + "&id=" + bustype, JSON.stringify(headers), null);
          let BusTypeParse = JSON.parse(bustypeAPI);
          if (BusTypeParse.code == "200") {
            let BusCode = BusTypeParse.data.code;
            // 组织
            let org = Data.org;
            let othOutRecords = Data.othOutRecords;
            let createTime = Data.createTime;
            // 组织单元详情查询
            let OrgResponse = postman("get", "https://www.example.com/" + token + "&id=" + org, JSON.stringify(headers), null);
            let OrgObject = JSON.parse(OrgResponse);
            if (OrgObject.code == "200") {
              let orgCode = OrgObject.data.code;
              let Sql = "select code from aa.warehouse.Warehouse where id = '" + warehouse + "'";
              let warehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
              var warehouseCode = warehouseRes[0].code;
              // 质量状态
              let inventoryType = Data["headItem!define1"];
              if (inventoryType == undefined || inventoryType == null) {
                inventoryType = null;
              } else if (inventoryType == "放行") {
                inventoryType = "FX";
              } else if (inventoryType == "待检") {
                inventoryType = "DJ";
              } else if (inventoryType == "禁用") {
                inventoryType = "DISABLE";
              }
              if (othOutRecords.length > 0) {
                let productData = {};
                let SunData = {};
                let batch_Info = {};
                var batchInfo_List = new Array();
                var orderList = new Array();
                for (let j = 0; j < othOutRecords.length; j++) {
                  let supplier = othOutRecords[j].define4;
                  var vendorCode = null;
                  var vendor_name = null;
                  if (supplier != undefined || supplier != null) {
                    // 供应商主表
                    let vendorSql = "select code,name from aa.vendor.Vendor where id = '" + supplier + "'";
                    let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
                    vendorCode = vendorRes[0].code;
                    vendor_name = vendorRes[0].name;
                  }
                  let productMessage = othOutRecords[j].product;
                  let productSql = "select manageClass from pc.product.Product where id = '" + productMessage + "'";
                  let productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
                  let sqrw = JSON.stringify(productRes);
                  var batchNo = othOutRecords[j].batchno;
                  let SunId = othOutRecords[j].id;
                  let qty = othOutRecords[j].qty;
                  let product_cCode = othOutRecords[j].product_cCode;
                  let product_cName = othOutRecords[j].product_cName;
                  let manageClass = productRes[0].manageClass;
                  let stockUnit_name = othOutRecords[j].stockUnit_name;
                  // 物料分类详情查询
                  let productClassResponse = postman(
                    "get",
                    "https://www.example.com/" + token + "&id=" + manageClass,
                    JSON.stringify(headers),
                    null
                  );
                  let productClassObject = JSON.parse(productClassResponse);
                  if (productClassObject.code == "200") {
                    let productClassCode = productClassObject.data.code;
                    let productClassName = productClassObject.data.name;
                    batch_Info = {
                      batchCode: batchNo,
                      inventoryType: inventoryType
                    };
                    batchInfo_List.push(batch_Info);
                    productData = {
                      itemCode: product_cCode,
                      itemName: product_cName,
                      itemType: productClassCode,
                      itemTypeName: productClassName
                    };
                    SunData = {
                      orderLineNo: SunId,
                      relationOrderLineNo: SunId,
                      planQty: qty,
                      unit: stockUnit_name,
                      inventoryType: inventoryType,
                      batchInfos: batchInfo_List,
                      itemInfo: productData
                    };
                    orderList.push(SunData);
                  }
                }
                let jsonBody = {
                  outBizOrderCode: code,
                  bizOrderType: "OUTBOUND",
                  subBizOrderType: "QTCK",
                  orderSource: "MANUAL_IMPORT",
                  createTime: createTime,
                  warehouseCode: warehouseCode,
                  ownerCode: orgCode,
                  orderLines: orderList,
                  channelCode: "XDQD",
                  supplierCode: vendorCode,
                  supplierName: vendor_name,
                  senderInfo: null,
                  receiverInfo: null,
                  SourcePlatformCode: "YS",
                  ysId: id,
                  extendProps: { bustype: BusCode },
                  status: "WAIT_INBOUND"
                };
                let body = {
                  appCode: "beiwei-ys",
                  appApiCode: "ys.to.oms.qtck.cancel",
                  schemeCode: "bw47",
                  jsonBody: jsonBody
                };
                return { body: body };
              }
            }
          }
        }
      }
    }
    return { returnList: returnList };
  }
}
exports({ entryPoint: MyTrigger });