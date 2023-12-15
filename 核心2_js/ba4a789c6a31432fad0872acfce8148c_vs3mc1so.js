let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var priceList = request.priceList;
    var ss = priceList.length;
    var sid = request.sid;
    // 查询销售日报主表数据
    var sql = "select * from GT5646AT1.GT5646AT1.sales_Report where id ='" + sid + "'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    var org_id = result[0].org_id;
    // 查询销售日报子表数据
    var sonSql = "select * from GT5646AT1.GT5646AT1.sales_ReportDetails where sales_Report_id = '" + sid + "'";
    var resultSon = ObjectStore.queryByYonQL(sonSql, "developplatform");
    var Dlist = new Array();
    var List = new Array();
    var resultList = new Array();
    let ContentType = "application/json;charset=UTF-8";
    let header = { "Content-Type": ContentType };
    let uuidStr = uuid();
    let uuids = replace(uuidStr, "-", "");
    let resultJson = result[0];
    // 获取仓库的主键
    var wareHouseId = resultJson.warehouse;
    // 获取主表仓库的主键
    var wareHouseSql = "select * from aa.warehouse.Warehouse where id = '" + wareHouseId + "'";
    var wareHouseResult = ObjectStore.queryByYonQL(wareHouseSql, "productcenter");
    let wareHouseObj = wareHouseResult[0];
    // 获取仓库的编码--->对应生成销售出库的客户编码
    let wareCode = wareHouseObj.code;
    // 客户表
    let custSql = "select * from aa.agent.Agent where code = '" + wareCode + "'";
    let custRes = ObjectStore.queryByYonQL(custSql, "udinghuo");
    if (custRes.length == 0) {
      throw new Error("该仓库在客户档案中查询不到！");
    } else {
      // 客户交易关系
      let AgentRelation = "select * from aa.agent.AgentRelation where agentId ='" + custRes[0].id + "' and orgId = '" + org_id + "'";
      let AgentRelationRes = ObjectStore.queryByYonQL(AgentRelation, "udinghuo");
      if (AgentRelationRes.length != 0) {
        // 税率id
        var taxRateId = AgentRelationRes[0].taxRateId;
        if (taxRateId == "" || taxRateId == null) {
          throw new Error("该客户没有销向税率请添加！");
        } else {
          var taxSql = "select * from bd.taxrate.TaxRateVO where id = '" + taxRateId + "'";
          var taxRes = ObjectStore.queryByYonQL(taxSql, "ucfbasedoc");
          // 税率id
          var taxID = AgentRelationRes[0].taxRateId;
          // 销项税率名称
          var taxName = taxRes[0].ntaxRate;
          var list = {};
          for (var i = 0; i < resultSon.length; i++) {
            var qty = resultSon[i].qty;
            // 销售日报子表物料id
            let productNo = resultSon[i].product;
            // 查询菜品成本卡数据  根据获取到的每一条物料Id去查询菜品成本卡主表
            var cardSql = "select id from GT5646AT1.GT5646AT1.menuMaintenance where menuNo = '" + productNo + "' and org_id = '" + org_id + "'";
            var resultCard = ObjectStore.queryByYonQL(cardSql, "developplatform");
            if (resultCard.length == 0) {
              // 在菜品成本卡中没有查到
              continue;
            } else {
              // 获取菜品成本卡的主表的id
              let productId = resultCard[0].id;
              // 根据主表id去查转换卡子表
              var selectCardSonSql = "select * from GT5646AT1.GT5646AT1.menuListMaintenance where menuMaintenance_id = '" + productId + "'";
              var resultCardSon = ObjectStore.queryByYonQL(selectCardSonSql, "developplatform");
              // 遍历菜品成本卡子表数据
              for (let x = 0; x < resultCardSon.length; x++) {
                let cardJSON = resultCardSon[x];
                // 获取成本卡子表的物料sku
                let productSku = resultCardSon[x].productSku;
                // 获取成本卡子表的物料的id
                let materialScienceNo = resultCardSon[x].materialScienceNo;
                let number = cardJSON.number;
                let numberS = number * qty;
                list = {
                  productID: materialScienceNo,
                  productSku: productSku,
                  number: numberS
                };
                resultList.push(list);
              }
            }
          }
          if (resultList.length == 0) {
            throw new Error("找不到对应的成本卡信息！");
          }
          var Dlist = new Array();
          var detali = "";
          var item = {};
          for (let t = 0; t < resultList.length; t++) {
            let proid = resultList[t].productID;
            let prosku = resultList[t].productSku;
            let pronumber = resultList[t].number;
            let newKey = proid + "" + prosku;
            let index = detali.indexOf(newKey) != -1;
            if (index == false) {
              detali = detali + "," + newKey;
              item = {
                productID: proid,
                productSku: prosku,
                number: pronumber
              };
              Dlist.push(item);
            } else {
              for (let d = 0; d < Dlist.length; d++) {
                let oldKey = Dlist[d].productID + "" + Dlist[d].productSku;
                if (newKey == oldKey) {
                  let oldNumber = Dlist[d].number;
                  let newNumber = pronumber + oldNumber;
                  Dlist[d].number = newNumber;
                }
              }
            }
          }
          var makeBodyObjs = new Array();
          for (let qt = 0; qt < Dlist.length; qt++) {
            var pruId = Dlist[qt].productID; // 物料id
            var allQty = Dlist[qt].number; // 数量
            var sku = Dlist[qt].productSku; // sku
            // 获取计价单位
            let ProductSunData = "select batchPriceUnit from pc.product.ProductDetail where productId = '" + pruId + "' and orgId = '" + org_id + "'";
            let ProductSunDataRes = ObjectStore.queryByYonQL(ProductSunData, "productcenter");
            if (ProductSunDataRes.length == 0) {
              let productData = "select * from pc.product.Product where id = '" + pruId + "'";
              let ProductDataRes = ObjectStore.queryByYonQL(productData, "productcenter");
              // 主计量单位
              let unit = ProductDataRes[0].unit;
              // 获取计价换算率
              let AssistUnitSql = "select mainUnitCount,assistUnitCount from pc.product.ProductAssistUnitExchange where productId ='" + pruId + "'";
              let AssistUnitRes = ObjectStore.queryByYonQL(AssistUnitSql, "productcenter");
              // 计价换算率
              var mainUnitCount = 1;
              if (AssistUnitRes.length != 0) {
                mainUnitCount = AssistUnitRes[0].mainUnitCount;
              }
              let queryPruSqls = "select code,name,unit from pc.product.Product where id='" + pruId + "'"; //查询主计量单位和默认sku
              let pruResS = ObjectStore.queryByYonQL(queryPruSqls, "productcenter");
              if (pruResS.length == 0) {
                throw new Error("物料档案未找到！");
              }
              let proCode = pruResS[0].code;
              let unitId = pruResS[0].unit;
              var price = 0;
              if (proCode == "ZM0101010008") {
                let ProductSunData = "select fMarkPrice from pc.product.ProductDetail where productId = '" + pruId + "'";
                let ProductSunDataRes = ObjectStore.queryByYonQL(ProductSunData, "productcenter");
                price = ProductSunDataRes[0].fMarkPrice; // 建议零售价
              } else {
                for (let p = 0; p < priceList.length; p++) {
                  // 物料编码
                  let productId_code = priceList[p].productId_code;
                  // 计价单位
                  var amountUnit = priceList[p].amountUnit;
                  // 组织
                  var orgScopeId = priceList[p].orgScopeId;
                  if (batchPriceUnit == amountUnit && orgScopeId == org_id && productId_code == proCode) {
                    price = priceList[p].recordGradients_price;
                    break;
                  }
                }
              }
              // 无税单价
              let taxlessMoney = price / (1 + taxName / 100);
              // 四舍五入小数
              let Money = Math.round(taxlessMoney * 10000) / 10000;
              let queryPruDetalSql = "select isBatchManage from pc.product.ProductDetail where productId='" + pruId + "'"; //查询是否批次号管理
              let pruDetailRes = ObjectStore.queryByYonQL(queryPruDetalSql, "productcenter");
              // 非批次号
              if (pruDetailRes[0].isBatchManage != true) {
                let NBS = allQty / mainUnitCount;
                let count = Math.round(NBS * 10000) / 10000;
                // 含税金额
                let recordGradients_price_aounmt = price * allQty;
                let recordGradients_price_aounmt_count = Math.round(recordGradients_price_aounmt * 100) / 100;
                // 无税金额
                let NorecordGradients_price_aounmt = Money * allQty;
                let NorecordGradients_price_aounmt_count = Math.round(NorecordGradients_price_aounmt * 100) / 100;
                let zbdata = {
                  product: pruId,
                  productsku: sku,
                  unit: unitId,
                  stockUnitId: unitId,
                  invExchRate: "1",
                  qty: allQty,
                  priceQty: count,
                  subQty: count,
                  // 含税金额
                  oriSum: recordGradients_price_aounmt_count,
                  // 含税单价
                  oriTaxUnitPrice: price,
                  // 无税单价
                  oriUnitPrice: Money,
                  // 无税金额
                  oriMoney: NorecordGradients_price_aounmt_count,
                  // 计价单位[取主计量单位]id或编码
                  priceUOM: unit,
                  // 计价换算率
                  invPriceExchRate: mainUnitCount,
                  // 价格含税, true:是、false:否
                  taxUnitPriceTag: true,
                  // 库存单位转换率的换算方式 0：固定 1：浮动
                  unitExchangeType: "0",
                  // 库存单位id或编码
                  stockUnit: unitId,
                  // 税目id或编码
                  taxId: taxID,
                  // 税率
                  taxRate: taxName,
                  // 来源单据类型
                  source: "0",
                  _status: "Insert"
                };
                makeBodyObjs.push(zbdata);
              } else {
                let sendDataObj = request.sendDataObj;
                //依据组织、仓库、物料、SKU查询对应现存量
                let queryCurrentSql =
                  "select * from stock.currentstock.CurrentStock where product='" +
                  pruId +
                  "' and productsku='" +
                  sku +
                  "' and org='" +
                  sendDataObj.org_id +
                  "' and warehouse='" +
                  sendDataObj.warehouse +
                  "' order by pubts";
                let currentRes = ObjectStore.queryByYonQL(queryCurrentSql, "ustock");
                if (currentRes.length == 0) {
                  throw new Error("物料【" + pruResS[0].name + "】在【" + sendDataObj.warehouse_name + "】仓库未找到现存量！");
                }
                for (var i = 0; i < currentRes.length; i++) {
                  let newQty = currentRes[i].currentqty; //现存量
                  let batchnoValue = currentRes[i].batchno;
                  let queryBatchSql = "select producedate,invaliddate from st.batchno.Batchno where product='" + pruId + "' and productsku='" + sku + "' order by pubts";
                  let batchRes = ObjectStore.queryByYonQL(queryBatchSql, "yonbip-scm-scmbd");
                  if (batchRes.length == 0) {
                    throw new Error(JSON.stringify("物料id为：" + pruId + "的物料未查询到生产日期和有效期信息"));
                  } else {
                    let sendQty = 0;
                    if (newQty <= allQty) {
                      sendQty = newQty;
                      allQty = allQty - newQty;
                    } else {
                      sendQty = allQty;
                      allQty = 0;
                    }
                    let PCS = sendQty / mainUnitCount;
                    let counts = Math.round(PCS * 10000) / 10000;
                    // 含税金额
                    let recordGradients_price = price * sendQty;
                    let recordGradients_price_count = Math.round(recordGradients_price * 100) / 100;
                    // 无税金额
                    let NorecordGradients_price = Money * sendQty;
                    let NorecordGradients_price_count = Math.round(NorecordGradients_price * 100) / 100;
                    let senddata = {
                      // 来源单据类型
                      source: "0",
                      product: pruId,
                      productsku: sku,
                      unit: unitId,
                      stockUnitId: unitId,
                      invExchRate: "1",
                      qty: sendQty, //数量
                      priceQty: counts,
                      subQty: counts,
                      batchno: batchnoValue, //批次号
                      isBatchManage: "true", //是否批次管理
                      producedate: batchRes[0].producedate, //生产日期
                      invaliddate: batchRes[0].invaliddate, //有效期至
                      // 含税金额
                      oriSum: recordGradients_price_count,
                      // 含税单价
                      oriTaxUnitPrice: price,
                      // 无税单价
                      oriUnitPrice: Money,
                      // 无税金额
                      oriMoney: NorecordGradients_price_count,
                      // 计价单位[取主计量单位]id或编码
                      priceUOM: unit,
                      // 计价换算率
                      invPriceExchRate: mainUnitCount,
                      // 价格含税, true:是、false:否
                      taxUnitPriceTag: true,
                      // 库存单位转换率的换算方式 0：固定 1：浮动
                      unitExchangeType: "0",
                      // 库存单位id或编码
                      stockUnit: unitId,
                      // 税目id或编码
                      taxId: taxID,
                      // 税率
                      taxRate: taxName,
                      // 操作标识, Insert:新增、Update:更新
                      _status: "Insert"
                    };
                    makeBodyObjs.push(senddata);
                    if (allQty == 0) {
                      break;
                    }
                  }
                  if (allQty > 0) {
                    throw new Error("物料【" + pruResS[0].name + "】在【" + sendDataObj.warehouse_name + "】仓库中现存量不足，缺少" + allQty);
                  }
                }
              }
            } else {
              // 计价单位
              let batchPriceUnit = ProductSunDataRes[0].batchPriceUnit;
              // 获取计价换算率
              let AssistUnitSql = "select mainUnitCount,assistUnitCount from pc.product.ProductAssistUnitExchange where productId ='" + pruId + "'";
              let AssistUnitRes = ObjectStore.queryByYonQL(AssistUnitSql, "productcenter");
              // 计价换算率
              var mainUnitCount = 1;
              if (AssistUnitRes.length != 0) {
                mainUnitCount = AssistUnitRes[0].assistUnitCount;
              }
              let queryPruSqls = "select code,name,unit from pc.product.Product where id='" + pruId + "'"; //查询主计量单位和默认sku
              let pruResS = ObjectStore.queryByYonQL(queryPruSqls, "productcenter");
              if (pruResS.length == 0) {
                throw new Error("物料档案未找到！");
              }
              let proCode = pruResS[0].code;
              let unitId = pruResS[0].unit;
              var price = 0;
              if (proCode == "ZM0101010008") {
                let ProductSunData = "select fMarkPrice from pc.product.ProductDetail where productId = '" + pruId + "'";
                let ProductSunDataRes = ObjectStore.queryByYonQL(ProductSunData, "productcenter");
                price = ProductSunDataRes[0].fMarkPrice; // 建议零售价
              } else {
                for (let p = 0; p < priceList.length; p++) {
                  // 物料编码
                  let productId_code = priceList[p].productId_code;
                  // 计价单位
                  var amountUnit = priceList[p].amountUnit;
                  // 组织
                  var orgScopeId = priceList[p].orgScopeId;
                  if (batchPriceUnit == amountUnit && orgScopeId == org_id && productId_code == proCode) {
                    price = priceList[p].recordGradients_price;
                    break;
                  }
                }
              }
              // 无税单价
              let taxlessMoney = price / (1 + taxName / 100);
              // 四舍五入小数
              let Money = Math.round(taxlessMoney * 10000) / 10000;
              let queryPruDetalSql = "select isBatchManage from pc.product.ProductDetail where productId='" + pruId + "'"; //查询是否批次号管理
              let pruDetailRes = ObjectStore.queryByYonQL(queryPruDetalSql, "productcenter");
              // 非批次号
              if (pruDetailRes[0].isBatchManage != true) {
                let NBS = allQty / mainUnitCount;
                let count = Math.round(NBS * 10000) / 10000;
                // 含税金额
                let recordGradients_price_aounmt = price * allQty;
                let recordGradients_price_aounmt_count = Math.round(recordGradients_price_aounmt * 100) / 100;
                // 无税金额
                let NorecordGradients_price_aounmt = Money * allQty;
                let NorecordGradients_price_aounmt_count = Math.round(NorecordGradients_price_aounmt * 100) / 100;
                let zbdata = {
                  product: pruId,
                  productsku: sku,
                  unit: unitId,
                  stockUnitId: unitId,
                  invExchRate: "1",
                  qty: allQty,
                  priceQty: count,
                  subQty: count,
                  // 含税金额
                  oriSum: recordGradients_price_aounmt_count,
                  // 含税单价
                  oriTaxUnitPrice: price,
                  // 无税单价
                  oriUnitPrice: Money,
                  // 无税金额
                  oriMoney: NorecordGradients_price_aounmt_count,
                  // 计价单位[取主计量单位]id或编码
                  priceUOM: batchPriceUnit,
                  // 计价换算率
                  invPriceExchRate: mainUnitCount,
                  // 价格含税, true:是、false:否
                  taxUnitPriceTag: true,
                  // 库存单位转换率的换算方式 0：固定 1：浮动
                  unitExchangeType: "0",
                  // 库存单位id或编码
                  stockUnit: unitId,
                  // 税目id或编码
                  taxId: taxID,
                  // 税率
                  taxRate: taxName,
                  // 来源单据类型
                  source: "0",
                  _status: "Insert"
                };
                makeBodyObjs.push(zbdata);
              } else {
                let sendDataObj = request.sendDataObj;
                //依据组织、仓库、物料、SKU查询对应现存量
                let queryCurrentSql =
                  "select * from stock.currentstock.CurrentStock where product='" +
                  pruId +
                  "' and productsku='" +
                  sku +
                  "' and org='" +
                  sendDataObj.org_id +
                  "' and warehouse='" +
                  sendDataObj.warehouse +
                  "' order by pubts";
                let currentRes = ObjectStore.queryByYonQL(queryCurrentSql, "ustock");
                if (currentRes.length == 0) {
                  throw new Error("物料【" + pruResS[0].name + "】在【" + sendDataObj.warehouse_name + "】仓库未找到现存量！");
                }
                for (var i = 0; i < currentRes.length; i++) {
                  let newQty = currentRes[i].currentqty; //现存量
                  let batchnoValue = currentRes[i].batchno;
                  let queryBatchSql = "select producedate,invaliddate from st.batchno.Batchno where product='" + pruId + "' and productsku='" + sku + "' order by pubts";
                  let batchRes = ObjectStore.queryByYonQL(queryBatchSql, "yonbip-scm-scmbd");
                  if (batchRes.length == 0) {
                    throw new Error(JSON.stringify("物料id为：" + pruId + "的物料未查询到生产日期和有效期信息"));
                  } else {
                    let sendQty = 0;
                    if (newQty <= allQty) {
                      sendQty = newQty;
                      allQty = allQty - newQty;
                    } else {
                      sendQty = allQty;
                      allQty = 0;
                    }
                    let PCS = sendQty / mainUnitCount;
                    let counts = Math.round(PCS * 10000) / 10000;
                    // 含税金额
                    let recordGradients_price = price * sendQty;
                    let recordGradients_price_count = Math.round(recordGradients_price * 100) / 100;
                    // 无税金额
                    let NorecordGradients_price = Money * sendQty;
                    let NorecordGradients_price_count = Math.round(NorecordGradients_price * 100) / 100;
                    let senddata = {
                      // 来源单据类型
                      source: "0",
                      product: pruId,
                      productsku: sku,
                      unit: unitId,
                      stockUnitId: unitId,
                      invExchRate: "1",
                      qty: sendQty, //数量
                      priceQty: counts,
                      subQty: counts,
                      batchno: batchnoValue, //批次号
                      isBatchManage: "true", //是否批次管理
                      producedate: batchRes[0].producedate, //生产日期
                      invaliddate: batchRes[0].invaliddate, //有效期至
                      // 含税金额
                      oriSum: recordGradients_price_count,
                      // 含税单价
                      oriTaxUnitPrice: price,
                      // 无税单价
                      oriUnitPrice: Money,
                      // 无税金额
                      oriMoney: NorecordGradients_price_count,
                      // 计价单位[取主计量单位]id或编码
                      priceUOM: batchPriceUnit,
                      // 计价换算率
                      invPriceExchRate: mainUnitCount,
                      // 价格含税, true:是、false:否
                      taxUnitPriceTag: true,
                      // 库存单位转换率的换算方式 0：固定 1：浮动
                      unitExchangeType: "0",
                      // 库存单位id或编码
                      stockUnit: unitId,
                      // 税目id或编码
                      taxId: taxID,
                      // 税率
                      taxRate: taxName,
                      // 操作标识, Insert:新增、Update:更新
                      _status: "Insert"
                    };
                    makeBodyObjs.push(senddata);
                    if (allQty == 0) {
                      break;
                    }
                  }
                  if (allQty > 0) {
                    throw new Error("物料【" + pruResS[0].name + "】在【" + sendDataObj.warehouse_name + "】仓库中现存量不足，缺少" + allQty);
                  }
                }
              }
            }
          }
          if (makeBodyObjs.length == 0) {
            throw new Error("未在菜品成本卡找到对应物料！");
          } else {
            let requestBody = {
              resubmitCheckKey: uuids,
              // 立账开票依据销售出库单
              receiveAccountingBasis: "st_salesout",
              // 出库立账方式
              salesoutAccountingMethod: "invoiceConfirm",
              // 会计主体id或编码
              accountOrg: resultJson.org_id,
              // 销售组织id或编码
              salesOrg: resultJson.org_id,
              // 主组织id
              org: resultJson.org_id,
              // 开票组织id或编码
              invoiceOrg: resultJson.org_id,
              // 单据日期
              vouchdate: resultJson.vouchdate,
              // 交易类型id或编码 【A30004POS销售数据】
              bustype: "A30002",
              // 仓库id或编码
              warehouse: resultJson.warehouse,
              // 客户id或编码
              cust: wareCode,
              // 来源类型
              srcBillType: "0",
              // 本币id或编码
              natCurrency: resultJson.currency,
              //币种id或编码
              currency: resultJson.currency,
              // 子表数据
              details: makeBodyObjs,
              // 操作标识, Insert:新增、Update:更新
              _status: "Insert",
              headDefine: {
                define50: resultJson.code
              }
            };
            let body = { data: requestBody };
            let func1 = extrequire("GT5646AT1.apifunction.getToken");
            let res = func1.execute(null, null);
            let access_token = res.access_token;
            let url = "https://www.example.com/" + access_token;
            let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
            var resultStr = JSON.parse(apiResponse);
            if (resultStr.code == "200") {
              // 销售出库保存成功之后更新下推状态为'是'
              var object = { id: sid, pushDown: "true" };
              var res1 = ObjectStore.updateById("GT5646AT1.GT5646AT1.sales_Report", object, "12015f78");
            } else {
              throw new Error("销售日报下推销售出库失败：" + resultStr.message);
            }
            // 销售出库主
            let marketData = "select id from st.salesout.SalesOut where vouchdate= '" + resultJson.vouchdate + "'";
            let marketRes = ObjectStore.queryByYonQL(marketData, "ustock");
            var auditID = marketRes[0].id;
            let auditData = {
              id: auditID
            };
            let auditbody = { data: [auditData] };
            let auditurl = "https://www.example.com/" + access_token;
            let apiaudiResponse = postman("POST", auditurl, JSON.stringify(header), JSON.stringify(auditbody));
            var resultauditStr = JSON.parse(apiaudiResponse);
          }
        }
      } else {
        throw new Error(JSON.stringify("该组织下未查询到客户交易关系，请查看！"));
      }
    }
    return { resultStr };
  }
}
exports({ entryPoint: MyAPIHandler });