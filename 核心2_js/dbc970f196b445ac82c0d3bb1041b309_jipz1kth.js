let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    var iscallback = data.callback;
    if (iscallback == "1") {
      // 表头的累计
      var totalMoney = Number(0);
      var payMoney = Number(0);
      var totalOriTax = Number(0);
      var payMoneyOrigTaxfree = Number(0);
      var totalNatTax = Number(0);
      var payMoneyDomestic = Number(0);
      var payMoneyDomesticTaxfree = Number(0);
      var orderPayMoneyOrigTaxfree = Number(0);
      var orderPayMoneyDomestic = Number(0);
      var orderPayMoneyDomesticTaxfree = Number(0);
      var totalMoneyOrigTaxfree = Number(0);
      var realMoney = Number(0);
      var allparticularlyMoney = Number(0);
      var orderPrices = data.orderPrices;
      var orderDetails = data.orderDetails;
      var ids = "";
      orderDetails.forEach((dataod) => {
        ids += dataod.id + ",";
        totalMoney += Number(dataod.saleCost);
        payMoney += Number(dataod.oriSum);
        let orderDetailsPrices = dataod.orderDetailPrices;
        totalOriTax += Number(orderDetailsPrices.oriTax);
        payMoneyOrigTaxfree += Number(orderDetailsPrices.oriMoney);
        totalNatTax += Number(orderDetailsPrices.natTax);
        payMoneyDomestic += Number(orderDetailsPrices.natSum);
        payMoneyDomesticTaxfree += Number(orderDetailsPrices.natMoney);
        orderPayMoneyOrigTaxfree += Number(orderDetailsPrices.oriMoney);
        orderPayMoneyDomestic += Number(orderDetailsPrices.natSum);
        orderPayMoneyDomesticTaxfree += Number(orderDetailsPrices.natMoney);
        totalMoneyOrigTaxfree += Number(dataod.saleCost);
        realMoney += Number(dataod.oriSum);
        allparticularlyMoney += Number(dataod.particularlyMoney);
      });
      var id = substring(ids, 0, ids.length - 1);
      let sql =
        "select orderDetailId.saleCost,orderDetailId.oriSum,oriTax,oriMoney,natTax,natSum,natMoney,orderDetailId.particularlyMoney from voucher.order.OrderDetailPrice odp left join orderDetailId on odp.orderDetailId=orderDetailId.id  where orderDetailId.orderId=" +
        parseInt(data.id) +
        " and orderDetailId.id not in (" +
        id +
        ")";
      var resdata = ObjectStore.queryByYonQL(sql, "udinghuo");
      resdata.forEach((rdata) => {
        totalMoney += Number(rdata.orderDetailId_saleCost);
        payMoney += Number(rdata.orderDetailId_oriSum);
        totalOriTax += Number(rdata.oriTax);
        payMoneyOrigTaxfree += Number(rdata.oriMoney);
        totalNatTax += Number(rdata.natTax);
        payMoneyDomestic += Number(rdata.natSum);
        payMoneyDomesticTaxfree += Number(rdata.natMoney);
        orderPayMoneyOrigTaxfree += Number(rdata.oriMoney);
        orderPayMoneyDomestic += Number(rdata.natSum);
        orderPayMoneyDomesticTaxfree += Number(rdata.natMoney);
        totalMoneyOrigTaxfree += Number(rdata.orderDetailId_saleCost);
        realMoney += Number(rdata.orderDetailId_oriSum);
        allparticularlyMoney += Number(rdata.orderDetailId_particularlyMoney);
      });
      totalMoney = MoneyFormatReturnBd(totalMoney, 2);
      payMoney = MoneyFormatReturnBd(payMoney, 2);
      realMoney = MoneyFormatReturnBd(realMoney, 2);
      allparticularlyMoney = MoneyFormatReturnBd(allparticularlyMoney, 2);
      payMoneyOrigTaxfree = MoneyFormatReturnBd(payMoneyOrigTaxfree, 2);
      payMoneyOrigTaxfree = MoneyFormatReturnBd(payMoneyOrigTaxfree, 2);
      totalNatTax = MoneyFormatReturnBd(totalNatTax, 2);
      payMoneyDomestic = MoneyFormatReturnBd(payMoneyDomestic, 2);
      payMoneyDomesticTaxfree = MoneyFormatReturnBd(payMoneyDomesticTaxfree, 2);
      orderPayMoneyOrigTaxfree = MoneyFormatReturnBd(orderPayMoneyOrigTaxfree, 2);
      orderPayMoneyDomestic = MoneyFormatReturnBd(orderPayMoneyDomestic, 2);
      orderPayMoneyDomesticTaxfree = MoneyFormatReturnBd(orderPayMoneyDomesticTaxfree, 2);
      totalMoneyOrigTaxfree = MoneyFormatReturnBd(totalMoneyOrigTaxfree, 2);
      data.set("totalMoney", totalMoney + "");
      data.set("payMoney", payMoney + "");
      data.set("realMoney", realMoney + "");
      data.set("particularlyMoney", allparticularlyMoney + "");
      orderPrices.set("totalOriTax", totalOriTax + "");
      orderPrices.set("payMoneyOrigTaxfree", payMoneyOrigTaxfree + "");
      orderPrices.set("totalNatTax", totalNatTax + "");
      orderPrices.set("payMoneyDomestic", payMoneyDomestic + "");
      orderPrices.set("payMoneyDomesticTaxfree", payMoneyDomesticTaxfree + "");
      orderPrices.set("orderPayMoneyOrigTaxfree", orderPayMoneyOrigTaxfree + "");
      orderPrices.set("orderPayMoneyDomestic", orderPayMoneyDomestic + "");
      orderPrices.set("orderPayMoneyDomesticTaxfree", orderPayMoneyDomesticTaxfree + "");
      orderPrices.set("totalMoneyOrigTaxfree", totalMoneyOrigTaxfree + "");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });