let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data[0];
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    console.log("status===" + param._status + "code：" + Data.code);
    var status = param._status;
    if (status == "Insert") {
      // 上游单据编码
      var srcBillNO = Data.srcBillNO;
      var id = Data.id;
      let func1 = extrequire("ST.api001.getToken");
      let res = func1.execute(require);
      let token = res.access_token;
      let GetTime = extrequire("GT101792AT1.common.LastGetTime");
      let GetTimeReturn = GetTime.execute(null, null);
      let operateType = "保存";
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
      let bustypeSQL = "select code from bd.bill.TransType where id = '" + bustype + "'";
      var bustypeRes = ObjectStore.queryByYonQL(bustypeSQL, "transtype");
      if (bustypeRes.length > 0) {
        let BusCode = bustypeRes[0].code;
        // 入库组织单元详情查询
        let InOrgSQL = "select code from org.func.BaseOrg where id = '" + inorg + "'";
        var InOrgRes = ObjectStore.queryByYonQL(InOrgSQL, "ucf-org-center");
        if (InOrgRes.length > 0) {
          let inorgCode = InOrgRes[0].code;
          let Sql = "select code from aa.warehouse.Warehouse where id = '" + inwarehouse + "'";
          let inwarehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
          if (inwarehouseRes.length > 0) {
            var inwarehouseCode = inwarehouseRes[0].code;
            // 出库组织单元详情查询
            let OutOrgSQL = "select code from org.func.BaseOrg where id = '" + outorg + "'";
            var OutOrgRes = ObjectStore.queryByYonQL(OutOrgSQL, "ucf-org-center");
            if (OutOrgRes.length > 0) {
              let outorgCode = OutOrgRes[0].code;
              let wareSql = "select code from aa.warehouse.Warehouse where id = '" + outwarehouse + "'";
              let outwarehouseRes = ObjectStore.queryByYonQL(wareSql, "productcenter");
              if (outwarehouseRes.length > 0) {
                var outwarehouseCode = outwarehouseRes[0].code;
                if (details.length > 0) {
                  let productData = {};
                  let SunData = {};
                  var orderLines = new Array();
                  for (let j = 0; j < details.length; j++) {
                    let batchInfo = {};
                    var batchInfoList = new Array();
                    var productsku = details[j].productsku;
                    var skuSql = "select code,name from pc.product.ProductSKU where id = '" + productsku + "'";
                    var skuRes = ObjectStore.queryByYonQL(skuSql, "productcenter");
                    if (skuRes.length > 0) {
                      var productsku_cCode = skuRes[0].code;
                      var productsku_cName = skuRes[0].name;
                      let productMessage = details[j].product;
                      // 库存状态
                      var stockStatusDoc = details[j].stockStatusDoc;
                      var stockSql = "select statusName from st.stockStatusRecord.stockStatusRecord where id = '" + stockStatusDoc + "'";
                      var stockRes = ObjectStore.queryByYonQL(stockSql, "ustock");
                      if (stockRes.length > 0) {
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
                        }
                        let SunId = details[j].id;
                        // 源头单据号
                        var firstupcode = details[j].firstupcode;
                        let qty = details[j].qty;
                        let subQty = details[j].subQty;
                        // 库存单位名称
                        var stockUnit_name = details[j].stockUnit_name;
                        let productDeatliSql = "select manageClass,name,code from pc.product.Product where id = '" + productMessage + "'";
                        let productDeatliRes = ObjectStore.queryByYonQL(productDeatliSql, "productcenter");
                        if (productDeatliRes.length > 0) {
                          let manageClass = productDeatliRes[0].manageClass;
                          // 物料分类详情查询
                          let productClassResponse = postman(
                            "get",
                            URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/managementclass/newdetail?access_token=" + token + "&id=" + manageClass,
                            JSON.stringify(headers),
                            null
                          );
                          let productClassObject = JSON.parse(productClassResponse);
                          if (productClassObject.code == "200") {
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
                          } else {
                            throw new Error("物料分类档案查询失败！");
                          }
                        } else {
                          throw new Error("物料档案查询失败！");
                        }
                      } else {
                        throw new Error("库存状态未查到！");
                      }
                    } else {
                      throw new Error("物料SKU未维护，请维护！");
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
                  console.log(JSON.stringify(body));
                  let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
                  console.log(strResponse);
                  let str = JSON.parse(strResponse);
                  // 打印日志
                  let LogBody = {
                    data: { code: code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
                  };
                  let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(headers), JSON.stringify(LogBody));
                  console.log(LogResponse);
                  if (str.success != true && str.errorCode != null) {
                    throw new Error("下推OMS调入单创建API失败！" + str.errorMessage);
                  }
                } else {
                  throw new Error("调入单表体明细为空！");
                }
              } else {
                throw new Error("未查询到出库仓库信息！");
              }
            } else {
              throw new Error("未查询到出库组织信息！");
            }
          } else {
            throw new Error("未查询到入库仓库信息！");
          }
        } else {
          throw new Error("未查询到入库组织信息！");
        }
      } else {
        throw new Error("未查询到交易类型！");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });