let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var canteen_query_id = request.mainid; //主表主键
    var id = request.data.id; //主键
    var sign = "已签字"; //签字
    var productcode = request.data.productcode; //物料编码
    var productname = request.data.productname; //物料名称
    var specs = request.data.specs; //规格
    var unitname = request.data.unitname; //计量单位
    var useqty = request.data.surplusqty; //领用数量
    var surplusqty = request.data.surplusqty; //剩余数量
    var taxunitprice = request.data.taxunitprice; //含税单价
    var taxamount = request.data.taxamount; //含税金额
    var foodcategory = request.data.foodcategory; //食品类别
    var notaxunitprice = request.data.notaxunitprice; //无税单价
    var notaxamount = request.data.notaxamount; //无税金额
    var usedate = request.data.usedate; //领用日期
    var useteam = request.data.useteam; //领用班组
    var planno = request.data.planno; //计划编号
    var memo = request.data.memo; //备注
    var url = "GT21859AT11.GT21859AT11.team_wh_detail1";
    var object = {
      canteen_query_id: canteen_query_id,
      sign: sign,
      productcode: productcode,
      productname: productname,
      specs: specs,
      unitname: unitname,
      useqty: useqty,
      surplusqty: surplusqty,
      taxunitprice: taxunitprice,
      taxamount: taxamount,
      foodcategory: foodcategory,
      notaxunitprice: notaxunitprice,
      notaxamount: notaxamount,
      usedate: usedate,
      useteam: useteam,
      planno: planno,
      memo: memo,
      subTable: [{ key: "yourkeyHere" }]
    };
    var res = ObjectStore.insert(url, object, "97597202");
    if (res != undefined) {
      var yobject = {
        id: id,
        surplusqty: 0,
        subTable: [
          { hasDefaultInit: true, id: id, _status: "Insert" },
          { id: id, _status: "Delete" }
        ]
      };
      var yres = ObjectStore.updateById(url, yobject);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });