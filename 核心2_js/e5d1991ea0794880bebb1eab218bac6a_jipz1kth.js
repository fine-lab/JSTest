let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    var iscallback = data.callback;
    if (iscallback == "1") {
      var orderDetails = data.orderDetails;
      for (let irow = 0; irow < orderDetails.length; irow++) {
        let datas = orderDetails[irow];
        //总价=含税报价*计价数量
        let sum = Number(datas.salePrice) * Number(datas.priceQty);
        //实际金额=含税金额=含税成交价*计价数量
        let oriSum = Number(datas.oriTaxUnitPrice) * Number(datas.priceQty);
        let specil = Number(sum) - Number(oriSum); //特殊优惠
        specil = MoneyFormatReturnBd(specil, 2);
        //先检查是否为默认值
        let ysorderProductApportions = datas.orderProductApportions[0];
        let sql = "select * from voucher.order.OrderProductApportion where orderDetailId = " + parseInt(datas.id);
        let res = ObjectStore.queryByYonQL(sql, "udinghuo");
        if (res.length > 0) {
          ysorderProductApportions.set("id", res[0].id);
          ysorderProductApportions.set("_status", "Update");
        } else {
          ysorderProductApportions.set("_status", "Insert");
        }
        ysorderProductApportions.set("apportionMoney", specil + "");
        ysorderProductApportions.set("apportionName", "运费");
        ysorderProductApportions.set("apportionType", "PARTICULARLY");
        ysorderProductApportions.set("orderDetailId", datas.id + "");
        ysorderProductApportions.set("orderNo", datas.code + "");
        ysorderProductApportions.set("orderId", datas.orderId + "");
        ysorderProductApportions.set("productType", "SALE");
        //特殊优惠
        datas.set("particularlyMoney", specil + "");
        //重新给自定义项赋值
        var odid = datas.id; //表体行id
        let sql1 = "select id from voucher.order.OrderDetailDefine where orderDetailId=" + parseInt(odid);
        let res1 = ObjectStore.queryByYonQL(sql1, "udinghuo");
        var idd = parseInt(res1[0].id);
        var bodyItem = datas.bodyItem;
        bodyItem.set("id", idd);
        bodyItem.set("_status", "Update");
        bodyItem.set("orderId", datas.orderId + "");
        bodyItem.set("code", datas.code + "");
        bodyItem.set("orderDetailKey", datas.id + "");
        bodyItem.set("orderDetailId", datas.id + "");
        let priceQty = datas.priceQty; //计价数量
        let oriTaxUnitPrice = datas.oriTaxUnitPrice; //含税成交价
        //关于销售数量和数量，纪尚总说不用重新算了，crm传多少，bip就显示多少
        //关于销售数量和数量，纪尚总说不用重新算了，crm传多少，bip就显示多少
        let saleCost = Number(datas.salePrice) * Number(priceQty); //报价含税金额
        saleCost = MoneyFormatReturnBd(saleCost, 2);
        datas.set("saleCost", saleCost + "");
        oriTaxUnitPrice = MoneyFormatReturnBd(oriTaxUnitPrice, 2);
        oriSum = MoneyFormatReturnBd(oriSum, 2);
        priceQty = MoneyFormatReturnBd(priceQty, 2);
        datas.set("rebateMoney", "0"); //返利分摊金额
        datas.set("orderRebateMoney", "0"); //返利整单折扣
        datas.set("cashRebateMoney", "0"); //返利直接抵现
        datas.set("promotionMoney", "0"); //促销分摊
        datas.set("pointsMoney", "0"); //积分抵扣金额
        let particularlyMoney = Number(saleCost) - Number(oriSum); //特殊优惠
        particularlyMoney = MoneyFormatReturnBd(particularlyMoney, 2);
        datas.set("particularlyMoney", particularlyMoney + "");
        datas.set("taxRate", "0"); //税率
        datas.set("oriTax", "0"); //税额
        datas.set("oriUnitPrice", oriTaxUnitPrice + ""); //原币无税单价
        datas.set("oriMoney", oriSum + ""); //原币无税金额
        datas.set("natUnitPrice", oriTaxUnitPrice + ""); //本币无税单价
        datas.set("natTaxUnitPrice", oriTaxUnitPrice + ""); //本币含税单价
        datas.set("oriSum", oriSum + "");
        datas.set("natMoney", oriSum + ""); //本币无税金额
        datas.set("natSum", oriSum + ""); //本币含税金额
        datas.set("natTax", "0"); //本币税额
        datas.set("ordRealMoney", oriSum + ""); //应收金额
        let orderDetailsPrices = datas.orderDetailPrices;
        orderDetailsPrices.set("saleCost_orig_taxfree", datas.saleCost + "");
        //原币无税金额=含税金额
        orderDetailsPrices.set("oriMoney", oriSum + "");
        //原币无税单价=无税成交价=含税成交价
        orderDetailsPrices.set("oriUnitPrice", oriTaxUnitPrice + "");
        //原币无税分摊返利
        orderDetailsPrices.set("rebateMoneyOrigTaxfree", "0");
        //原币无税特殊优惠
        orderDetailsPrices.set("particularlyMoneyOrigTaxfree", particularlyMoney + "");
        //原币无税促销
        orderDetailsPrices.set("promotionMoneyOrigTaxfree", "0");
        //原币无税抵扣积分
        orderDetailsPrices.set("pointsMoneyOrigTaxfree", "0");
        //报价本币含税金额
        orderDetailsPrices.set("saleCost_domestic", saleCost + "");
        //本币含税金额
        let odpnatSum = Number(oriTaxUnitPrice) * Number(priceQty);
        odpnatSum = MoneyFormatReturnBd(odpnatSum, 2);
        orderDetailsPrices.set("natSum", odpnatSum + "");
        //本币含税单价
        orderDetailsPrices.set("natTaxUnitPrice", oriTaxUnitPrice + "");
        //本币分摊返利
        orderDetailsPrices.set("rebateMoneyDomestic", "0");
        //本币特殊优惠
        orderDetailsPrices.set("particularlyMoneyDomestic", datas.particularlyMoney + "");
        //本币促销优惠
        orderDetailsPrices.set("promotionMoneyDomestic", "0");
        //本币积分抵扣
        orderDetailsPrices.set("pointsMoneyDomestic", "0");
        //报价本币无税金额
        orderDetailsPrices.set("saleCost_domestic_taxfree", datas.saleCost + "");
        //本币无税金额=本币含税金额
        orderDetailsPrices.set("natMoney", oriSum + "");
        //本币无税单价=无税成交价=含税成交价
        orderDetailsPrices.set("natUnitPrice", oriTaxUnitPrice + "");
        //本币无税分摊返利
        orderDetailsPrices.set("rebateMoneyDomesticTaxfree", "0");
        //本币无税特殊优惠
        orderDetailsPrices.set("particularlyMoneyDomesticTaxfree", datas.particularlyMoney + "");
        //本币无税促销优惠
        orderDetailsPrices.set("promotionMoneyDomesticTaxfree", "0");
        //本币无税积分抵扣
        orderDetailsPrices.set("pointsMoneyDomesticTaxfree", "0");
        //税额
        orderDetailsPrices.set("oriTax", "0 ");
        //本币税额
        orderDetailsPrices.set("natTax", "0");
        //计价数量
        orderDetailsPrices.set("priceQty", priceQty + "");
        //数量
        orderDetailsPrices.set("qty", datas.qty + "");
        //销售数量
        orderDetailsPrices.set("subQty", datas.subQty + "");
        //税率
        orderDetailsPrices.set("taxRate", "0");
        //原币含税单价
        orderDetailsPrices.set("oriTaxUnitPrice", oriTaxUnitPrice + "");
        //含税金额
        orderDetailsPrices.set("oriSum", oriSum + "");
        //扣率
        orderDetailsPrices.set("discountRate", "100");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });