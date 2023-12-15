let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var returnList = getInterface(param, context);
    function getInterface(param, context) {
      var id = param.id;
      // 页面状态
      var state = param.state;
      let func1 = extrequire("ST.api001.getToken");
      let res = func1.execute(require);
      let token = res.access_token;
      let headers = { "Content-Type": "application/json;charset=UTF-8" };
      // 查询调拨订单详情
      let apiResponse1 = postman("get", "https://www.example.com/" + token + "&id=" + id, JSON.stringify(headers), null);
      let api1 = JSON.parse(apiResponse1);
      if (state == "Audit") {
        if (api1.code == "200") {
          let Data = api1.data;
          // 单据编码
          let code = Data.code;
          // 入库单据日期
          let invouchdate = Data.vouchdate;
          // 入库仓库id
          let inwarehouse = Data.inwarehouse;
          // 入库仓库名称
          let inwarehouse_name = Data.inwarehouse_name;
          // 出库仓库id
          let outwarehouse = Data.outwarehouse;
          // 出库仓库名称
          let outwarehouse_name = Data.outwarehouse_name;
          // 入库组织id
          let inorg = Data.inorg;
          // 入库组织名称
          let inorg_name = Data.inorg_name;
          // 入库会计主体
          let inaccount = Data.inaccount;
          // 出库组织id
          let outorg = Data.outorg;
          // 出库组织名称
          let outorg_name = Data.outorg_name;
          // 出库会计主体
          let outaccount = Data.outaccount;
          // 交易类型
          let bustype = Data.bustype;
          // 查询交易类型详情
          let bustypeAPI = postman("get", "https://www.example.com/" + token + "&id=" + bustype, JSON.stringify(headers), null);
          let BusTypeParse = JSON.parse(bustypeAPI);
          if (BusTypeParse.code == "200") {
            let BusCode = BusTypeParse.data.code;
            let transferApplys = Data.transferApplys;
            let createTime = Data.createTime;
            // 组织单元详情查询
            let inOrgResponse = postman("get", "https://www.example.com/" + token + "&id=" + inorg, JSON.stringify(headers), null);
            let inOrgObject = JSON.parse(inOrgResponse);
            if (inOrgObject.code == "200") {
              let inorgCode = inOrgObject.data.code;
              let Sql = "select code from aa.warehouse.Warehouse where id = '" + inwarehouse + "'";
              let inwarehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
              var inwarehouseCode = inwarehouseRes[0].code;
              // 组织单元详情查询
              let outOrgResponse = postman(
                "get",
                "https://www.example.com/" + token + "&id=" + outorg,
                JSON.stringify(headers),
                null
              );
              let outOrgObject = JSON.parse(outOrgResponse);
              if (outOrgObject.code == "200") {
                let outorgCode = outOrgObject.data.code;
                let wareSql = "select code from aa.warehouse.Warehouse where id = '" + outwarehouse + "'";
                let outwarehouseRes = ObjectStore.queryByYonQL(wareSql, "productcenter");
                var outwarehouseCode = outwarehouseRes[0].code;
                let inventoryType = Data.headItem.define1;
                if (inventoryType == undefined || inventoryType == null) {
                  inventoryType = null;
                } else if (inventoryType == "放行") {
                  inventoryType = "FX";
                } else if (inventoryType == "待检") {
                  inventoryType = "DJ";
                } else if (inventoryType == "禁用") {
                  inventoryType = "DISABLE";
                }
                if (transferApplys.length > 0) {
                  let productData = {};
                  let SunData = {};
                  let batchInfo = {};
                  var batchInfoList = new Array();
                  var orderLines = new Array();
                  for (let j = 0; j < transferApplys.length; j++) {
                    let productMessage = transferApplys[j].product;
                    let supplier = transferApplys[j].define4;
                    var vendor_Code = null;
                    var vendor_Name = null;
                    if (supplier != undefined || supplier != null) {
                      // 供应商主表
                      let vendorSql = "select code,name from aa.vendor.Vendor where id = '" + supplier + "'";
                      let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
                      vendor_Code = vendorRes[0].code;
                      vendor_Name = vendorRes[0].name;
                    }
                    let isBatchManage = transferApplys[j].isBatchManage;
                    var batchno = null;
                    if (isBatchManage == true) {
                      batchno = transferApplys[j].batchno;
                    }
                    let SunId = transferApplys[j].id;
                    let qty = transferApplys[j].qty;
                    let stockUnit_name = transferApplys[j].stockUnit_name;
                    let product_cCode = transferApplys[j].product_cCode;
                    let product_cName = transferApplys[j].product_cName;
                    let productDeatliSql = "select manageClass from pc.product.Product where id = '" + productMessage + "'";
                    let productDeatliRes = ObjectStore.queryByYonQL(productDeatliSql, "productcenter");
                    let manageClass = productDeatliRes[0].manageClass;
                    // 物料分类详情查询
                    let productClassResponse = postman(
                      "get",
                      "https://www.example.com/" + token + "&id=" + manageClass,
                      JSON.stringify(headers),
                      null
                    );
                    let productClassObject = JSON.parse(productClassResponse);
                    if (productClassObject.code == "200") {
                      let productClassName = productClassObject.data.name;
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
                    bizOrderType: "SALE_PLAN",
                    subBizOrderType: "DB_PLAN",
                    orderSource: "MANUAL_IMPORT",
                    createTime: createTime,
                    outOwnerName: outorg_name,
                    outOwnerCode: outorgCode,
                    outWarehouseCode: outwarehouseCode,
                    outWarehouseName: outwarehouse_name,
                    inOwnerCode: inorgCode,
                    inOwnerName: inorg_name,
                    inWarehouseCode: inwarehouseCode,
                    inWarehouseName: inwarehouse_name,
                    warehouseCode: inwarehouseCode,
                    ownerCode: inorgCode,
                    orderLines: orderLines,
                    inorg: inorg,
                    outorg: outorg,
                    inaccountOrg: inaccount,
                    outaccountOrg: outaccount,
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
                    appApiCode: "standard.dbplan.order.entry.create",
                    schemeCode: "bw47",
                    jsonBody: jsonBody
                  };
                  return { body: body };
                }
              }
            }
          }
        }
      } else if (state == "UnAudit") {
        if (api1.code == "200") {
          let Data = api1.data;
          // 单据编码
          let code = Data.code;
          // 入库单据日期
          let invouchdate = Data.vouchdate;
          // 入库仓库id
          let inwarehouse = Data.inwarehouse;
          // 入库仓库名称
          let inwarehouse_name = Data.inwarehouse_name;
          // 出库仓库id
          let outwarehouse = Data.outwarehouse;
          // 出库仓库名称
          let outwarehouse_name = Data.outwarehouse_name;
          // 入库组织id
          let inorg = Data.inorg;
          // 入库组织名称
          let inorg_name = Data.inorg_name;
          let inaccount = Data.inaccount;
          // 出库组织id
          let outorg = Data.outorg;
          // 出库组织名称
          let outorg_name = Data.outorg_name;
          let outaccount = Data.outaccount;
          // 交易类型
          let bustype = Data.bustype;
          // 查询交易类型详情
          let bustypeAPI = postman("get", "https://www.example.com/" + token + "&id=" + bustype, JSON.stringify(headers), null);
          let BusTypeParse = JSON.parse(bustypeAPI);
          if (BusTypeParse.code == "200") {
            let BusCode = BusTypeParse.data.code;
            let transferApplys = Data.transferApplys;
            let createTime = Data.createTime;
            // 组织单元详情查询
            let inOrgResponse = postman("get", "https://www.example.com/" + token + "&id=" + inorg, JSON.stringify(headers), null);
            let inOrgObject = JSON.parse(inOrgResponse);
            if (inOrgObject.code == "200") {
              let inorgCode = inOrgObject.data.code;
              let Sql = "select code from aa.warehouse.Warehouse where id = '" + inwarehouse + "'";
              let inwarehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
              var inwarehouse_Code = inwarehouseRes[0].code;
              // 组织单元详情查询
              let outOrgResponse = postman(
                "get",
                "https://www.example.com/" + token + "&id=" + outorg,
                JSON.stringify(headers),
                null
              );
              let outOrgObject = JSON.parse(outOrgResponse);
              if (outOrgObject.code == "200") {
                let outorgCode = outOrgObject.data.code;
                let wareSql = "select code from aa.warehouse.Warehouse where id = '" + outwarehouse + "'";
                let outwarehouseRes = ObjectStore.queryByYonQL(wareSql, "productcenter");
                var outwarehouse_Code = outwarehouseRes[0].code;
                let inventoryType = Data.headItem.define1;
                if (inventoryType == undefined || inventoryType == null) {
                  inventoryType = null;
                } else if (inventoryType == "放行") {
                  inventoryType = "FX";
                } else if (inventoryType == "待检") {
                  inventoryType = "DJ";
                } else if (inventoryType == "禁用") {
                  inventoryType = "DISABLE";
                }
                if (transferApplys.length > 0) {
                  let productData = {};
                  let SunData = {};
                  let batchInfo = {};
                  var batchList = new Array();
                  var orderList = new Array();
                  for (let j = 0; j < transferApplys.length; j++) {
                    let productMessage = transferApplys[j].product;
                    let supplier = transferApplys[j].define4;
                    var vendorCode = null;
                    var vendorName = null;
                    if (supplier != undefined || supplier != null) {
                      // 供应商主表
                      let vendorSql = "select code,name from aa.vendor.Vendor where id = '" + supplier + "'";
                      let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
                      vendorCode = vendorRes[0].code;
                      vendorName = vendorRes[0].name;
                    }
                    let isBatchManage = transferApplys[j].isBatchManage;
                    var batchno = null;
                    if (isBatchManage == true) {
                      let BroNoSql = "select * from st.batchno.Batchno where product = '" + productMessage + "' and org = '" + inorg + "' order by pubts desc";
                      let BroNoRes = ObjectStore.queryByYonQL(BroNoSql, "yonbip-scm-scmbd");
                      batchno = BroNoRes[0].batchno;
                    }
                    let SunId = transferApplys[j].id;
                    let qty = transferApplys[j].qty;
                    let stockUnit_name = transferApplys[j].stockUnit_name;
                    let product_cCode = transferApplys[j].product_cCode;
                    let product_cName = transferApplys[j].product_cName;
                    let productDeatliSql = "select manageClass from pc.product.Product where id = '" + productMessage + "'";
                    let productDeatliRes = ObjectStore.queryByYonQL(productDeatliSql, "productcenter");
                    let manageClass = productDeatliRes[0].manageClass;
                    // 物料分类详情查询
                    let productClassResponse = postman(
                      "get",
                      "https://www.example.com/" + token + "&id=" + manageClass,
                      JSON.stringify(headers),
                      null
                    );
                    let productClassObject = JSON.parse(productClassResponse);
                    if (productClassObject.code == "200") {
                      let productClassName = productClassObject.data.name;
                      let productClassCode = productClassObject.data.code;
                      batchInfo = {
                        batchCode: batchno,
                        inventoryType: inventoryType
                      };
                      batchList.push(batchInfo);
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
                        batchInfos: batchList
                      };
                      orderList.push(SunData);
                    }
                  }
                  let jsonBody = {
                    outBizOrderCode: code,
                    bizOrderType: "SALE_PLAN",
                    subBizOrderType: "DB_PLAN",
                    orderSource: "MANUAL_IMPORT",
                    createTime: createTime,
                    outOwnerName: outorg_name,
                    outOwnerCode: outorgCode,
                    outWarehouseCode: outwarehouse_Code,
                    outWarehouseName: outwarehouse_name,
                    inOwnerCode: inorgCode,
                    inOwnerName: inorg_name,
                    inWarehouseCode: inwarehouse_Code,
                    inWarehouseName: inwarehouse_name,
                    warehouseCode: inwarehouseCode,
                    ownerCode: inorgCode,
                    orderLines: orderLines,
                    inorg: inorg,
                    outorg: outorg,
                    inaccountOrg: inaccount,
                    outaccountOrg: outaccount,
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
                    appApiCode: "ys.to.oms.dbplan.cancel",
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
    }
    return { returnList: returnList };
  }
}
exports({ entryPoint: MyTrigger });