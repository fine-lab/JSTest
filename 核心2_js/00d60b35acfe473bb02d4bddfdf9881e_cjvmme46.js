let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func = extrequire("AT164D981209380003.rule.gatewayUrl");
    let resGatewayUrl = func.execute(null);
    let gatewayUrl = resGatewayUrl.gatewayUrl;
    // 销售退货的数据
    let SaleReturnTable = request.SaleReturnTable;
    // 退货单号
    let code = request.SaleReturnCode;
    let id = request.id;
    // 保存子表信息 质量信息
    let sonArrayQualityData = new Array();
    // 非质量信息
    let sonArrayNotQualityData = new Array();
    // 保存销售退货单保存的参数数组
    let dataListArray = new Array();
    let dateList = {};
    let dateList1 = {};
    // 查询回签单中的数据
    let SignBackSql =
      "select id,code,returngoodsCode,b.componentqty,b.id as sonid,b.signBack_id,b.receivedquantity,b.qualityproblemqty,b.overwarrantyquantity,b.notqualityproblemqty,b.material,b.responsibilitiesQty,b.scrappedQty,b.scrappedQty,b.responsibilityQty from AT164D981209380003.AT164D981209380003.signBack left join AT164D981209380003.AT164D981209380003.signBackSubtable as b on id=b.signBack_id where id='" +
      id +
      "' and b.isMateSaleReturn='1'";
    let SignBackRes = ObjectStore.queryByYonQL(SignBackSql);
    // 将回签单中的数据进行拆分  质量问题、非质量问题
    if (SignBackRes.length > 0) {
      for (let i = 0; i < SignBackRes.length; i++) {
        let b_responsibilitiesQty = 0;
        let b_componentqty = 0;
        if (SignBackRes[i].b_responsibilitiesQty != undefined) {
          b_responsibilitiesQty = SignBackRes[i].b_responsibilitiesQty;
        }
        if (SignBackRes[i].b_componentqty != undefined) {
          b_componentqty = SignBackRes[i].b_componentqty;
        }
        let problemQty = SignBackRes[i].b_responsibilitiesQty + SignBackRes[i].b_componentqty;
        let b_responsibilityQty = 0;
        let b_overwarrantyquantity = 0;
        let b_scrappedQty = 0;
        if (SignBackRes[i].b_responsibilityQty != undefined) {
          b_responsibilityQty = SignBackRes[i].b_responsibilityQty;
        }
        if (SignBackRes[i].b_overwarrantyquantity != undefined) {
          b_overwarrantyquantity = SignBackRes[i].b_overwarrantyquantity;
        }
        if (SignBackRes[i].b_scrappedQty != undefined) {
          b_scrappedQty = SignBackRes[i].b_scrappedQty;
        }
        let scrappedQty = b_responsibilityQty + b_overwarrantyquantity - b_scrappedQty;
        for (let j = 0; j < SaleReturnTable[0].saleReturnDetails.length; j++) {
          if (SignBackRes[i].b_material === SaleReturnTable[0].saleReturnDetails[j].productId) {
            // 查询计价单位
            let iProductUnit = "select name from pc.unit.Unit where id = '" + SaleReturnTable[0].saleReturnDetails[j].iProductUnitId + "'";
            let iProductUnitRes = ObjectStore.queryByYonQL(iProductUnit, "productcenter");
            // 查询销售单位名称
            let iProductAuxUnitId = "select name from pc.unit.Unit where id = '" + SaleReturnTable[0].saleReturnDetails[j].iProductAuxUnitId + "'";
            let iProductAuxUnitIdRes = ObjectStore.queryByYonQL(iProductAuxUnitId, "productcenter");
            // 查询主计量单位
            let masterUnitId = "select name from pc.unit.Unit where id = '" + SaleReturnTable[0].saleReturnDetails[j].iProductAuxUnitId + "'";
            let masterUnitIdRes = ObjectStore.queryByYonQL(masterUnitId, "productcenter");
            if (problemQty > 0) {
              let uuids = uuid();
              let getuuids = replace(uuids, "-", "");
              // 子表信息
              let SonDate = {
                // 物料ID
                newOrderSupplyAgain: "true",
                productId: SaleReturnTable[0].saleReturnDetails[j].productId,
                salesOutId: SaleReturnTable[0].saleReturnDetails[j].salesOutId,
                // 仓库
                stockId: SaleReturnTable[0].saleReturnDetails[j].stockId,
                // 浮动换算率(销售)
                unitExchangeType: 0,
                // 浮动换算率(计价)
                unitExchangeTypePrice: 0,
                // 税目税率
                taxId: "yourIdHere",
                // 库存组织
                stockOrgId: SaleReturnTable[0].saleReturnDetails[j].stockOrgId,
                // 名称
                productAuxUnitName: iProductAuxUnitIdRes[0].name,
                productUnitName: iProductUnitRes[0].name,
                qtyName: masterUnitIdRes[0].name,
                // 销售单位
                iProductAuxUnitId: SaleReturnTable[0].saleReturnDetails[j].iProductAuxUnitId,
                // 计价单位
                iProductUnitId: SaleReturnTable[0].saleReturnDetails[j].iProductUnitId,
                // 主计量单位
                masterUnitId: SaleReturnTable[0].saleReturnDetails[j].masterUnitId,
                // 销售换算率
                invExchRate: SaleReturnTable[0].saleReturnDetails[j].invExchRate,
                // 退货销售数量
                subQty: problemQty,
                // 计价换算率
                invPriceExchRate: SaleReturnTable[0].saleReturnDetails[j].invPriceExchRate,
                // 退货计价数量
                priceQty: problemQty,
                // 退货数量
                qty: problemQty,
                // 含税成交价
                oriTaxUnitPrice: 0,
                // 无税单价
                oriUnitPrice: 0,
                // 含税金额
                oriSum: 0,
                // 无税金额
                oriMoney: 0,
                // 税额
                oriTax: 0,
                // 本币含税单价
                natTaxUnitPrice: 0,
                // 本币无税单价
                natUnitPrice: 0,
                // 本币含税金额
                natSum: 0,
                // 本币无税金额
                natMoney: 0,
                // 本币税额
                natTax: 0,
                // 状态
                _status: "Insert"
              };
              sonArrayQualityData.push(SonDate);
              dateList = {
                data: {
                  resubmitCheckKey: getuuids,
                  // 销售组织
                  salesOrgId: "yourIdHere",
                  // 交易类型
                  transactionTypeId: "yourIdHere",
                  // 客户ID
                  agentId: SaleReturnTable[0].agentId,
                  // 单据日期
                  vouchdate: getDate(),
                  // 开票组织
                  settlementOrgId: SaleReturnTable[0].settlementOrgId,
                  // 币种
                  currency: "1592378409536192540",
                  // 汇率类型
                  exchangeRateType: SaleReturnTable[0].exchangeRateType,
                  // 币种
                  natCurrency: "1592378409536192540",
                  // 汇率
                  exchRate: SaleReturnTable[0].exchRate,
                  // 单价含税
                  taxInclusive: true,
                  // 退货类型
                  saleReturnSourceType: "NONE",
                  // 开票客户
                  invoiceAgentId: SaleReturnTable[0].invoiceAgentId,
                  payMoney: 0,
                  // 回签单号
                  salereturnDefineCharacter: {
                    headDefine8: SignBackRes[i].code,
                    headDefine7: code,
                    headDefine5: SaleReturnTable[0].saleReturnDetails[j].salesOutCode,
                    attrext5: "false"
                  },
                  // 状态
                  _status: "Insert",
                  // 退货地址
                  deliveryAddress: SaleReturnTable[0].deliveryAddress,
                  //收货人移动电话
                  receiveMobile: SaleReturnTable[0].receiveMobile,
                  //	收货人
                  receiver: SaleReturnTable[0].receiver,
                  // 退货原因
                  saleReturnReason: "质量问题换货",
                  saleReturnDetails: sonArrayQualityData
                }
              };
            }
            if (scrappedQty > 0) {
              let uuids = uuid();
              let getuuids = replace(uuids, "-", "");
              // 子表信息
              let SonDate1 = {
                // 仓库
                stockId: SaleReturnTable[0].saleReturnDetails[j].stockId,
                // 物料ID
                productId: SaleReturnTable[0].saleReturnDetails[j].productId,
                salesOutId: SaleReturnTable[0].saleReturnDetails[j].salesOutId,
                newOrderSupplyAgain: true,
                // 浮动换算率(销售)
                unitExchangeType: 0,
                // 浮动换算率(计价)
                unitExchangeTypePrice: 0,
                // 税目税率
                taxId: "yourIdHere",
                // 库存组织
                stockOrgId: SaleReturnTable[0].saleReturnDetails[j].stockOrgId,
                // 销售单位
                iProductAuxUnitId: SaleReturnTable[0].saleReturnDetails[j].iProductAuxUnitId,
                // 计价单位
                iProductUnitId: SaleReturnTable[0].saleReturnDetails[j].iProductUnitId,
                // 主计量单位
                masterUnitId: SaleReturnTable[0].saleReturnDetails[j].masterUnitId,
                // 名称
                productAuxUnitName: iProductAuxUnitIdRes[0].name,
                productUnitName: iProductUnitRes[0].name,
                qtyName: masterUnitIdRes[0].name,
                // 销售换算率
                invExchRate: SaleReturnTable[0].saleReturnDetails[j].invExchRate,
                // 退货销售数量
                subQty: scrappedQty,
                // 计价换算率
                invPriceExchRate: SaleReturnTable[0].saleReturnDetails[j].invPriceExchRate,
                // 退货计价数量
                priceQty: scrappedQty,
                // 退货数量
                qty: scrappedQty,
                // 含税成交价
                oriTaxUnitPrice: 0,
                // 无税单价
                oriUnitPrice: 0,
                // 含税金额
                oriSum: 0,
                // 无税金额
                oriMoney: 0,
                // 税额
                oriTax: 0,
                // 本币含税单价
                natTaxUnitPrice: 0,
                // 本币无税单价
                natUnitPrice: 0,
                // 本币含税金额
                natSum: 0,
                // 本币无税金额
                natMoney: 0,
                // 本币税额
                natTax: 0,
                // 状态
                _status: "Insert"
              };
              sonArrayNotQualityData.push(SonDate1);
              dateList1 = {
                data: {
                  resubmitCheckKey: getuuids,
                  // 销售组织
                  salesOrgId: "yourIdHere",
                  // 回签单号
                  salereturnDefineCharacter: {
                    headDefine8: SignBackRes[i].code,
                    headDefine7: code,
                    headDefine5: SaleReturnTable[0].saleReturnDetails[j].salesOutCode,
                    attrext5: "false"
                  },
                  // 交易类型
                  transactionTypeId: "yourIdHere",
                  // 客户ID
                  agentId: SaleReturnTable[0].agentId,
                  // 单据日期
                  vouchdate: getDate(),
                  // 开票组织
                  settlementOrgId: SaleReturnTable[0].settlementOrgId,
                  // 币种
                  currency: "1592378409536192540",
                  // 汇率类型
                  exchangeRateType: SaleReturnTable[0].exchangeRateType,
                  // 币种
                  natCurrency: "1592378409536192540",
                  // 汇率
                  exchRate: SaleReturnTable[0].exchRate,
                  // 单价含税
                  taxInclusive: true,
                  // 退货类型
                  saleReturnSourceType: "NONE",
                  // 开票客户
                  invoiceAgentId: SaleReturnTable[0].invoiceAgentId,
                  payMoney: 0,
                  // 状态
                  _status: "Insert",
                  // 退货地址
                  deliveryAddress: SaleReturnTable[0].deliveryAddress,
                  //收货人移动电话
                  receiveMobile: SaleReturnTable[0].receiveMobile,
                  //	收货人
                  receiver: SaleReturnTable[0].receiver,
                  // 退货原因
                  saleReturnReason: "非质量问题换货",
                  saleReturnDetails: sonArrayNotQualityData
                }
              };
            }
          }
        }
      }
      dataListArray.push(dateList, dateList1);
    }
    let url = gatewayUrl + "/yonbip/sd/vouchersalereturn/singleSave";
    let auditUrl = gatewayUrl + "/yonbip/sd/vouchersalereturn/audit";
    if (dataListArray.length > 0) {
      for (let a = 0; a < dataListArray.length; a++) {
        let apiResponse = openLinker("POST", url, "AT164D981209380003", JSON.stringify(dataListArray[a]));
        let AddSaleReturnDate = JSON.parse(apiResponse);
        if (!AddSaleReturnDate.code === "200") {
          return { successCode: 1, dataListArray: dataListArray };
        }
      }
    }
    function getDate() {
      let getDate = new Date();
      let GENT = getDate.getTime();
      let expireTime = GENT;
      let expDate = new Date(expireTime);
      let Year = expDate.getFullYear();
      let Moth = expDate.getMonth() + 1 < 10 ? "0" + (expDate.getMonth() + 1) : expDate.getMonth() + 1;
      let Day = expDate.getDate() < 10 ? "0" + expDate.getDate() : expDate.getDate();
      let Hour = expDate.getHours() < 10 ? "0" + expDate.getHours() : expDate.getHours();
      let Minute = expDate.getMinutes() < 10 ? "0" + expDate.getMinutes() : expDate.getMinutes();
      let Sechond = expDate.getSeconds() < 10 ? "0" + expDate.getSeconds() : expDate.getSeconds();
      // 到期日期
      var expireDate = Year + "-" + Moth + "-" + Day + " " + Hour + ":" + Minute + ":" + Sechond;
      return expireDate;
    }
    return { successCode: 0 };
  }
}
exports({ entryPoint: MyAPIHandler });