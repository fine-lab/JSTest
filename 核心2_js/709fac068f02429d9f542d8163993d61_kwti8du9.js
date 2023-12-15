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
    let state = Data[0].othOutRecords[0].hasOwnProperty("source");
    if (state == true) {
      var ArrayMianList = new Array();
      if (Data.length > 0) {
        for (let i = 0; i < Data.length; i++) {
          var bustype = Data[i].bustype;
          var id = Data[i].id;
          var define5 = Data[i]["headItem!define5"];
          var othOutRecords = Data[i].othOutRecords;
          if (othOutRecords.length > 0) {
            var ArraySunList = new Array();
            var WMSmark = "否";
            for (let j = 0; j < othOutRecords.length; j++) {
              var Sunsource = othOutRecords[j].source;
              if (Sunsource == "st_morphologyconversion") {
                var SunsourceId = othOutRecords[j].sourceid;
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
                      // 来源是否为OMS
                      WMSmark = APIData.defines.define1;
                    }
                  }
                  var bustypeCode = APIData.businesstypeCode;
                }
              }
              ArraySunList.push({
                stockStatusDoc_name: othOutRecords[j].stockStatusDoc_name,
                stockStatusDoc: othOutRecords[j].stockStatusDoc,
                id: othOutRecords[j].id,
                batchno: othOutRecords[j].batchno,
                product_code: othOutRecords[j].product_code,
                product: othOutRecords[j].product,
                source: othOutRecords[j].source,
                subQty: othOutRecords[j].subQty,
                productsku: othOutRecords[j].productsku,
                product_cName: othOutRecords[j].product_cName,
                stockUnitId: othOutRecords[j].stockUnitId,
                qty: othOutRecords[j].qty,
                define3: othOutRecords[j].define3
              });
            }
            if (WMSmark != "是") {
              ArrayMianList.push({
                id: id,
                org: Data[i].org,
                accountOrg: Data[i].accountOrg,
                bustype: Data[i].bustype,
                code: Data[i].code,
                warehouse: Data[i].warehouse,
                bustypeCode: bustypeCode,
                inventoryType: "FX",
                operator: Data[i].operator,
                stockMgr: Data[i].stockMgr,
                remark: Data[i].memo,
                createTime: Data[i].createTime,
                othOutRecords: ArraySunList
              });
              let func1 = extrequire("ST.api001.getToken");
              let res = func1.execute(require);
              let token = res.access_token;
              let headers = { "Content-Type": "application/json;charset=UTF-8" };
              // 单据编码
              let code = ArrayMianList[0].code;
              // 仓库id
              let warehouse = ArrayMianList[0].warehouse;
              // 形态转换交易类型名称
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
                  let stocDeatil = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/staff/detail?access_token=" + token + "&id=" + stockMgr, JSON.stringify(headers), null);
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
                  let atorDeatil = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/staff/detail?access_token=" + token + "&id=" + operator, JSON.stringify(headers), null);
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
                let OrgResponse = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/orgunit/detail?access_token=" + token + "&id=" + org, JSON.stringify(headers), null);
                let OrgObject = JSON.parse(OrgResponse);
                if (OrgObject.code == "200") {
                  let orgCode = OrgObject.data.code;
                  let Sql = "select code from aa.warehouse.Warehouse where id = '" + warehouse + "'";
                  let warehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
                  var warehouseCode = warehouseRes[0].code;
                  if (othOutRecords.length > 0) {
                    let productData = {};
                    let SunData = {};
                    let batch_Info = {};
                    var batchInfo_List = new Array();
                    var orderList = new Array();
                    for (let j = 0; j < othOutRecords.length; j++) {
                      var stockStatusDoc = othOutRecords[j].stockStatusDoc;
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
                      let supplier = othOutRecords[j].define3;
                      var productsku = othOutRecords[j].productsku;
                      var skuSql = "select code,name from pc.product.ProductSKU where id = '" + productsku + "'";
                      var skuRes = ObjectStore.queryByYonQL(skuSql, "productcenter");
                      var productsku_cCode = skuRes[0].code;
                      var productsku_cName = skuRes[0].name;
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
                        URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/managementclass/newdetail?access_token=" + token + "&id=" + manageClass,
                        JSON.stringify(headers),
                        null
                      );
                      let productClassObject = JSON.parse(productClassResponse);
                      if (productClassObject.code == "200") {
                        let productClassCode = productClassObject.data.parentCode;
                        let productClassName = productClassObject.data.parentName;
                        let stockUnitId = othOutRecords[j].stockUnitId;
                        // 计量单位详情查询
                        let UnitSql = "select name from pc.unit.Unit where id = '" + stockUnitId + "'";
                        var UnitRes = ObjectStore.queryByYonQL(UnitSql, "productcenter");
                        if (UnitRes.length > 0) {
                          let stockUnit_name = UnitRes[0].name;
                          batch_Info = {
                            batchCode: batchNo,
                            inventoryType: inventoryType
                          };
                          batchInfo_List.push(batch_Info);
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
                            inventoryType: inventoryType,
                            batchInfos: batchInfo_List,
                            itemInfo: productData
                          };
                          orderList.push(SunData);
                        } else {
                          throw new Error("查询计价单位API失败");
                        }
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
                    var body = {
                      appCode: "beiwei-ys",
                      appApiCode: "standard.other.order.out.create",
                      schemeCode: "bw47",
                      jsonBody: jsonBody
                    };
                  }
                }
              }
              console.log(JSON.stringify(body));
              let header = { "Content-Type": "application/json;charset=UTF-8" };
              let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
              console.log(strResponse);
              let str = JSON.parse(strResponse);
              // 打印日志
              let LogBody = { data: { code: code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType } };
              let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(header), JSON.stringify(LogBody));
              console.log(LogResponse);
              if (str.success != true) {
                if (str.errorCode != "A1000") {
                  throw new Error("调用OMS其他出库确认创建API失败，失败原因：" + str.errorMessage);
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