let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var zid = request.id;
    //根据来源单据查询事项分录数据库查询凭证号
    var EventEntrysql = "select * from eaai.eventvoucher.EventVoucherDO where srcBillId = '" + zid + "' and dr = 0";
    var EventEntryres = ObjectStore.queryByYonQL(EventEntrysql, "yonbip-fi-eaai");
    return { EventEntryres };
    if (EventEntryres.length != 0) {
      //总账凭证ID
      var glVoucherNoId = EventEntryres[0].glVoucherId;
      //根据总账凭证查询凭证数据库查出(	凭证号显示字段)
      let pzsgl = "select displayName from egl.voucher.VoucherBO where id = '" + glVoucherNoId + "' and dr = 0";
      var pzres = ObjectStore.queryByYonQL(pzsgl, "yonbip-fi-egl");
      var glVoucherNoIdN = "";
      if (pzres.length != 0) {
        glVoucherNoIdN = pzres[0].displayName;
      } else {
        throw new Error("  -- 该凭证查询失败 -- ");
      }
      var object = { id: zid, isVoucher: "1", voucherNub: glVoucherNoIdN };
      var res = ObjectStore.updateById("AT17604A341D580008.AT17604A341D580008.Expense_sheet", object, "Expensesheet");
    } else {
      throw new Error("  -- 该凭证生成失败,请查看生成事项分录异常日志 -- ");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });