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
        let queryMerDef = "select * from aa.merchant.Merchant where id='" + codeRes[0].invAgentId + "'";
        let merDefRes = ObjectStore.queryByYonQL(queryMerDef, "productcenter");
        if (merDefRes.length > 0 && merDefRes[0].merchantCharacter) {
          body.push(merDefRes[0].merchantCharacter.attrext5 == null ? "JALAN" : merDefRes[0].merchantCharacter.attrext5); //路
          body.push(merDefRes[0].merchantCharacter.attrext6 == null ? "BLOK" : merDefRes[0].merchantCharacter.attrext6); //层
          body.push(merDefRes[0].merchantCharacter.attrext7 == null ? "NOMOR" : merDefRes[0].merchantCharacter.attrext7); //门牌号
          body.push(merDefRes[0].merchantCharacter.attrext8 == null ? "RT" : merDefRes[0].merchantCharacter.attrext8); //区号
          body.push(merDefRes[0].merchantCharacter.attrext9 == null ? "RW" : merDefRes[0].merchantCharacter.attrext9); //区号
          body.push(merDefRes[0].merchantCharacter.attrext10 == null ? "KECAMATAN" : merDefRes[0].merchantCharacter.attrext10); //区
          body.push(merDefRes[0].merchantCharacter.attrext11 == null ? "KELURAHAN" : merDefRes[0].merchantCharacter.attrext11); //乡区
          body.push(merDefRes[0].merchantCharacter.attrext12 == null ? "KABUPATEN" : merDefRes[0].merchantCharacter.attrext12); //摄政岗
          body.push(merDefRes[0].merchantCharacter.attrext13 == null ? "PROPINSI" : merDefRes[0].merchantCharacter.attrext13); //省
          body.push(merDefRes[0].merchantCharacter.attrext14 == null ? "KODE_POS" : merDefRes[0].merchantCharacter.attrext14); //邮政编码
          body.push(merDefRes[0].merchantCharacter.attrext15 == null ? "NOMOR_TELEPON" : merDefRes[0].merchantCharacter.attrext15); //电话号
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