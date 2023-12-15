let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var OddNumbers = request.OddNumbers;
    var clsql = "select * from pu.purchaseorder.PurchaseOrder where code = '" + OddNumbers + "'";
    var res = ObjectStore.queryByYonQL(clsql, "upu");
    if (res.length == 0) {
      //根据采购订单号查出需要清除是；表头或者表体；
      var sqlOne = "select id from AT15F164F008080007.AT15F164F008080007.BOMImport where caigoudingdanhao ='" + OddNumbers + "'";
      var resOne = ObjectStore.queryByYonQL(sqlOne);
      //查询表头
      var sqlTwo = "select id from AT15F164F008080007.AT15F164F008080007.DetectOrder where caigoudingdanhao ='" + OddNumbers + "'";
      var resTwo = ObjectStore.queryByYonQL(sqlTwo);
      if (resOne.length != 0) {
        var BillNo = {};
        BillNo.BodyList = resOne;
        BillNo.type = true;
        return { BillNo };
      } else if (resTwo.length != 0 && resOne.length == 0) {
        var BillNo = {};
        BillNo.BodyList = resTwo;
        BillNo.type = false;
        return { BillNo };
        var zid = resTwo[0].id;
        var object = { id: zid, caigoudingdanhao: "" };
        var resThre = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DetectOrder", object, "71a4dca4");
      } else {
        throw new Error(" -- 该单号不存在,无法清除该采购订单号 -- ");
      }
    } else {
      throw new Error(" -- 请先删除对应的【采购订单】 -- ");
    }
    return { resThre };
  }
}
exports({ entryPoint: MyAPIHandler });