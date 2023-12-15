let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    throw new Error(131211);
    var returnList = getInterface(param, context);
    function getInterface(param, context) {
      var ArrayMianList = param.ArrayMianList;
      var id = ArrayMianList[0].id;
      var state = param.state;
      if (state == "Other") {
        let func1 = extrequire("ST.api001.getToken");
        let res = func1.execute(require);
        let token = res.access_token;
        let headers = { "Content-Type": "application/json;charset=UTF-8" };
        // 单据编码
        let code = ArrayMianList[0].code;
        // 形态转换交易类型名称
        let bustypeCode = ArrayMianList[0].bustypeCode;
        // 仓库id
        let warehouse = ArrayMianList[0].warehouse;
        // 交易类型id
        let bustype = ArrayMianList[0].bustype;
        // 查询交易类型详情
        let bustypeAPI = postman("get", "https://www.example.com/" + token + "&id=" + bustype, JSON.stringify(headers), null);
        let BusTypeParse = JSON.parse(bustypeAPI);
        if (BusTypeParse.code == "200") {
          let BusCode = BusTypeParse.data.code;
          // 组织
          let org = ArrayMianList[0].org;
          // 会计主体
          let accountOrg = ArrayMianList[0].accountOrg;
          // 组织单元详情查询
          let accountOrgResponse = postman(
            "get",
            "https://www.example.com/" + token + "&id=" + accountOrg,
            JSON.stringify(headers),
            null
          );
          let accountOrgObject = JSON.parse(accountOrgResponse);
          if (accountOrgObject.code == 200) {
            var accountOrgName = accountOrgObject.data.name.zh_CN;
          }
          // 库存员ID
          var stockMgrs = "";
          // 库存员名称
          var stocNames = "";
          // 判断库存员是否存在
          var stocSateses = ArrayMianList[0].hasOwnProperty("stockMgr");
          if (stocSateses == true) {
            stockMgrs = ArrayMianList[0].stockMgr;
            let stocDeatil = postman("get", "https://www.example.com/" + token + "&id=" + stockMgrs, JSON.stringify(headers), null);
            let stocAPI = JSON.parse(stocDeatil);
            if (stocAPI.code == 200) {
              stocNames = stocAPI.data.name;
            }
          }
          // 采购员ID
          var operators = "";
          // 采购员名称
          var atorNames = "";
          // 判断采购员是否存在
          var atorSateser = ArrayMianList[0].hasOwnProperty("operator");
          if (atorSateser == true) {
            operators = ArrayMianList[0].operator;
            let atorDeatil = postman("get", "https://www.example.com/" + token + "&id=" + operators, JSON.stringify(headers), null);
            let atorAPI = JSON.parse(atorDeatil);
            if (atorAPI.code == 200) {
              atorNames = atorAPI.data.name;
            }
          }
          var remarker = "";
          var remarkBooles = ArrayMianList[0].hasOwnProperty("remark");
          if (remarkBooles == true) {
            remarker = ArrayMianList[0].remark;
          }
          let othInRecords = ArrayMianList[0].othInRecords;
          let createTime = ArrayMianList[0].createTime;
          var InDate = new Date(createTime);
          let Year = InDate.getFullYear();
          let Moth = InDate.getMonth() + 1 < 10 ? "0" + (InDate.getMonth() + 1) : InDate.getMonth() + 1;
          let Day = InDate.getDate() < 10 ? "0" + InDate.getDate() : InDate.getDate();
          let Hour = InDate.getHours() < 10 ? "0" + InDate.getHours() : InDate.getHours();
          let Minute = InDate.getMinutes() < 10 ? "0" + InDate.getMinutes() : InDate.getMinutes();
          let Sechond = InDate.getSeconds() < 10 ? "0" + InDate.getSeconds() : InDate.getSeconds();
          var INDATE = Year + "-" + Moth + "-" + Day + " " + Hour + ":" + Minute + ":" + Sechond;
          // 组织单元详情查询
          let OrgResponse = postman("get", "https://www.example.com/" + token + "&id=" + org, JSON.stringify(headers), null);
          let OrgObject = JSON.parse(OrgResponse);
          if (OrgObject.code == "200") {
            let orgCode = OrgObject.data.code;
            let Sql = "select code from aa.warehouse.Warehouse where id = '" + warehouse + "'";
            let warehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
            var warehouseCode = warehouseRes[0].code;
            // 质量状态
            let inventoryType = ArrayMianList[0].inventoryType;
            if (inventoryType == "合格") {
              inventoryType = "FX";
            } else if (inventoryType == "待检") {
              inventoryType = "DJ";
            } else if (inventoryType == "放行") {
              inventoryType = "FX";
            } else if (inventoryType == "冻结") {
              inventoryType = "FREEZE";
            } else if (inventoryType == "禁用") {
              inventoryType = "DISABLE";
            } else if (inventoryType == "不合格") {
              inventoryType = "UN_HG";
            }
            if (othInRecords.length > 0) {
              let productData = {};
              let SunData = {};
              let batchInfo = {};
              var batchInfoList = new Array();
              var orderLines = new Array();
              for (let j = 0; j < othInRecords.length; j++) {
                let supplier = othInRecords[j].define4;
                let batchno = othInRecords[j].batchno;
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
                let productDeatliSql = "select manageClass,code from pc.product.Product where id = '" + productMessage + "'";
                let productDeatliRes = ObjectStore.queryByYonQL(productDeatliSql, "productcenter");
                let SunId = othInRecords[j].id;
                let qty = othInRecords[j].qty;
                let subQty = othInRecords[j].subQty;
                let product_cCode = productDeatliRes[0].code;
                let product_cName = othInRecords[j].product_cName;
                let productClass = productDeatliRes[0].manageClass;
                let stockUnitId = othInRecords[j].stockUnitId;
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
                  let productClassName = productClassObject.data.name;
                  // 计量单位详情查询
                  let stockUnitResponse = postman(
                    "get",
                    "https://www.example.com/" + token + "&id=" + stockUnitId,
                    JSON.stringify(headers),
                    null
                  );
                  let stockUnitObject = JSON.parse(stockUnitResponse);
                  if (stockUnitObject.code == "200") {
                    let stockUnit_name = stockUnitObject.data.name.zh_CN;
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
                      actualQty: qty,
                      unit: stockUnit_name,
                      itemInfo: productData,
                      inventoryType: inventoryType,
                      batchInfos: batchInfoList
                    };
                    orderLines.push(SunData);
                  } else {
                    throw new Error("查询计价单位API失败");
                  }
                }
              }
              let jsonBody = {
                outBizOrderCode: code,
                bizOrderType: "INBOUND",
                XTZHBusType: bustypeCode,
                subBizOrderType: "QTRK",
                orderSource: "MANUAL_IMPORT",
                createTime: INDATE,
                org: org,
                accountingEntity: accountOrgName,
                salesMan: atorNames,
                remark: remarker,
                storeKeeper: stocNames,
                warehouseCode: warehouseCode,
                ownerCode: orgCode,
                orderLines: orderLines,
                channelCode: "XDQD",
                supplierCode: "00YL000004",
                supplierName: "天韦合作社",
                senderInfo: {},
                receiverInfo: {},
                SourcePlatformCode: "YS",
                bustype: BusCode,
                ysId: id,
                status: "WAIT_INBOUND"
              };
              let body = {
                appCode: "beiwei-ys",
                appApiCode: "standard.other.order.entry.create",
                schemeCode: "bw47",
                jsonBody: jsonBody
              };
              return { body: body };
            }
          }
        }
      } else {
        let func1 = extrequire("ST.api001.getToken");
        let res = func1.execute(require);
        let token = res.access_token;
        let headers = { "Content-Type": "application/json;charset=UTF-8" };
        // 单据编码
        let code = ArrayMianList[0].code;
        // 仓库id
        let warehouse = ArrayMianList[0].warehouse;
        // 形态转换交易类型名称
        let bustypeCode = ArrayMianList[0].bustypeCode;
        // 交易类型id
        let bustype = ArrayMianList[0].bustype;
        // 查询交易类型详情
        let bustypeAPI = postman("get", "https://www.example.com/" + token + "&id=" + bustype, JSON.stringify(headers), null);
        let BusTypeParse = JSON.parse(bustypeAPI);
        if (BusTypeParse.code == "200") {
          let BusCode = BusTypeParse.data.code;
          // 组织
          let org = ArrayMianList[0].org;
          // 会计主体
          let accountOrg = ArrayMianList[0].accountOrg;
          // 组织单元详情查询
          let accountOrgResponse = postman(
            "get",
            "https://www.example.com/" + token + "&id=" + accountOrg,
            JSON.stringify(headers),
            null
          );
          let accountOrgObject = JSON.parse(accountOrgResponse);
          if (accountOrgObject.code == 200) {
            var accountOrgNames = accountOrgObject.data.name.zh_CN;
          }
          // 库存员ID
          var stockMgr = "";
          // 库存员名称
          var stocName = "";
          // 判断库存员是否存在
          var stocSates = ArrayMianList[0].hasOwnProperty("stockMgr");
          if (stocSates == true) {
            stockMgr = ArrayMianList[0].stockMgr;
            let stocDeatil = postman("get", "https://www.example.com/" + token + "&id=" + stockMgr, JSON.stringify(headers), null);
            let stocAPI = JSON.parse(stocDeatil);
            if (stocAPI.code == 200) {
              stocName = stocAPI.data.name;
            }
          }
          // 业务员ID
          var operator = "";
          // 业务员名称
          var atorName = "";
          // 判断业务员是否存在
          var atorSates = ArrayMianList[0].hasOwnProperty("operator");
          if (atorSates == true) {
            operator = ArrayMianList[0].operator;
            let atorDeatil = postman("get", "https://www.example.com/" + token + "&id=" + operator, JSON.stringify(headers), null);
            let atorAPI = JSON.parse(atorDeatil);
            if (atorAPI.code == 200) {
              atorName = atorAPI.data.name;
            }
          }
          var remark = "";
          var remarkBool = ArrayMianList[0].hasOwnProperty("remark");
          if (remarkBool == true) {
            remark = ArrayMianList[0].remark;
          }
          let othOutRecords = ArrayMianList[0].othOutRecords;
          let createTime = ArrayMianList[0].createTime;
          var date = new Date(createTime);
          let Year = date.getFullYear();
          let Moth = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
          let Day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
          let Hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          let Minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          let Sechond = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
          var GMT = Year + "-" + Moth + "-" + Day + " " + Hour + ":" + Minute + ":" + Sechond;
          // 组织单元详情查询
          let OrgResponse = postman("get", "https://www.example.com/" + token + "&id=" + org, JSON.stringify(headers), null);
          let OrgObject = JSON.parse(OrgResponse);
          if (OrgObject.code == "200") {
            let orgCode = OrgObject.data.code;
            let Sql = "select code from aa.warehouse.Warehouse where id = '" + warehouse + "'";
            let warehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
            var warehouseCode = warehouseRes[0].code;
            // 质量状态
            let inventoryType = ArrayMianList[0].inventoryType;
            if (inventoryType == "合格") {
              inventoryType = "FX";
            } else if (inventoryType == "待检") {
              inventoryType = "DJ";
            } else if (inventoryType == "放行") {
              inventoryType = "FX";
            } else if (inventoryType == "冻结") {
              inventoryType = "FREEZE";
            } else if (inventoryType == "禁用") {
              inventoryType = "DISABLE";
            } else if (inventoryType == "不合格") {
              inventoryType = "UN_HG";
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
                let productSql = "select manageClass,code from pc.product.Product where id = '" + productMessage + "'";
                let productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
                let sqrw = JSON.stringify(productRes);
                var batchNo = othOutRecords[j].batchno;
                let SunId = othOutRecords[j].id;
                let qty = othOutRecords[j].qty;
                let subQty = othOutRecords[j].subQty;
                let product_cCode = productRes[0].code;
                let product_cName = othOutRecords[j].product_cName;
                let manageClass = productRes[0].manageClass;
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
                  let stockUnitId = othOutRecords[j].stockUnitId;
                  // 计量单位详情查询
                  let stockUnitResponse = postman(
                    "get",
                    "https://www.example.com/" + token + "&id=" + stockUnitId,
                    JSON.stringify(headers),
                    null
                  );
                  let stockUnitObject = JSON.parse(stockUnitResponse);
                  if (stockUnitObject.code == "200") {
                    let stockUnit_name = stockUnitObject.data.name.zh_CN;
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
                      actualQty: qty,
                      unit: stockUnit_name,
                      inventoryType: inventoryType,
                      batchInfos: batchInfo_List,
                      itemInfo: productData
                    };
                    orderList.push(SunData);
                  }
                } else {
                  throw new Error("查询计价单位API失败");
                }
              }
              let jsonBody = {
                outBizOrderCode: code,
                XTZHBusType: bustypeCode,
                bizOrderType: "OUTBOUND",
                subBizOrderType: "QTCK",
                orderSource: "MANUAL_IMPORT",
                createTime: GMT,
                salesMan: atorName,
                storeKeeper: stocName,
                remark: remark,
                org: org,
                accountingEntity: accountOrgNames,
                warehouseCode: warehouseCode,
                ownerCode: orgCode,
                orderLines: orderList,
                channelCode: "XSQD003",
                supplierCode: "00YL000004",
                supplierName: "天韦合作社",
                senderInfo: {},
                receiverInfo: {},
                SourcePlatformCode: "YS",
                ysId: id,
                bustype: BusCode,
                status: "WAIT_INBOUND"
              };
              let body = {
                appCode: "beiwei-ys",
                appApiCode: "standard.other.order.out.create",
                schemeCode: "bw47",
                jsonBody: jsonBody
              };
              return { body: body };
            }
          }
        }
      }
    }
    return { returnList: returnList };
  }
}
exports({ entryPoint: MyTrigger });