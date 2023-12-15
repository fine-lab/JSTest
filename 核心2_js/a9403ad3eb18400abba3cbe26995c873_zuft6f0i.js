let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let orderNo = request.cCode; //u8采购订单号
      let sql = "";
      sql =
        "select count(0) count from AT1767B4C61D580001.AT1767B4C61D580001.PO_Pomain a inner join AT1767B4C61D580001.AT1767B4C61D580001.rdrecord_01 b on a.OrderON=b.POPomainCodeU8 where OrderON='" +
        orderNo +
        "' and b.dr=0";
      //判断是否下推
      let res = ObjectStore.queryByYonQL(sql);
      if (res[0].count == 0) {
        sql = "select id from AT1767B4C61D580001.AT1767B4C61D580001.PO_Pomain where OrderON='" + orderNo + "'";
        let res1 = ObjectStore.queryByYonQL(sql);
        let res2 = null;
        if (res1.length > 0) {
          var object = { id: res1[0].id };
          res2 = ObjectStore.deleteById("AT1767B4C61D580001.AT1767B4C61D580001.PO_Pomain", object, "yb30647a2f"); //POPomainCodeU8   OrderON
        }
        return {
          code: 0,
          msg: "",
          data: res2
        };
      } else {
        return {
          code: 200,
          msg: "采购订单号[" + orderNo + "]已下推YS采购入库不可删除",
          data: null
        };
      }
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