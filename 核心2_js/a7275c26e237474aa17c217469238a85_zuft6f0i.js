let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let orderNo = request.cCode; //u8采购订单号
      let sql = "";
      let rep = {
        code: 0,
        msg: ""
      };
      sql =
        "select count(0) count from AT1767B4C61D580001.AT1767B4C61D580001.PO_Pomain a inner join AT1767B4C61D580001.AT1767B4C61D580001.rdrecord_01 b on a.OrderON=b.POPomainCodeU8 where OrderON='" +
        orderNo +
        "'  and b.dr=0";
      //判断是否下推
      let res = ObjectStore.queryByYonQL(sql);
      if (res[0].count == 0) {
        var updateWrapper = new Wrapper();
        updateWrapper.eq("OrderON", orderNo);
        // 待更新字段内容
        var toUpdate = {
          VyState: "已同步U8已弃审"
        };
        res = ObjectStore.update("AT1767B4C61D580001.AT1767B4C61D580001.PO_Pomain", toUpdate, updateWrapper, "yb30647a2f");
      } else {
        rep.code = 200;
        rep.msg = "采购订单号[" + orderNo + "]已下推YS采购入库不可弃审";
      }
      return rep;
    } catch (e) {
      return {
        code: 500,
        msg: e.message,
        data: null
      };
    }
  }
}
exports({ entryPoint: MyAPIHandler });