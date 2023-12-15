let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    var iscallback = data.callback;
    if (iscallback == "1") {
      //运费计算
      var orderDetails = data.orderDetails;
      orderDetails.forEach((datas) => {
        //总价=含税报价*计价数量
        var sum = Number(datas.salePrice) * Number(datas.priceQty);
        //实际金额=含税金额=含税成交价*计价数量
        var oriSum = Number(datas.oriTaxUnitPrice) * Number(datas.priceQty);
        var specil = Number(sum) - Number(oriSum); //特殊优惠
        //先检查是否为默认值
        var ysorderProductApportions = datas.orderProductApportions[0];
        if (ysorderProductApportions.orderId === 0) {
          //判断是否已回写
          orderProductApportions.set("apportionMoney", specil);
          orderProductApportions.set("apportionName", "运费");
          orderProductApportions.set("apportionType", "PARTICULARLY");
          orderProductApportions.set("orderDetailId", datas.id);
          orderProductApportions.set("orderNo", datas.code);
          orderProductApportions.set("orderId", datas.orderId);
          orderProductApportions.set("productType", "SALE");
          orderProductApportions.set("_status", "Insert");
        }
        //特殊优惠
        datas.set("particularlyMoney", specil);
      });
      var orderPrices = data.orderPrices;
      var totalMoneyOrigTaxfree = Number(0);
      var oriMoney = Number(0);
      var natSum = Number(0);
      var natMoney = Number(0);
      var totalOutStockOriTaxMoney = Number(0);
      orderDetails.forEach((datas) => {
        //含税报价salePrice    BIP的
        //含税成交价oriTaxUnitPrice
        //计价数量  priceQty
        let orderDetailsPrices = datas.orderDetailPrices;
        orderDetailsPrices.set("oriTax", "0"); //所有税都是0
        orderDetailsPrices.set("natTax", "0"); //所有税都是0
        //含税金额=含税成交价* 计价数量
        orderDetailsPrices.set("oriSum", Number(orderDetailsPrices.oriTaxUnitPrice) * Number(orderDetailsPrices.priceQty));
        //原币无税单价=无税成交价=含税成交价
        orderDetailsPrices.set("oriUnitPrice", orderDetailsPrices.oriTaxUnitPrice);
        //原币无税金额=含税金额
        orderDetailsPrices.set("oriMoney", orderDetailsPrices.oriSum);
        //本币无税单价=无税成交价=含税成交价
        orderDetailsPrices.set("natUnitPrice", orderDetailsPrices.oriTaxUnitPrice);
        //本币含税金额
        var odpnatSum = Number(orderDetailsPrices.oriTaxUnitPrice) * Number(orderDetailsPrices.priceQty);
        orderDetailsPrices.set("natSum", odpnatSum);
        //本币无税金额=本币含税金额
        orderDetailsPrices.set("natMoney", orderDetailsPrices.natSum);
        //无税单价=含税单价=含税成交价
        orderDetailsPrices.set("salePrice_orig_taxfree", oriTaxUnitPrice);
        datas.set("oriTax", "0"); //所有税都是0
        datas.set("natTax", "0"); //所有税都是0
        datas.set("taxItems", "0"); //税目
        datas.set("saleCost_orig_taxfree", datas.saleCost); //报价无税金额=报价含税金额
        datas.set("salePrice", datas.salePrice); //含税报价
        datas.set("saleCost", datas.saleCost); //报价含税金额
        datas.set("oriSum", Number(datas.oriTaxUnitPrice) * Number(datas.priceQty));
        //原币无税单价=无税成交价=含税成交价
        datas.set("oriUnitPrice", datas.oriTaxUnitPrice);
        //原币无税金额=含税金额
        datas.set("oriMoney", datas.oriSum);
        //本币无税金额
        datas.set("natMoney", datas.oriSum);
        //应收金额 = 含税金额
        datas.set("ordRealMoney", natMoney);
        totalMoneyOrigTaxfree += Number(orderDetailsPrices.oriTaxUnitPrice) * Number(orderDetailsPrices.priceQty);
      });
      orderPrices.set("totalMoneyOrigTaxfree", totalMoneyOrigTaxfree); //无税总金额
      orderPrices.set("payMoneyOrigTaxfree", totalMoneyOrigTaxfree); //合计无税金额
      orderPrices.set("payMoneyDomestic", totalMoneyOrigTaxfree); //本币含税金额
      orderPrices.set("payMoneyDomesticTaxfree", totalMoneyOrigTaxfree); //本币无税金额
      orderPrices.set("orderPayMoneyOrigTaxfree", totalMoneyOrigTaxfree); //商品实付无税金额
      orderPrices.set("orderPayMoneyDomestic", totalMoneyOrigTaxfree); //商品本币含税实付金额
      orderPrices.set("orderPayMoneyDomesticTaxfree", totalMoneyOrigTaxfree); //商品本币无税金额
      orderPrices.set("outBoundSumMoney", totalMoneyOrigTaxfree); //累计出库金额
      orderPrices.set("exchRate", "1"); //汇率
      orderPrices.set("totalOriTax", "0"); //税额
      orderPrices.set("totalNatTax", "0"); //本币总税额
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });