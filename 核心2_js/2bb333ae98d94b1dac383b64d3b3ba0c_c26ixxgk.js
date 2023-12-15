let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var returnData = new Array();
    var title = new Array();
    title.push("LT");
    title.push("NPWP");
    title.push("NAMA");
    title.push("JALAN");
    title.push("BLOK");
    title.push("NOMOR");
    title.push("RT");
    title.push("RW");
    title.push("KECAMATAN");
    title.push("KELURAHAN");
    title.push("KABUPATEN");
    title.push("PROPINSI");
    title.push("KODE_POS");
    title.push("NOMOR_TELEPON");
    returnData.push(title);
    var ids = request.ids;
    for (var i = 0; i < ids.length; i++) {
      //查询销售出库单价编码
      let queryCodeSql = "select code,invAgentId,invAgentName,invAgentTaxNo from voucher.invoice.SaleInvoice where id=" + ids[i];
      let codeRes = ObjectStore.queryByYonQL(queryCodeSql, "udinghuo");
      let codeValue = codeRes[0].code;
      let body = new Array();
      body.push("LT");
      body.push(codeRes[0].invAgentTaxNo); //开票客户纳税人识别号
      body.push(codeRes[0].invAgentName); //开票客户名称
      if (codeRes[0].invAgentId != null) {
        //开票客户id不为空
        let queryMerDef = "select * from aa.merchant.MerchantDefine where id=" + codeRes[0].invAgentId;
        let merDefRes = ObjectStore.queryByYonQL(queryMerDef, "productcenter");
        if (merDefRes.length > 0) {
          body.push(merDefRes[0].define1 == null ? "JALAN" : merDefRes[0].define1); //路
          body.push(merDefRes[0].define2 == null ? "BLOK" : merDefRes[0].define2); //层
          body.push(merDefRes[0].define3 == null ? "NOMOR" : merDefRes[0].define3); //门牌号
          body.push(merDefRes[0].define4 == null ? "RT" : merDefRes[0].define4); //区号
          body.push(merDefRes[0].define5 == null ? "RW" : merDefRes[0].define5); //区号
          body.push(merDefRes[0].define6 == null ? "KECAMATAN" : merDefRes[0].define6); //区
          body.push(merDefRes[0].define7 == null ? "KELURAHAN" : merDefRes[0].define7); //乡区
          body.push(merDefRes[0].define8 == null ? "KABUPATEN" : merDefRes[0].define8); //摄政岗
          body.push(merDefRes[0].define9 == null ? "PROPINSI" : merDefRes[0].define9); //省
          body.push(merDefRes[0].define10 == null ? "KODE_POS" : merDefRes[0].define10); //邮政编码
          body.push(merDefRes[0].define11 == null ? "NOMOR_TELEPON" : merDefRes[0].define11); //电话号
        } else {
          body.push("JALAN");
          body.push("BLOK");
          body.push("NOMOR");
          body.push("RT");
          body.push("RW");
          body.push("KECAMATAN");
          body.push("KELURAHAN");
          body.push("KABUPATEN");
          body.push("PROPINSI");
          body.push("KODE_POS");
          body.push("NOMOR_TELEPON");
        }
      } else {
        body.push("JALAN");
        body.push("BLOK");
        body.push("NOMOR");
        body.push("RT");
        body.push("RW");
        body.push("KECAMATAN");
        body.push("KELURAHAN");
        body.push("KABUPATEN");
        body.push("PROPINSI");
        body.push("KODE_POS");
        body.push("NOMOR_TELEPON");
      }
      returnData.push(body);
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });