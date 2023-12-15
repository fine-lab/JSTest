let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data[0];
    let inWareSql = "select code from aa.warehouse.Warehouse where id = '" + Data.inwarehouse + "'";
    let inWareRes = ObjectStore.queryByYonQL(inWareSql, "productcenter");
    var inwareCode = inWareRes[0].code;
    if (inwareCode != "GGG000") {
      var status = param._status;
      if (status == "Insert") {
        // 上游单据编码
        var srcBillNO = Data.srcBillNO;
        var id = Data.id;
        let func1 = extrequire("ST.api001.getToken");
        let res = func1.execute(require);
        let token = res.access_token;
        let headers = { "Content-Type": "application/json;charset=UTF-8" };
        var createTime = Data.createTime;
        var date = new Date(createTime);
        let Year = date.getFullYear();
        let Moth = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let Day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let Hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let Minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let Sechond = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var GMT = Year + "-" + Moth + "-" + Day + " " + Hour + ":" + Minute + ":" + Sechond;
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
        if (BusTypeParse.code == "200") {
          let BusCode = BusTypeParse.data.code;
          if (BusCode == "DR02" || BusCode == "DR03" || BusCode == "DR01") {
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
                if (details.length > 0) {
                  let productData = {};
                  let SunData = {};
                  var orderLines = new Array();
                  for (let j = 0; j < details.length; j++) {
                    let batchInfo = {};
                    var batchInfoList = new Array();
                    let productMessage = details[j].product;
                    var stockStatusDoc_name = details[j].stockStatusDoc_name;
                    let isBatchManage = details[j].isBatchManage;
                    var batchno = null;
                    if (isBatchManage == true) {
                      batchno = details[j].batchno;
                    }
                    let SunId = details[j].id;
                    // 源头单据号
                    var firstupcode = details[j].firstupcode;
                    let qty = details[j].qty;
                    let subQty = details[j].subQty;
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
                    if (stockUnitObject.code == 200) {
                      var stockUnit_name = stockUnitObject.data.name.zh_CN;
                    } else {
                      throw new Error("未查询到该物料的库存单位！");
                    }
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
                    if (productClassObject.code == "200") {
                      let productClassName = productClassObject.data.name;
                      let productClassCode = productClassObject.data.code;
                      batchInfo = {
                        batchCode: batchno,
                        inventoryType: stockStatusDoc_name
                      };
                      batchInfoList.push(batchInfo);
                      productData = {
                        itemCode: productDeatliRes[0].code,
                        itemName: productDeatliRes[0].name,
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
                        inventoryType: stockStatusDoc_name,
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
                    createTime: GMT,
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
                    ysId: id,
                    bustype: BusCode,
                    status: "WAIT_INBOUND"
                  };
                  let body = {
                    appCode: "beiwei-ys",
                    appApiCode: "ys.push.to.oms.dbrk",
                    schemeCode: "bw47",
                    jsonBody: jsonBody
                  };
                  let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(headers), JSON.stringify(body));
                  let str = JSON.parse(strResponse);
                  if (str.success != true && str.errorCode != null) {
                    throw new Error("下推OMS调入单失败：" + str.errorMessage);
                  }
                }
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });