let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    const timeStamp = new Date().getTime();
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var riqi = y + "-" + m + "-" + d;
    const dID = param.data[0].id;
    var sql = "select id , agentId , rebateMoney , memo , shareSettingId from voucher.rebate.AmountRebate where id = '" + dID + "'";
    var resData = ObjectStore.queryByYonQL(sql, "marketingbill");
    const datas = resData[0];
    const agentId = datas.agentId; //客户ID
    const rebateMoney = Math.abs(datas.rebateMoney); //返利金额
    const remark = datas.memo; //备注
    var zhsygzID = datas.shareSettingId;
    var transactionTypeId = "yourIdHere";
    zhsygzID == "1632514346359717901" ? (transactionTypeId = "yourIdHere") : (transactionTypeId = "yourIdHere");
    let body = {
      data: {
        resubmitCheckKey: "" + timeStamp + "",
        salesOrgId: "yourIdHere",
        transactionTypeId: transactionTypeId,
        agentId: "" + agentId + "",
        retailInvestors: true,
        vouchdate: "" + riqi + "",
        settlementOrgId: "yourIdHere",
        currency: "CNY",
        exchangeRateType: "oibdp3oo",
        natCurrency: "CNY",
        saleReturnMemo: {
          remark: "" + remark + ""
        },
        isWfControlled: true,
        exchRate: 1,
        taxInclusive: true,
        saleReturnStatus: "SUBMITSALERETURN",
        saleReturnSourceType: "NONE",
        invoiceAgentId: "" + agentId + "",
        realMoney: rebateMoney,
        modifyInvoiceType: true,
        bdInvoiceTypeId: "0",
        invoiceUpcType: "0",
        invoiceTitleType: "0",
        totalMoney: rebateMoney,
        payMoney: rebateMoney,
        totalMoneyOrigTaxfree: rebateMoney,
        payMoneyOrigTaxfree: rebateMoney,
        totalOriTax: 0,
        totalMoneyDomestic: rebateMoney,
        payMoneyDomestic: rebateMoney,
        totalMoneyDomesticTaxfree: rebateMoney,
        payMoneyDomesticTaxfree: rebateMoney,
        totalNatTax: 0,
        isFlowCoreBill: true,
        "headItem!define2": "工程订单",
        "headItem!define12": "江西照明灯具内销破损仓",
        _status: "Insert",
        saleReturnDetails: [
          {
            productId: 1632494769895637027,
            skuId: "yourIdHere",
            unitExchangeType: 0,
            unitExchangeTypePrice: 0,
            taxId: "yourIdHere",
            stockOrgId: "yourIdHere",
            iProductAuxUnitId: 1603573731422109717,
            iProductUnitId: 1603573731422109717,
            masterUnitId: 1603573731422109717,
            orderProductType: "SALE",
            salesOrgId: "yourIdHere",
            enable: true,
            invExchRate: 1,
            subQty: 1,
            invPriceExchRate: 1,
            priceQty: 1,
            qty: 1,
            isBatchManage: false,
            isExpiryDateManage: false,
            oriTaxUnitPrice: rebateMoney,
            oriUnitPrice: rebateMoney,
            oriSum: rebateMoney,
            oriMoney: rebateMoney,
            oriTax: 0,
            natTaxUnitPrice: rebateMoney,
            natUnitPrice: rebateMoney,
            natSum: rebateMoney,
            natMoney: rebateMoney,
            natTax: 0,
            _status: "Insert"
          }
        ]
      }
    };
    let url = "https://www.example.com/";
    if (zhsygzID == 1632514346359717901 || zhsygzID == 1632514200322965510) {
      let apiResponse = openLinker("POST", url, "AT16388E3408680009", JSON.stringify(body));
      var res = JSON.parse(apiResponse);
      if (res.code == 200) {
        return {};
      } else {
        throw new Error("！！！");
      }
    }
  }
}
exports({ entryPoint: MyTrigger });