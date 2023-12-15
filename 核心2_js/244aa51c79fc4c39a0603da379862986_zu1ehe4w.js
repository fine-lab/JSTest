let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let res_voub = param.res_voub; //发票子表信息
    let priceResMap = param.priceResMap; //单价
    let config = param.config; //配置信息
    let vouindex = param.vouindex; //凭证生成顺序
    var org_id = "";
    var csaleinvoiceid = "";
    var invoice_vbillcode = "";
    var sumtax = ""; //税额合计
    var summoney = ""; //不含税金额合计
    var sumAmount = "";
    for (let i = 0; i < res_voub.length; i++) {
      var productId = res_voub[i].productId; //物料id
      csaleinvoiceid = res_voub[i].invoice_id; //
      invoice_vbillcode = res_voub[i].invoice_code; //
      org_id = res_voub[i].org_id;
      let priceObj = priceResMap.priceMap.get(productId);
      var nMoney = Number(res_voub[i].priceQty) * Number(priceObj.c_price); //金额=开票数量 * 调价单单价
      var nTax = nMoney * Number(res_voub[i].taxRate) * 0.01; //税 = 金额 * 税率
      sumtax = Number(sumtax) + Number(nTax); //税额合计
      summoney = Number(summoney) + Number(nMoney); //金额合计
    }
    sumAmount = Number(summoney) + Number(sumtax);
    // （1）	生成贸易公司（C）对实业公司（B）的应付凭证 按开票数量取实业公司（B）的销售价格
    //     借：1405库存商品
    //     贷：220201应付账款-发票结算（辅助核算：供应商实业公司，编码待提供）
    let body1 = {
      srcSystemCode: "figl",
      accbookCode: config.config.book1003,
      voucherTypeCode: "1",
      bodies: [
        {
          description: "库存商品摘要",
          accsubjectCode: "1405",
          debitOriginal: summoney,
          debitOrg: summoney
        },
        {
          description: "进项税额摘要",
          accsubjectCode: "2221010101",
          debitOriginal: sumtax,
          debitOrg: sumtax
        },
        {
          description: "应付账款-发票结算摘要",
          accsubjectCode: "220201",
          creditOriginal: sumAmount,
          creditOrg: sumAmount,
          clientAuxiliaryList: [
            {
              filedCode: "0004",
              valueCode: "00DG000001"
            }
          ]
        }
      ]
    };
    body1.makerMobile = config.config.makerMobile;
    body1.makerEmail = config.config.makerEmail;
    let url = "https://www.example.com/";
    let saveVouRes = openLinker("POST", url, "GL", JSON.stringify(body1));
    var saveVouRes_jo = JSON.parse(saveVouRes);
    let body_log = {
      org_id: org_id,
      csaleinvoiceid: csaleinvoiceid,
      invoice_vbillcode: invoice_vbillcode,
      accbook: saveVouRes_jo.data.accbook.code,
      voucherid: saveVouRes_jo.data.voucherId,
      vouindex: vouindex,
      vouchcode: saveVouRes_jo.data.voucherType.voucherstr + "-" + saveVouRes_jo.data.billCode
    };
    let url_log = "https://www.example.com/";
    let apiResponse_log = openLinker("POST", url_log, "AT169CA8FC09A00003", JSON.stringify(body_log));
    return { voures: saveVouRes_jo, logRes: JSON.parse(apiResponse_log) };
  }
}
exports({ entryPoint: MyTrigger });