let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //引入配置文件
    let configfunc = extrequire("SCMSA.sainvoice.pushConfig");
    let config = configfunc.execute(context, param);
    var id = param.data[0].id;
    var orgId = param.data[0].orgId;
    var logSql = "select * from AT169CA8FC09A00003.AT169CA8FC09A00003.pushVoucherLog where csaleinvoiceid = '" + id + "' ";
    var reslogs = ObjectStore.queryByYonQL(logSql, "developplatform");
    var sumlog = reslogs.length;
    if (sumlog > 0) {
      var hitmsg = "该发票已经推出了" + sumlog + "张凭证，请删除后再操作\n";
      for (let m = 0; m < reslogs.length; m++) {
        hitmsg = hitmsg + "账簿：" + reslogs[m].accbook + "；凭证号：" + reslogs[m].vouchcode + "；\n";
      }
    }
    var sqlh =
      " select org.code,natSum,agentId,agent.code,oriSum,code from voucher.invoice.SaleInvoice inner join org.func.BaseOrg org on orgId = org.id " +
      " inner join aa.merchant.Merchant agent on agentId = agent.id " +
      " where id = '" +
      id +
      "' ";
    var res_vouh = ObjectStore.queryByYonQL(sqlh);
    var orgcode = res_vouh[0].org_code;
    if (orgcode != "1003") {
      //实业公司的销售发票才进行推凭证操作
      return {};
    }
    var bsql =
      "select b.code as invcode,c.code as classcode,productId,priceQty,taxRate " +
      "from voucher.invoice.SaleInvoiceDetail inner join pc.product.Product b on productId = b.id  " +
      " inner join pc.cls.ManagementClass c on b.manageClass = c.id " +
      " where mainid = '" +
      id +
      "' ";
    var res_voub = ObjectStore.queryByYonQL(bsql);
    var productId_in = "";
    for (let i = 0; i < res_voub.length; i++) {
      var mjo = res_voub[i];
      var classcode3 = substring(mjo.classcode, 0, 3); //物料分类前三位
      var subcode = "";
      if (classcode3 == "101") {
        subcode = "600101";
      } else if (classcode3 == "102") {
        subcode = "600102";
      } else if (classcode3 == "103") {
        subcode = "600103";
      } else {
        subcode = "600199";
      }
      mjo.subcode = subcode;
      mjo.invoice_code = res_vouh[0].code;
      mjo.invoice_id = id;
      mjo.org_id = orgId;
      productId_in = productId_in + "'" + mjo.productId + "',";
    }
    productId_in = productId_in.substring(0, productId_in.length - 1);
    let priceQry = extrequire("SCMSA.sainvoice.priceQry");
    var paramPriceQry = { productId_in: productId_in, orgcode: "1001" }; //取实业公司（B）的调价单
    let priceResMap = priceQry.execute(context, paramPriceQry);
    try {
      let vou01_param1 = context;
      let vou01_param2 = { res_voub: res_voub, priceResMap: priceResMap, config: config, vouindex: 1 };
      let pushVou01Func = extrequire("SCMSA.sainvoice.voucher01");
      let vou01_res = pushVou01Func.execute(vou01_param1, vou01_param2);
      var vou01_ResJo = vou01_res.voures;
      if (vou01_ResJo.code != 200) {
        throw new Error("01生成贸易公司（C）对实业公司（B）的应付凭证凭证异常：" + vou01_ResJo.message);
      }
      let vou02_param1 = context;
      let vou02_param2 = { res_voub: res_voub, priceResMap: priceResMap, config: config, vouindex: 2 };
      let pushVou02Func = extrequire("SCMSA.sainvoice.voucher02");
      let vou02_res = pushVou02Func.execute(vou02_param1, vou02_param2);
      var vou02_ResJo = vou02_res.voures; //推凭证保存后返回值
      if (vou02_ResJo.code != 200) {
        throw new Error("02生成实业公司（B）对贸易公司（C）的应收凭证异常：" + vou02_ResJo.message);
      }
    } catch (error) {
      //报异常之后，查询生成的凭证然后依次删除
      let deldataparam2 = { csaleinvoiceid: id };
      let func = extrequire("SCMSA.sainvoice.delAfterError");
      let res = func.execute(context, deldataparam2);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });