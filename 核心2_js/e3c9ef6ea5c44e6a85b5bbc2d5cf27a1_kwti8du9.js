let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 查询调出单列表
    let body = { pageIndex: 1, pageSize: 20, isSum: false, simpleVOs: [{ op: "eq", field: "defines.define9", value2: "false", value1: "false" }] };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "ST", JSON.stringify(body));
    let outList = JSON.parse(apiResponse);
    if (outList.code == 200) {
      let DataList = outList.data.recordList;
      for (let i = 0; i < DataList.length; i++) {
        let Outid = DataList[i].id;
        let func1 = extrequire("ST.api001.getToken");
        let res = func1.execute(require);
        let token = res.access_token;
        let headers = { "Content-Type": "application/json;charset=UTF-8" };
        // 调出详情查询
        let DCResponse = postman("get", "https://www.example.com/" + token + "&id=" + Outid, JSON.stringify(headers), null);
        let DCResponseList = JSON.parse(DCResponse);
        if (DCResponseList.code == 200) {
          let DCData = DCResponseList.data;
          var createTime = DCData.createTime;
          var pubts = DCData.pubts;
          var srcBillType = DCData.srcBillType;
          var vouchdate = DCData.vouchdate;
          var bizType = DCData.bizType;
          var srcBillNO = DCData.srcBillNO;
          var outorg = DCData.outorg;
          var inorg = DCData.inorg;
          var outaccount = DCData.outaccount;
          var inaccount = DCData.inaccount;
          var outorg_name = DCData.outorg_name;
          var inorg_name = DCData.inorg_name;
          var code = DCData.code;
          var bustype = DCData.bustype;
          var outwarehouse = DCData.outwarehouse;
          var outwarehouse_name = DCData.outwarehouse_name;
          var inwarehouse_name = DCData.inwarehouse_name;
          var inwarehouse = DCData.inwarehouse;
          var details = DCData.details;
          let InSql = "select code from aa.warehouse.Warehouse where id = '" + inwarehouse + "'";
          let InwareRes = ObjectStore.queryByYonQL(InSql, "productcenter");
          var InwareCode = InwareRes[0].code;
          if (InwareCode != "CTU256") {
            // 查询交易类型详情
            let bustypeAPI = postman("get", "https://www.example.com/" + token + "&id=" + bustype, JSON.stringify(headers), null);
            let BusTypeParse = JSON.parse(bustypeAPI);
            if (BusTypeParse.code == 200) {
              let BusCode = BusTypeParse.data.code;
              // 组织单元详情查询
              let inOrgResponse = postman(
                "get",
                "https://www.example.com/" + token + "&id=" + inorg,
                JSON.stringify(headers),
                null
              );
              let inOrgObject = JSON.parse(inOrgResponse);
              if (inOrgObject.code == 200) {
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
                      let productMessage = details[j].product;
                      var pubtse = details[j].pubts;
                      var productsku = details[j].productsku;
                      var skuSql = "select code,name from pc.product.ProductSKU where id = '" + productsku + "'";
                      var skuRes = ObjectStore.queryByYonQL(skuSql, "productcenter");
                      var productsku_cCode = skuRes[0].code;
                      var productsku_cName = skuRes[0].name;
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
                      let qty = details[j].qty;
                      let subQty = details[j].subQty;
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
                      let firstupcode = details[j].firstupcode;
                      orderList.push({
                        id: SunId,
                        qty: qty,
                        subQty: subQty,
                        contactsQuantity: contactsQuantity,
                        contactsPieces: contactsPieces,
                        unit: unit,
                        pubts: pubtse,
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
                      let unitName = details[j].unitName;
                      let productSql = "select stockUnit from pc.product.ProductDetail where productId = '" + productMessage + "'";
                      let productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
                      let stockUnit = productRes[0].stockUnit;
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
                      bizOrderType: "OUTBOUND",
                      subBizOrderType: "DBCK",
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
                      warehouseCode: outwarehouseCode,
                      ownerCode: outorgCode,
                      orderLines: orderLines,
                      inorg: inorg,
                      outorg: outorg,
                      inaccountOrg: inaccount,
                      outaccountOrg: outaccount,
                      channelCode: "XDQD",
                      senderInfo: {},
                      receiverInfo: {},
                      SourcePlatformCode: "YS",
                      ysId: Outid,
                      bustype: BusCode,
                      status: "WAIT_INBOUND"
                    };
                    let body = {
                      appCode: "beiwei-ys",
                      appApiCode: "ys.push.to.oms.dbck",
                      schemeCode: "bw47",
                      jsonBody: jsonBody
                    };
                    throw new Error(JSON.stringify(body));
                    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
                    let str = JSON.parse(strResponse);
                    if (str.success != true) {
                      throw new Error("调用OMS调出保存失败：" + strResponse);
                    } else {
                      var data = {
                        outorg: outorg,
                        id: Outid,
                        outaccount: outorg,
                        vouchdate: vouchdate,
                        bustype: bustype,
                        bizType: bizType,
                        outwarehouse: outwarehouse,
                        inorg: inorg,
                        inaccount: inaccount,
                        srcBillType: srcBillType,
                        _status: "Update",
                        pubts: pubts,
                        defines: { define9: true },
                        details: orderList
                      };
                      var item = { data: data };
                      let URL = "https://www.example.com/";
                      let ApiResponse = openLinker("POST", URL, "ST", JSON.stringify(item));
                      let ApiState = JSON.parse(ApiResponse);
                    }
                  }
                }
              }
            }
          } else {
            // 查询交易类型详情
            let bustypeAPI = postman("get", "https://www.example.com/" + token + "&id=" + bustype, JSON.stringify(headers), null);
            let BusTypeParse = JSON.parse(bustypeAPI);
            if (BusTypeParse.code == "200") {
              let BusCode = BusTypeParse.data.code;
              let bust = "";
              if (BusCode == "DC01") {
                bust = "DR01";
              } else if (BusCode == "DC02") {
                bust = "DR02";
              } else if (BusCode == "DC03") {
                bust = "DR03";
              } else if (BusCode == "A09001") {
                bust = "A07001";
              } else if (BusCode == "A09003") {
                bust = "A07002";
              } else if (BusCode == "DC05") {
                bust = "DR05";
              } else if (BusCode == "DC04") {
                bust = "DR04";
              } else if (BusCode == "DC06") {
                bust = "DR06";
              } else if (BusCode == "DC07") {
                bust = "DR07";
              }
              // 组织单元详情查询
              let inOrgResponse = postman(
                "get",
                "https://www.example.com/" + token + "&id=" + inorg,
                JSON.stringify(headers),
                null
              );
              let inOrgObject = JSON.parse(inOrgResponse);
              if (inOrgObject.code == "200") {
                let inorgCode = inOrgObject.data.code;
                let Sql = "select code from aa.warehouse.Warehouse where id = '" + inwarehouse + "'";
                let inwarehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
                let inwarehouseCode = inwarehouseRes[0].code;
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
                  let outwarehouseCode = outwarehouseRes[0].code;
                  if (details.length > 0) {
                    let productData = {};
                    let SunData = {};
                    let orderLines = new Array();
                    for (let j = 0; j < details.length; j++) {
                      let batchInfo = {};
                      let batchInfoList = new Array();
                      let productMessage = details[j].product;
                      let stockStatusDoc = details[j].stockStatusDoc;
                      let stockSql = "select statusName from st.stockStatusRecord.stockStatusRecord where id = '" + stockStatusDoc + "'";
                      let stockRes = ObjectStore.queryByYonQL(stockSql, "ustock");
                      let stockStatusDoc_name = stockRes[0].statusName;
                      let inventoryType = "";
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
                        inventoryType = "DISABLE";
                      }
                      let isBatchManage = details[j].isBatchManage;
                      let productsku_cCode = details[j].productsku_cCode;
                      let productsku_cName = details[j].productsku_cName;
                      let batchno = null;
                      if (isBatchManage == true) {
                        batchno = details[j].batchno;
                      }
                      let SunId = details[j].id;
                      let qty = details[j].qty;
                      let subQty = details[j].subQty;
                      let unitName = details[j].unitName;
                      let invExchRate = details[j].invExchRate;
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
                          planQty: qty * invExchRate,
                          actualQty: qty * invExchRate,
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
                      createTime: GMT,
                      outOwnerName: outorg_name,
                      outOwnerCode: outorgCode,
                      outWarehouseCode: outwarehouseCode,
                      outWarehouseName: outwarehouse_name,
                      inOwnerCode: inorgCode,
                      inOwnerName: inorg_name,
                      inWarehouseCode: inwarehouseCode,
                      inWarehouseName: inwarehouse_name,
                      warehouseCode: outwarehouseCode,
                      ownerCode: outorgCode,
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
                      bustype: bust,
                      status: "WAIT_INBOUND"
                    };
                    let body = {
                      appCode: "beiwei-ys",
                      appApiCode: "ys.push.to.oms.dbrk",
                      schemeCode: "bw47",
                      jsonBody: jsonBody
                    };
                    let header = { "Content-Type": "application/json;charset=UTF-8" };
                    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
                    let str = JSON.parse(strResponse);
                    if (str.success != true) {
                      throw new Error("调用OMS调入创建失败：" + strResponse);
                    }
                  }
                }
              } else {
                throw new Error("组织单元查询失败！");
              }
            } else {
              throw new Error("交易类型详情查询失败！");
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });