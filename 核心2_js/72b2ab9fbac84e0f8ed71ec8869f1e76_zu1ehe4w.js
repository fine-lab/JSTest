let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let res_voub = param.res_voub; //发票子表信息
    let priceResMap = param.priceResMap; //单价
    let config = param.config; //配置信息
    let vouindex = param.vouindex; //凭证生成顺序
    //    借：1122应收账款（辅助核算：客户贸易公司，编码待提供）
    //    贷：600101 粽类收入（销售发票上的物料，物料分类为101时）
    let body2 = {
      srcSystemCode: "figl",
      accbookCode: config.config.book1001,
      voucherTypeCode: "1",
      bodies: [
        {
          description: "应收账款摘要",
          accsubjectCode: "1122",
          clientAuxiliaryList: [
            {
              filedCode: config.config.vou0201_AuxCode,
              valueCode: config.config.vou0201_AuxVal
            }
          ]
        },
        {
          description: "销项税摘要",
          accsubjectCode: "22210102"
        }
      ]
    };
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
      //创建分录
      var vouitemJo = new Object();
      vouitemJo.description = "2222摘要";
      vouitemJo.accsubjectCode = res_voub[i].subcode;
      vouitemJo.creditOriginal = nMoney;
      vouitemJo.creditOrg = nMoney;
      //辅助核算
      var auxiList = new Array();
      auxiList[0] = new Object();
      auxiList[0].filedCode = config.config.vou0202_AuxCode;
      auxiList[0].valueCode = config.config.vou0202_AuxVal;
      vouitemJo.clientAuxiliaryList = auxiList;
      body2.bodies[2] = vouitemJo;
    }
    sumAmount = Number(summoney) + Number(sumtax);
    // 借：1122应收账款（辅助核算：客户贸易公司
    body2.bodies[0].debitOriginal = sumAmount;
    body2.bodies[0].debitOrg = sumAmount;
    //贷:22210102销项税
    body2.bodies[1].creditOriginal = sumtax;
    body2.bodies[1].creditOrg = sumtax;
    body2.makerMobile = config.config.makerMobile;
    body2.makerEmail = config.config.makerEmail;
    let url = config.config.saveVou_url;
    let saveVouRes = openLinker("POST", url, "GL", JSON.stringify(body2));
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