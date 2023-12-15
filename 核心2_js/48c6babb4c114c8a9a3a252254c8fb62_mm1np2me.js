let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    //获取销售订单的单据日期
    var sql = "select vouchdate from 	voucher.order.Order where id=" + data.id;
    let res = ObjectStore.queryByYonQL(sql);
    //获取销售订单的合同失效日期
    var sql2 = "select * from voucher.order.OrderFreeDefine where id=" + data.id;
    let res2 = ObjectStore.queryByYonQL(sql2);
    if (res && res.length > 0 && res2 && res2.length > 0) {
      let vouchdate = res[0].vouchdate;
      let expiryDate = res2[0].define4;
      if (vouchdate && expiryDate) {
        vouchdate = Date.parse(vouchdate);
        expiryDate = Date.parse(expiryDate);
        if (!isNaN(vouchdate) && !isNaN(expiryDate)) {
          if (vouchdate > expiryDate) {
            throw new Error("合同失效，订单提交失败");
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });