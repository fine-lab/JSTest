let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    //查询主表主键id
    var sql = "select max(id) from GT21859AT11.GT21859AT11.canteen_query";
    var res = ObjectStore.queryByYonQL(sql);
    if (res != null && res.length > 0) {
      var id = res[0].id;
      var sign = "已签字"; //签字
      var instockdate = request.data.instockdate; //入库日期
      var productcode = request.data.productcode; //物料编码
      var productname = request.data.productname; //物料名称
      var specs = request.data.specs; //规格
      var unitname = request.data.unitname; //计量单位
      var qty = request.data.qty; //入库数量
      var currentqty = request.data.currentqty; //库存数量
      var taxunitprice = request.data.taxunitprice; //含税单价
      var taxamount = request.data.taxamount; //含税金额
      var foodcategory = request.data.foodcategory; //食品类别
      var notaxunitprice = request.data.notaxunitprice; //无税单价
      var notaxamount = request.data.notaxamount; //无税金额
      var planno = request.data.planno; //计划编号
      var reserveno = request.data.reserveno; //收货单号
      var memo = request.data.memo; //备注
      var url = "GT21859AT11.GT21859AT11.canteen_wh_detail1";
      var object = {
        canteen_wh_detail1Fk: id,
        sign: sign,
        instockdate: instockdate,
        productcode: productcode,
        productname: productname,
        specs: specs,
        unitname: unitname,
        qty: qty,
        currentqty: currentqty,
        taxunitprice: taxunitprice,
        taxamount: taxamount,
        foodcategory: foodcategory,
        notaxunitprice: notaxunitprice,
        notaxamount: notaxamount,
        planno: planno,
        reserveno: reserveno,
        memo: memo,
        subTable: [{ key: "yourkeyHere" }]
      };
      var res = ObjectStore.insert(url, object, "97597202");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });