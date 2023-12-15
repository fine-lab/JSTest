let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    var orgId = "1172";
    let sql = "select id from org.func.BaseOrgDefine where define1=" + orgId;
    let res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
    pdata.set("orgId", res[0].id + "");
    var saleInvoiceDetails = pdata.saleInvoiceDetails;
    for (var i = saleInvoiceDetails.length - 1; i >= 0; i--) {
      var productId = saleInvoiceDetails[i].productCode;
      let sql1 = "select id from pc.product.Product where code = '" + productId + "'";
      var res1 = ObjectStore.queryByYonQL(sql1, "productcenter");
      saleInvoiceDetails[i].set("productId", res1[0].id + "");
      var sourceid = saleInvoiceDetails[i].srcVoucherNo;
      let sql2 = "select sourceid from voucher.invoice.SaleInvoiceDetail where srcVoucherNo = '" + sourceid + "'";
      var res2 = ObjectStore.queryByYonQL(sql2, "udinghuo");
      throw new Error(res2[0].sourceid + "=============");
      saleInvoiceDetails[i].set("sourceid", res2[0].sourceid);
      var skuId = saleInvoiceDetails[i].skuId;
      let sql5 = "select id from pc.product.ProductSKU where productId='" + res1[0].id + "'";
      var res5 = ObjectStore.queryByYonQL(sql5, "productcenter");
      saleInvoiceDetails[i].set("skuId", res5[0].id + "");
      var sourceautoid = saleInvoiceDetails[i].srcVoucherNo;
      //先查主表id
      //来源单据号 从 res8里获取
      let sql6 = "select id from st.salesout.SalesOut where code = '" + sourceautoid + "'";
      var res6 = ObjectStore.queryByYonQL(sql6, "ustock");
      let sql7 = "select id from st.salesout.SalesOuts where mainid=" + res6[0].id;
      var res7 = ObjectStore.queryByYonQL(sql7, "ustock");
      saleInvoiceDetails[i].set("sourceautoid", res7[0].id);
    }
  }
}
return {};
exports({ entryPoint: MyTrigger });