let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var csaleinvoiceid = param.csaleinvoiceid; //销售发票主键
    //查询凭证日志表
    var logVoucherQrySql = "select voucherid,id,pubts from AT169CA8FC09A00003.AT169CA8FC09A00003.pushVoucherLog " + " where csaleinvoiceid = '" + csaleinvoiceid + "' ";
    var resVoucherlogs = ObjectStore.queryByYonQL(logVoucherQrySql, "developplatform");
    var sumVoucher = resVoucherlogs.length;
    if (sumVoucher > 0) {
      for (let n = 0; n < sumVoucher; n++) {
        var voucherid = resVoucherlogs[n].voucherid; //凭证主键
        //查询该凭证是否存在
        var vousql = "select id from egl.voucher.VoucherBO where id = '" + voucherid + "' ";
        var vouRes = ObjectStore.queryByYonQL(vousql, "yonbip-fi-egl");
        //凭证存在，删除之
        if (vouRes.length > 0) {
          //删凭证报文
          let body_del = {
            ids: [resVoucherlogs[n].voucherid]
          };
          //删凭证
          let delVouUrl = "https://www.example.com/";
          let delVouRes = openLinker("POST", delVouUrl, "GL", JSON.stringify(body_del));
          var delVouRes_jo = JSON.parse(delVouRes);
        }
        delete resVoucherlogs[n].voucherid;
        //删除凭证日志记录
        let voucherLogDelUrl = "https://www.example.com/";
        let resDelLog = openLinker("POST", voucherLogDelUrl, "AT169CA8FC09A00003", JSON.stringify(resVoucherlogs[n]));
        var resDelLog_jo = JSON.parse(resDelLog);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });