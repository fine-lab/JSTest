let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var returnData = new Array();
    var title = new Array();
    title.push("OB");
    title.push("KODE_OBJEK");
    title.push("NAMA");
    title.push("HARGA_SATUAN");
    returnData.push(title);
    var ids = request.ids;
    for (var i = 0; i < ids.length; i++) {
      //查询销售出库单价编码
      let queryCodeSql = "select code from voucher.invoice.SaleInvoice where id=" + ids[i];
      let codeRes = ObjectStore.queryByYonQL(queryCodeSql, "udinghuo");
      let codeValue = codeRes[0].code;
      //查询销售出库子表信息
      let queryBodySql = "select productCode,productName,oriUnitPrice from voucher.invoice.SaleInvoiceDetail where mainid=" + ids[i];
      var bodyRes = ObjectStore.queryByYonQL(queryBodySql, "udinghuo");
      if (bodyRes.length > 0) {
        for (var j = 0; j < bodyRes.length; j++) {
          let body = new Array();
          body.push("OB"); //固定
          body.push(bodyRes[j].productCode); //商品编码
          body.push(bodyRes[j].productName); //商品名称
          body.push(bodyRes[j].oriUnitPrice + ""); //无税单价
          returnData.push(body);
        }
      }
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });