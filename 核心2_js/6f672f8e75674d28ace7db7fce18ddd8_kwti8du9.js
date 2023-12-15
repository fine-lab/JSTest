let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var MainId = request.id;
    let func1 = extrequire("ST.api001.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    // 调入详情
    let DRAPI = postman("get", "https://www.example.com/" + token + "&id=" + MainId, JSON.stringify(headers), null);
    let DRParse = JSON.parse(DRAPI);
    if (DRParse.code == 200) {
      var Data = DRParse.data;
      var srcBillNO = Data.srcBillNO;
      var vouchdate = Data.vouchdate;
      var bizType = Data.bizType;
      var srcBillType = Data.srcBillType;
      var pubts = Data.pubts;
      var createTime = Data.createTime;
      var outorg = Data.outorg;
      var outaccount = Data.outaccount;
      var inorg = Data.inorg;
      var inaccount = Data.inaccount;
      var outorg_name = Data.outorg_name;
      var inorg_name = Data.inorg_name;
      var code = Data.code;
      var bustype = Data.bustype;
      var outwarehouse = Data.outwarehouse;
      var outwarehouse_name = Data.outwarehouse_name;
      var inwarehouse_name = Data.inwarehouse_name;
      var inwarehouse = Data.inwarehouse;
      var details = Data.details;
      // 查询交易类型详情
      let bustypeAPI = postman("get", "https://www.example.com/" + token + "&id=" + bustype, JSON.stringify(headers), null);
      let BusTypeParse = JSON.parse(bustypeAPI);
      if (BusTypeParse.code == 200) {
        let BusCode = BusTypeParse.data.code;
        // 组织单元详情查询
        let inOrgResponse = postman("get", "https://www.example.com/" + token + "&id=" + inorg, JSON.stringify(headers), null);
        let inOrgObject = JSON.parse(inOrgResponse);
        if (inOrgObject.code == 200) {
          let inorgCode = inOrgObject.data.code;
          let Sql = "select code from aa.warehouse.Warehouse where id = '" + inwarehouse + "'";
          let inwarehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
          var inwarehouseCode = inwarehouseRes[0].code;
          // 组织单元详情查询
          let outOrgResponse = postman("get", "https://www.example.com/" + token + "&id=" + outorg, JSON.stringify(headers), null);
          let outOrgObject = JSON.parse(outOrgResponse);
          if (outOrgObject.code == 200) {
            let outorgCode = outOrgObject.data.code;
            let wareSql = "select code from aa.warehouse.Warehouse where id = '" + outwarehouse + "'";
            let outwarehouseRes = ObjectStore.queryByYonQL(wareSql, "productcenter");
            var outwarehouseCode = outwarehouseRes[0].code;
            if (details.length > 0) {
              let productData = {};
              let SunData = {};
              var orderLines = new Array();
              var orderList = new Array();
              for (let j = 0; j < details.length; j++) {
                let batchInfo = {};
                var batchInfoList = new Array();
                var productsku = details[j].productsku;
                var skuSql = "select code,name from pc.product.ProductSKU where id = '" + productsku + "'";
                var skuRes = ObjectStore.queryByYonQL(skuSql, "productcenter");
                var productsku_cCode = skuRes[0].code;
                var productsku_cName = skuRes[0].name;
                let productMessage = details[j].product;
                // 库存状态
                var stockStatusDoc = details[j].stockStatusDoc;
                var stockSql = "select statusName from st.stockStatusRecord.stockStatusRecord where id = '" + stockStatusDoc + "'";
                var stockRes = ObjectStore.queryByYonQL(stockSql, "ustock");
                var stockStatusDoc_name = stockRes[0].statusName;
                var inventoryType = "";
                if (stockStatusDoc_name == "合格") {
                  inventoryType = "FX";
                } else if (stockStatusDoc_name == "待检") {
                  inventoryType = "DJ";
                } else if (stockStatusDoc_name == "放行") {
                  inventoryType = "FX";
                } else if (stockStatusDoc_name == "冻结") {
                  inventoryType = "FREEZE";
                } else if (stockStatusDoc_name == "禁用") {
                  inventoryType = "DISABLE";
                } else if (stockStatusDoc_name == "不合格") {
                  inventoryType = "UN_HG";
                }
                let isBatchManage = details[j].isBatchManage;
                var batchno = null;
                if (isBatchManage == true) {
                  batchno = details[j].batchno;
                  var producedate = details[j].producedate;
                  var invaliddate = details[j].invaliddate;
                }
                let SunId = details[j].id;
                // 源头单据号
                var firstupcode = details[j].firstupcode;
                let qty = details[j].qty;
                let subQty = details[j].subQty;
                var pubtse = details[j].pubts;
                let contactsQuantity = details[j].contactsQuantity;
                let contactsPieces = details[j].contactsPieces;
                let unit = details[j].unit;
                let invExchRate = details[j].invExchRate;
                let stockUnitId = details[j].stockUnitId;
                let source = details[j].source;
                let sourceid = details[j].sourceid;
                let sourceautoid = details[j].sourceautoid;
                let upcode = details[j].upcode;
                let firstsource = details[j].firstsource;
                let firstsourceid = details[j].firstsourceid;
                let firstsourceautoid = details[j].firstsourceautoid;
                orderList.push({
                  id: SunId,
                  qty: qty,
                  subQty: subQty,
                  contactsQuantity: contactsQuantity,
                  contactsPieces: contactsPieces,
                  unit: unit,
                  pubts: pubtse,
                  sourceMainPubts: pubtse,
                  invExchRate: invExchRate,
                  stockUnitId: stockUnitId,
                  batchno: batchno,
                  invaliddate: invaliddate,
                  producedate: producedate,
                  source: source,
                  sourceid: sourceid,
                  sourceautoid: sourceautoid,
                  upcode: upcode,
                  productsku: productsku,
                  firstsource: firstsource,
                  firstsourceid: firstsourceid,
                  firstsourceautoid: firstsourceautoid,
                  firstupcode: firstupcode,
                  product: productMessage,
                  _status: "Update"
                });
                let productSql = "select stockUnit from pc.product.ProductDetail where productId = '" + productMessage + "'";
                let productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
                let stockUnit = productRes[0].stockUnit;
                // 计量单位详情查询
                let stockUnitsResponse = postman(
                  "get",
                  "https://www.example.com/" + token + "&id=" + stockUnit,
                  JSON.stringify(headers),
                  null
                );
                let stockUnitObject = JSON.parse(stockUnitsResponse);
                // 库存单位名称
                var stockUnit_name = details[j].stockUnit_name;
                let productDeatliSql = "select manageClass,name,code from pc.product.Product where id = '" + productMessage + "'";
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
                if (productClassObject.code == 200) {
                  let productClassName = productClassObject.data.parentName;
                  let productClassCode = productClassObject.data.parentCode;
                  batchInfo = {
                    batchCode: batchno,
                    inventoryType: inventoryType
                  };
                  batchInfoList.push(batchInfo);
                  productData = {
                    itemCode: productsku_cCode,
                    itemName: productsku_cName,
                    itemType: productClassCode,
                    itemTypeName: productClassName
                  };
                  SunData = {
                    orderLineNo: SunId,
                    relationOrderLineNo: SunId,
                    planQty: qty,
                    actualQty: qty,
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
                subBizOrderType: "DBRK",
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
                senderInfo: {},
                receiverInfo: {},
                SourcePlatformCode: "YS",
                ysId: MainId,
                bustype: BusCode,
                status: "WAIT_INBOUND"
              };
              let body = {
                appCode: "beiwei-ys",
                appApiCode: "ys.push.to.oms.dbrk",
                schemeCode: "bw47",
                jsonBody: jsonBody
              };
              let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
              let str = JSON.parse(strResponse);
              if (str.success != true) {
                throw new Error("下推OMS调入单失败：" + strResponse);
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