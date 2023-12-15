let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let precisionPrice = 8;
    // 金额精度
    let precisionAmount = 2;
    let ntaxrateContent = "13";
    let num = 2;
    let ntaxrateCalc = new Big(ntaxrateContent).div(100);
    let ntaxrate = MoneyFormatReturnBd(ntaxrateCalc.toString(), precisionAmount);
    var priceTemporal = "11.3";
    var priceWithoutTax = MoneyFormatReturnBd(new Big(priceTemporal).div(new Big(1).plus(new Big(ntaxrate))).toString(), precisionPrice);
    var priceWithTax = MoneyFormatReturnBd(new Big(priceTemporal).times(new Big(1).plus(new Big(ntaxrate))).toString(), precisionPrice);
    let amountIncludingTax = MoneyFormatReturnBd(new Big(priceWithTax).times(new Big(num)).toString(), precisionAmount);
    let amountWithoutTax = MoneyFormatReturnBd(new Big(priceWithoutTax).times(new Big(num)).toString(), precisionAmount);
    let taxAmount = MoneyFormatReturnBd(new Big(amountIncludingTax).minus(new Big(amountWithoutTax)).toString(), precisionAmount);
    return {
      ntaxrateCalc,
      ntaxrate: new Number(ntaxrate).toFixed(3),
      priceWithoutTax,
      priceWithTax,
      amountIncludingTax,
      amountWithoutTax,
      taxAmount
    };
  }
}
exports({ entryPoint: MyAPIHandler });