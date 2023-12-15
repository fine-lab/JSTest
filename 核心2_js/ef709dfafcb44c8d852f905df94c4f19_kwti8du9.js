let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data;
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let func1 = extrequire("ST.api001.getToken"); //获取token
    let res = func1.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "保存";
    let state = Data[0].othInRecords[0].hasOwnProperty("source");
    if (state == true) {
      var ArrayMianList = new Array();
      if (Data.length > 0) {
        for (let i = 0; i < Data.length; i++) {
          var bustype = Data[i].bustype;
          var id = Data[i].id;
          var othInRecords = Data[i].othInRecords;
          if (othInRecords.length > 0) {
            var ArraySunList = new Array();
            var WMSmark = "否";
            for (let j = 0; j < othInRecords.length; j++) {
              var Sunsource = othInRecords[j].source;
              console.log(JSON.stringify(Sunsource));
              if (Sunsource == "st_morphologyconversion") {
                var SunsourceId = othInRecords[j].sourceid;
                let func1 = extrequire("ST.api001.getToken");
                let res = func1.execute(require);
                let token = res.access_token;
                let headers = { "Content-Type": "application/json;charset=UTF-8" };
                // 查询形态转换单详情
                let apiResponse1 = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/scm/morphologyconversion/detail?access_token=" + token + "&id=" + SunsourceId, JSON.stringify(headers), null);
                let api1 = JSON.parse(apiResponse1);
                if (api1.code == 200) {
                  var APIData = api1.data;
                  var stateXTZH = APIData.hasOwnProperty("defines");
                  if (stateXTZH == true) {
                    var stateSSD = APIData.defines.hasOwnProperty("define1");
                    if (stateSSD == true) {
                      // 来源是否为WMS
                      WMSmark = APIData.defines.define1;
                    }
                  }
                  var bustypeCode = APIData.businesstypeCode;
                }
              }
              ArraySunList.push({
                stockStatusDoc_name: othInRecords[j].stockStatusDoc_name,
                stockStatusDoc: othInRecords[j].stockStatusDoc,
                id: othInRecords[j].id,
                batchno: othInRecords[j].batchno,
                product_code: othInRecords[j].product_code,
                product: othInRecords[j].product,
                source: othInRecords[j].source,
                subQty: othInRecords[j].subQty,
                productsku: othInRecords[j].productsku,
                stockStatusDoc_name: othInRecords[j].stockStatusDoc_name,
                product_cName: othInRecords[j].product_cName,
                stockUnitId: othInRecords[j].stockUnitId,
                qty: othInRecords[j].qty,
                define3: othInRecords[j].define3
              });
            }
            console.log(JSON.stringify(WMSmark));
            if (WMSmark === "否") {
              ArrayMianList.push({
                id: id,
                org: Data[i].org,
                accountOrg: Data[i].accountOrg,
                bustypeCode: bustypeCode,
                bustype: Data[i].bustype,
                code: Data[i].code,
                warehouse: Data[i].warehouse,
                inventoryType: "待检",
                createTime: Data[i].createTime,
                operator: Data[i].operator,
                remark: Data[i].memo,
                stockMgr: Data[i].stockMgr,
                othInRecords: ArraySunList
              });
              let func1 = extrequire("ST.api001.getToken");
              let res = func1.execute(require);
              let token = res.access_token;
              let headers = { "Content-Type": "application/json;charset=UTF-8" };
              // 单据编码
              let code = ArrayMianList[0].code;
              // 形态转换交易类型名称
              // 仓库id
              let warehouse = ArrayMianList[0].warehouse;
              // 交易类型id
              let bustype = ArrayMianList[0].bustype;
              // 查询交易类型详情
              let bustypeAPI = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/transtype/detail?access_token=" + token + "&id=" + bustype, JSON.stringify(headers), null);
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
                  URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/orgunit/detail?access_token=" + token + "&id=" + accountOrg,
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
                  let stocDeatil = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/staff/detail?access_token=" + token + "&id=" + stockMgrs, JSON.stringify(headers), null);
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
                  let atorDeatil = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/staff/detail?access_token=" + token + "&id=" + operators, JSON.stringify(headers), null);
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
                let OrgResponse = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/orgunit/detail?access_token=" + token + "&id=" + org, JSON.stringify(headers), null);
                let OrgObject = JSON.parse(OrgResponse);
                if (OrgObject.code == "200") {
                  let orgCode = OrgObject.data.code;
                  let Sql = "select code from aa.warehouse.Warehouse where id = '" + warehouse + "'";
                  let warehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
                  var warehouseCode = warehouseRes[0].code;
                  if (othInRecords.length > 0) {
                    let productData = {};
                    let SunData = {};
                    let batchInfo = {};
                    var batchInfoList = new Array();
                    var orderLines = new Array();
                    for (let j = 0; j < othInRecords.length; j++) {
                      var stockStatusDoc = othInRecords[j].stockStatusDoc;
                      var stockSql = "select statusName from st.stockStatusRecord.stockStatusRecord where id = '" + stockStatusDoc + "'";
                      var stockRes = ObjectStore.queryByYonQL(stockSql, "ustock");
                      var stockStatusDoc_name = stockRes[0].statusName;
                      var inventoryType = "";
                      // 质量状态
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
                      let supplier = othInRecords[j].define3;
                      let batchno = othInRecords[j].batchno;
                      var productsku = othInRecords[j].productsku;
                      var skuSql = "select code,name from pc.product.ProductSKU where id = '" + productsku + "'";
                      var skuRes = ObjectStore.queryByYonQL(skuSql, "productcenter");
                      var productsku_cCode = skuRes[0].code;
                      var productsku_cName = skuRes[0].name;
                      var vendor_Code = null;
                      var vendor_Name = null;
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
                        URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/managementclass/newdetail?access_token=" + token + "&id=" + productClass,
                        JSON.stringify(headers),
                        null
                      );
                      let productClassObject = JSON.parse(productClassResponse);
                      if (productClassObject.code == "200") {
                        let productClassCode = productClassObject.data.parentCode;
                        let productClassName = productClassObject.data.parentName;
                        // 计量单位详情查询
                        let UnitSql = "select name from pc.unit.Unit where id = '" + stockUnitId + "'";
                        var UnitRes = ObjectStore.queryByYonQL(UnitSql, "productcenter");
                        if (UnitRes.length > 0) {
                          let stockUnit_name = UnitRes[0].name;
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
                        } else {
                          throw new Error("查询计价单位API失败");
                        }
                      }
                    }
                    let jsonBody = {
                      outBizOrderCode: code,
                      bizOrderType: "INBOUND",
                      XTZHBusType: BusCode,
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
                    var body = {
                      appCode: "beiwei-ys",
                      appApiCode: "standard.other.order.entry.create",
                      schemeCode: "bw47",
                      jsonBody: jsonBody
                    };
                  }
                }
              }
              console.log(JSON.stringify(body));
              let header = { "Content-Type": "application/json;charset=UTF-8" };
              let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
              let str = JSON.parse(strResponse);
              console.log(JSON.stringify(str));
              // 打印日志
              let LogBody = { data: { code: code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType } };
              let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(header), JSON.stringify(LogBody));
              console.log(LogResponse);
              if (str.success != true) {
                if (str.errorCode != "A1000") {
                  throw new Error("调用OMS其他入库创建API失败！" + str.errorMessage);
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