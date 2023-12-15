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
    var sql = "select id , code , agentId , rebateMoney , memo , shareSettingId from voucher.rebate.AmountRebate where id = '" + dID + "'";
    var resData = ObjectStore.queryByYonQL(sql, "marketingbill");
    const datas = resData[0];
    const agentId = datas.agentId;
    const code = datas.code;
    const rebateMoney = Math.abs(datas.rebateMoney);
    const remark = datas.memo;
    var zhsygzID = datas.shareSettingId;
    var transactionTypeId = "yourIdHere"; // //普通退货
    zhsygzID == "1622080152811864071" ? (transactionTypeId = "yourIdHere") : (transactionTypeId = "yourIdHere"); //yourIdHere 销售折让单
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
        exchangeRateType: "1604279308662603781", //d1bd4g5h  1604279308662603781
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
        salereturnDefineCharacter: {
          headDefine2: "不走流程审批",
          attrext33: "" + code + ""
        },
        _status: "Insert",
        saleReturnDetails: [
          {
            productId: "yourIdHere", //yourIdHere
            skuId: "yourIdHere", //yourIdHere
            unitExchangeType: 0,
            unitExchangeTypePrice: 0,
            taxId: "yourIdHere", //yourIdHere
            stockOrgId: "yourIdHere",
            iProductAuxUnitId: "yourIdHere", //yourIdHere
            iProductUnitId: "yourIdHere",
            masterUnitId: "yourIdHere",
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
    if (zhsygzID == 1622080152811864071 || zhsygzID == 1629366375842054160) {
      let apiResponse = openLinker("POST", url, "AT16388E3408680009", JSON.stringify(body)); // BBSMK AT16388E3408680009
      var res = JSON.parse(apiResponse);
      if (res.code == 200) {
        return {};
      } else {
        throw new Error("销售退货单保存接口异常：" + apiResponse);
      }
    }
  }
}
exports({ entryPoint: MyTrigger });