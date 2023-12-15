let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pageNum = 0;
    let pageSize = 1000;
    let voucherLog = ObjectStore.queryByYonQL("select idx from AT1703B12408A00002.AT1703B12408A00002.CopyVoucherForChk1125 order by idx desc limit 1  ", "developplatform");
    if (voucherLog.length > 0) {
      pageNum = voucherLog[0].idx + 1;
    }
    for (var i = 0; i < 2; i++) {
      let voucherSql =
        "select id as voucherId " +
        " from egl.voucher.VoucherBO " +
        " where voucherStatus in('03','04') " + // voucherStatus='03' " // TEM_SAVE("00", "暂存", ""), SAVE("01", "保存", ""), MISTASK("02", "标错", ""), AUDIT("03", "审核", ""), TALLY("04", "记账", ""), OBSOLETED("05", "作废", "");
        " order by ts asc,id asc limit " +
        pageNum +
        "," +
        pageSize;
      let voucherRst = ObjectStore.queryByYonQL(voucherSql, "yonbip-fi-egl");
      if (voucherRst != null && voucherRst.length > 0) {
        for (var j in voucherRst) {
          voucherRst[j].idx = pageNum;
        }
        ObjectStore.insertBatch("AT1703B12408A00002.AT1703B12408A00002.CopyVoucherForChk1125", voucherRst, "ybceb7299e");
      } else {
        return {};
      }
      pageNum = pageNum + 1;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });