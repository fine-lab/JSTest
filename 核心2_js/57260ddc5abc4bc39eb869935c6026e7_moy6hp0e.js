let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let _status = data._status; //状态
    let orderDefineCharacter = data.orderDefineCharacter || {};
    let define21 = orderDefineCharacter.attrext106 || "0"; //折扣后无税金额
    let define8 = orderDefineCharacter.attrext82 || ""; //来源系统
    if (_status == "Insert" && define21 == "0" && define8 == "EDI") {
      //是否触发计算
      console.log("触发计算");
      let jt = orderDefineCharacter.attrext71 || "0"; //津贴3 整单折扣
      let xjzk = orderDefineCharacter.attrext78 || "0"; //津贴3 现金折扣
      let zkhwsje = 0; //折扣后无税金额
      let zdzkje = 0; //整单折扣金额
      let amountun = 0;
      //修改表体
      data.orderDetails.map((item) => {
        let wlhjt = item.orderDetailDefineCharacter.attrext109 || "0"; //物料行津贴
        let zqwsdj = item.orderDetailDefineCharacter.attrext108 || "0"; //折前无税单价
        let zhdj = (zqwsdj * (1 - Number(wlhjt) / 100)).toFixed(4); //折后单价
        item.orderDetailDefineCharacter.set("attrext110", zhdj + ""); //折后单价
        let zhje = (Number(zhdj) * Number(item.qty)).toFixed(2); //折后金额
        item.orderDetailDefineCharacter.set("attrext111", zhje + ""); //折后金额
        let wsdj = (Number(zhdj) * (1 - Number(jt) / 100) * (1 - Number(xjzk) / 100)).toFixed(4); //无税单价
        //计算金额
        let Amount = this.getAmount(item.qty, item.taxRate, data["orderPrices!exchRate"], wsdj);
        item.set("orderDetailPrices!natMoney", Number(Amount.natMoney) + ""); //本币无税金额
        item.set("orderDetailPrices!natSum", Number(Amount.natSum) + ""); //本币含税金额
        item.set("orderDetailPrices!natTax", Number(Amount.natTax) + ""); //本币税额
        item.set("orderDetailPrices!natUnitPrice", Number(Amount.natUnitPrice) + ""); //本币无税单价
        item.set("orderDetailPrices!oriMoney", Number(Amount.oriMoney) + ""); //无税金额
        item.set("orderDetailPrices!oriTax", Number(Amount.oriTax) + ""); //税额
        item.set("orderDetailPrices!oriUnitPrice", Number(Amount.oriUnitPrice) + ""); //无税成交价
        item.set("oriSum", Number(Amount.oriSum) + ""); //含税金额
        item.set("oriTaxUnitPrice", Number(Amount.oriTaxUnitPrice) + ""); //含税成交价
        item.set("orderDetailPrices!natTaxUnitPrice", Number(Amount.natTaxUnitPrice) + ""); //本币含税单价
        zkhwsje += Number(Number(zhje).toFixed(2)); //折后金额
        amountun += Number(Number(Amount.oriMoney).toFixed(2)); //表体无税金额
        item.orderDetailPrices.set("oriTax", Number(Amount.oriTax) + ""); //税额
        item.orderDetailPrices.set("oriUnitPrice", Number(Amount.oriUnitPrice) + ""); //无税成交价
        item.orderDetailPrices.set("natSum", Number(Amount.natSum) + ""); //本币含税金额
        item.orderDetailPrices.set("natTax", Number(Amount.natTax) + ""); //本币税额
        item.orderDetailPrices.set("oriMoney", Number(Amount.oriMoney) + ""); //无税金额
        item.orderDetailPrices.set("natTaxUnitPrice", Number(Amount.natTaxUnitPrice) + ""); //本币含税单价
        item.orderDetailPrices.set("natMoney", Number(Amount.natMoney) + ""); //本币无税金额
        item.orderDetailPrices.set("natUnitPrice", Number(Amount.natUnitPrice) + ""); //本币无税单价
      });
      //更新表头
      zdzkje = (zkhwsje - amountun).toFixed(2);
      if (Number(zdzkje) < 0) {
        zdzkje = "0.00";
      }
      zkhwsje = zkhwsje.toFixed(2);
      data.orderDefineCharacter.set("attrext106", zkhwsje + ""); //折扣后无税金额
      data.orderDefineCharacter.set("attrext107", zdzkje + ""); //整单折扣金额
    }
    return {};
  }
  getAmount(qty, taxRate, exchRate, price, isTax) {
    qty = Number(qty);
    taxRate = Number(taxRate);
    exchRate = Number(exchRate);
    price = Number(price);
    let res = {};
    if (isTax) {
      let oriTaxUnitPrice = price;
      let oriUnitPrice = (oriTaxUnitPrice / (1 + taxRate / 100)).toFixed(4); //无税单价
      let oriSum = (oriTaxUnitPrice * qty).toFixed(2); //含税金额
      let oriMoney = (oriSum / (1 + taxRate / 100)).toFixed(2); //无税金额
      let oriTax = (oriSum - oriMoney).toFixed(2); //税额
      //本币
      let natTaxUnitPrice = (oriTaxUnitPrice * exchRate).toFixed(4); //含税单价
      let natUnitPrice = (natTaxUnitPrice / (1 + taxRate / 100)).toFixed(4); //无税单价
      let natSum = (natTaxUnitPrice * qty).toFixed(2); //含税金额
      let natMoney = (natSum / (1 + taxRate / 100)).toFixed(2); //无税金额
      let natTax = (natSum - natMoney).toFixed(2); //税额
      res = { oriTaxUnitPrice, oriUnitPrice, oriSum, oriMoney, oriTax, natTaxUnitPrice, natUnitPrice, natSum, natMoney, natTax };
    } else {
      let oriUnitPrice = price; //无税单价
      let oriTaxUnitPrice = (oriUnitPrice * (1 + taxRate / 100)).toFixed(4); //含税单价
      let oriMoney = (oriUnitPrice * qty).toFixed(2); //无税金额
      let oriSum = (oriMoney * (1 + taxRate / 100)).toFixed(2); //含税金额
      let oriTax = (oriSum - oriMoney).toFixed(2); //税额
      //本币
      let natUnitPrice = (oriUnitPrice * exchRate).toFixed(4); //无税单价
      let natTaxUnitPrice = (natUnitPrice * (1 + taxRate / 100)).toFixed(4); //含税单价
      let natMoney = (natUnitPrice * qty).toFixed(2); //无税金额
      let natSum = (natMoney * (1 + taxRate / 100)).toFixed(2); //含税金额
      let natTax = (natSum - natMoney).toFixed(2); //税额
      res = { oriTaxUnitPrice, oriUnitPrice, oriSum, oriMoney, oriTax, natTaxUnitPrice, natUnitPrice, natSum, natMoney, natTax };
    }
    return res;
  }
}
exports({ entryPoint: MyTrigger });