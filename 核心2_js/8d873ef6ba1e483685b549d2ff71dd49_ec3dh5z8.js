let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function setTitle() {
      var returnData = new Array();
      var title1 = new Array();
      title1.push("FK");
      title1.push("KD_JENIS_TRANSAKSI");
      title1.push("FG_PENGGANTI");
      title1.push("NOMOR_FAKTUR");
      title1.push("MASA_PAJAK");
      title1.push("TAHUN_PAJAK");
      title1.push("TANGGAL_FAKTUR");
      title1.push("NPWP");
      title1.push("NAMA");
      title1.push("ALAMAT_LENGKAP");
      title1.push("JUMLAH_DPP");
      title1.push("JUMLAH_PPN");
      title1.push("JUMLAH_PPNBM");
      title1.push("ID_KETERANGAN_TAMBAHAN");
      title1.push("FG_UANG_MUKA");
      title1.push("UANG_MUKA_DPP");
      title1.push("UANG_MUKA_PPN");
      title1.push("UANG_MUKA_PPNBM");
      title1.push("REFERENSI");
      title1.push("KODE_DOKUMEN_PENDUKUNG");
      returnData.push(title1);
      var title2 = new Array();
      title2.push("LT");
      title2.push("NPWP");
      title2.push("NAMA");
      title2.push("JALAN");
      title2.push("BLOK");
      title2.push("NOMOR");
      title2.push("RT");
      title2.push("RW");
      title2.push("KECAMATAN");
      title2.push("KELURAHAN");
      title2.push("KABUPATEN");
      title2.push("PROPINSI");
      title2.push("KODE_POS");
      title2.push("NOMOR_TELEPON");
      returnData.push(title2);
      var title3 = new Array();
      title3.push("OF");
      title3.push("KODE_OBJEK");
      title3.push("NAMA");
      title3.push("HARGA_SATUAN");
      title3.push("JUMLAH_BARANG");
      title3.push("HARGA_TOTAL");
      title3.push("DISKON");
      title3.push("DPP");
      title3.push("PPN");
      title3.push("TARIF_PPNBM");
      title3.push("PPNBM");
      returnData.push(title3);
      return returnData;
    }
    var returnData = setTitle();
    var ids = request.ids;
    for (var i = 0; i < ids.length; i++) {
      //查询销售发票得税种档案
      let hRefName = null;
      let taxNo = null;
      //查询销售发票自定义项
      let queryHdef = "select saleInvoiceDefineCharacter,code,vouchdate,invAgentId,invAgentName,invAgentTaxNo,invAgentAdress,oriMoney from voucher.invoice.SaleInvoice where id='" + ids[i] + "'";
      let hdefRes = ObjectStore.queryByYonQL(queryHdef, "udinghuo");
      if (hdefRes[0].saleInvoiceDefineCharacter && hdefRes[0].saleInvoiceDefineCharacter.attrext1_name) {
        //根据自定义项主键查询自定义档案
        hRefName = hdefRes[0].saleInvoiceDefineCharacter.attrext1_name;
      }
      if (hdefRes[0].saleInvoiceDefineCharacter && hdefRes[0].saleInvoiceDefineCharacter.attrext4_fapiaoshuihao) {
        //根据自定义项主键查询客开的税票号码
        let oldTax = hdefRes[0].saleInvoiceDefineCharacter.attrext4_fapiaoshuihao; //需将税号中的.和-都替换掉
        if (oldTax != null) {
          var oldTax1 = replace(oldTax, ".", "");
          var oldTax2 = replace(oldTax1, "-", "");
          taxNo = oldTax2;
        }
      }
      let returnBody = new Array();
      let allMG = 0;
      let allLJ = 0;
      //查询销售发票子表信息
      let queryBodySql =
        "select productId,productCode,productName,oriUnitPrice,priceQty,oriMoney,lineDiscountMoney,oriTax,taxRate,salePrice from voucher.invoice.SaleInvoiceDetail where mainid=" + ids[i];
      var bodyRes = ObjectStore.queryByYonQL(queryBodySql, "udinghuo");
      if (bodyRes.length > 0) {
        for (var j = 0; j < bodyRes.length; j++) {
          //查询物料自定义项
          let queryBdef = "select productCharacterDef,id from pc.product.Product where id='" + bodyRes[j].productId + "'";
          var bdefRes = ObjectStore.queryByYonQL(queryBdef, "udinghuo");
          let TARIF_PPNBMValue = 0;
          if (bdefRes[0].productCharacterDef && bdefRes[0].productCharacterDef.attrext16_name) {
            //查询物料档案的明贵品级别
            TARIF_PPNBMValue = bdefRes[0].productCharacterDef.attrext16_name;
          }
          let ofbody = new Array();
          ofbody.push("OF");
          var KODE_OBJEK = j + 1;
          if (KODE_OBJEK < 10) {
            KODE_OBJEK = "00" + KODE_OBJEK;
          } else if (KODE_OBJEK < 100) {
            KODE_OBJEK = "0" + KODE_OBJEK;
          }
          var newKODE_OBJEK = hRefName + KODE_OBJEK;
          ofbody.push(newKODE_OBJEK); //税种编码+三位序号
          ofbody.push(bodyRes[j].productName); //商品名称
          if (bodyRes[j].lineDiscountMoney > 0) {
            //存在折扣
            let salePriceValue = bodyRes[j].salePrice; //含税报价
            let taxRateValue = bodyRes[j].taxRate; //税率
            let newPrice = MoneyFormatReturnBd(salePriceValue / (1 + taxRateValue / 100), 2); //折扣前无税单价
            let newMoney = MoneyFormatReturnBd(newPrice * bodyRes[j].priceQty, 2); //折扣前无税金额
            ofbody.push(newPrice); //无税单价
            ofbody.push(bodyRes[j].priceQty); //件数(计价数量)
            ofbody.push(newMoney); //金额(无税金额)
            ofbody.push(bodyRes[j].lineDiscountMoney); //折扣(扣额)
            ofbody.push(bodyRes[j].oriMoney); //税额基数(无税金额-扣额)
            if (TARIF_PPNBMValue == 0) {
              allLJ = allLJ + bodyRes[j].oriTax;
              ofbody.push(bodyRes[j].oriTax); //税额(廉价)
              ofbody.push(TARIF_PPNBMValue); //明贵品级别
              ofbody.push(0); //税额(名贵品)
            } else {
              allMG = allMG + bodyRes[j].oriTax;
              ofbody.push(0); //税额(廉价)
              ofbody.push(TARIF_PPNBMValue); //明贵品级别
              ofbody.push(bodyRes[j].oriTax); //税额(名贵品)
            }
          } else {
            //未使用折扣
            ofbody.push(bodyRes[j].oriUnitPrice); //无税单价
            ofbody.push(bodyRes[j].priceQty); //件数(计价数量)
            ofbody.push(bodyRes[j].oriMoney); //金额(无税金额)
            ofbody.push(bodyRes[j].lineDiscountMoney); //折扣(扣额)
            ofbody.push(bodyRes[j].oriMoney); //税额基数(无税金额)
            if (TARIF_PPNBMValue == 0) {
              allLJ = allLJ + bodyRes[j].oriTax;
              ofbody.push(bodyRes[j].oriTax); //税额(廉价)
              ofbody.push(TARIF_PPNBMValue); //明贵品级别
              ofbody.push(0); //税额(名贵品)
            } else {
              allMG = allMG + bodyRes[j].oriTax;
              ofbody.push(0); //税额(廉价)
              ofbody.push(TARIF_PPNBMValue); //明贵品级别
              ofbody.push(bodyRes[j].oriTax); //税额(名贵品)
            }
          }
          returnBody.push(ofbody);
        }
      }
      let codeValue = hdefRes[0].code;
      let vouchdateValue = hdefRes[0].vouchdate.substr(0, 10).split("-");
      let fkbody = new Array();
      fkbody.push("FK");
      if (hRefName != null) {
        fkbody.push(hRefName.substr(0, hRefName.length - 1)); //税种档案名称截取前两位
        fkbody.push(hRefName.substr(hRefName.length - 1, 1)); //税种档案名称截取最后一位
      } else {
        fkbody.push("");
        fkbody.push("");
      }
      fkbody.push(taxNo); //税票号(客开的税票号码)
      fkbody.push(vouchdateValue[1]); //发票月
      fkbody.push(vouchdateValue[0]); //发票年
      fkbody.push(vouchdateValue[2] + "/" + vouchdateValue[1] + "/" + vouchdateValue[0]); //发票日期(单据日期)
      fkbody.push(hdefRes[0].invAgentTaxNo); //开票客户纳税人识别号
      fkbody.push(hdefRes[0].invAgentName); //开票客户名称
      fkbody.push(hdefRes[0].invAgentAdress); //开票客户纳税人地址
      fkbody.push(Math.floor(hdefRes[0].oriMoney)); //不含税金额--舍位只要整数
      fkbody.push(Math.floor(allLJ)); //税额(廉价)--舍位只要整数
      fkbody.push(Math.floor(allMG)); //税额(名贵品)--舍位只要整数
      if (hdefRes[0].saleInvoiceDefineCharacter && hdefRes[0].saleInvoiceDefineCharacter.attrext2) {
        fkbody.push(hdefRes[0].attrext2); //名贵品解释号
      } else {
        fkbody.push(0); //名贵品解释号
      }
      fkbody.push(0); //订金
      fkbody.push(0); //不含税订金
      fkbody.push(0); //订金税(廉价)
      fkbody.push(0); //订金税(名贵品)
      fkbody.push(codeValue); //系统发票号(单据编号)
      if (hdefRes[0].saleInvoiceDefineCharacter && hdefRes[0].saleInvoiceDefineCharacter.attrext3) {
        fkbody.push(hdefRes[0].saleInvoiceDefineCharacter.attrext3); //新增加文本字段
      } else {
        fkbody.push(0); //新增加文本字段
      }
      returnData.push(fkbody);
      for (var k = 0; k < returnBody.length; k++) {
        returnData.push(returnBody[k]);
      }
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });