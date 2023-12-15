let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var canteen_query_id = request.mainid; //主表主键
    var sign = "已签字"; //签字
    var productcode = request.data.productcode; //物料编码
    var productname = request.data.productname; //物料名称
    var specs = request.data.specs; //规格
    var unitname = request.data.unitname; //计量单位
    var useqty = request.data.useqty; //使用数量
    var taxunitprice = request.data.taxunitprice; //含税单价
    var taxamount = request.data.taxamount; //含税金额
    var foodcategory = request.data.foodcategory; //食品类别
    var nottaxunitprice = request.data.nottaxunitprice; //无税单价
    var notaxamount = request.data.notaxamount; //无税金额
    var mealtype = request.data.mealtype; //餐别
    var team = request.data.team; //班组
    var usedate = request.data.usedate; //使用日期
    var planno = request.data.planno; //计划编号
    var id = request.data.id; //主键
    var memo = request.data.memo; //备注
    var url = "GT21859AT11.GT21859AT11.consume_detail1";
    var res = null;
    var csql = 'select * from GT21859AT11.GT21859AT11.consume_detail1 where id = "' + id + '"';
    var cres = ObjectStore.queryByYonQL(csql);
    if (cres != null && cres.length > 0) {
      id = cres[0].id;
      var yobject = {
        id: id,
        canteen_query_id: canteen_query_id,
        sign: sign,
        productcode: productcode,
        productname: productname,
        specs: specs,
        unitname: unitname,
        useqty: useqty,
        taxunitprice: taxunitprice,
        taxamount: taxamount,
        foodcategory: foodcategory,
        nottaxunitprice: nottaxunitprice,
        notaxamount: notaxamount,
        mealtype: mealtype,
        team: team,
        usedate: usedate,
        planno: planno,
        memo: memo,
        subTable: [
          { hasDefaultInit: true, id: id, _status: "Insert" },
          { id: id, _status: "Delete" }
        ]
      };
      res = ObjectStore.updateById(url, yobject);
    } else {
      var object = {
        canteen_query_id: canteen_query_id,
        sign: sign,
        productcode: productcode,
        productname: productname,
        specs: specs,
        unitname: unitname,
        useqty: useqty,
        taxunitprice: taxunitprice,
        taxamount: taxamount,
        foodcategory: foodcategory,
        nottaxunitprice: nottaxunitprice,
        notaxamount: notaxamount,
        mealtype: mealtype,
        team: team,
        usedate: usedate,
        planno: planno,
        memo: memo,
        subTable: [{ key: "yourkeyHere" }]
      };
      res = ObjectStore.insert(url, object, "97597202");
    }
    if (res != undefined) {
      //更新班组库相关信息
      var yurl = "GT21859AT11.GT21859AT11.team_wh_detail1";
      //班组库主键id，暂时写死，私有化之后优化
      var id = "youridHere";
      var thsql = 'select * from GT21859AT11.GT21859AT11.team_wh_detail1 where id = "' + id + '"';
      var thres = ObjectStore.queryByYonQL(thsql);
      if (thres != null && thres.length > 0) {
        var tsurplusqty = parseFloat(thres[0].useqty) - parseFloat(useqty);
        var ttaxamount = parseFloat(thres[0].taxunitprice) * parseFloat(tsurplusqty);
        var tnotaxamount = parseFloat(thres[0].notaxunitprice) * parseFloat(tsurplusqty);
        var yobject = {
          id: id,
          surplusqty: tsurplusqty,
          taxamount: ttaxamount,
          notaxamount: tnotaxamount,
          subTable: [
            { hasDefaultInit: true, id: id, _status: "Insert" },
            { id: id, _status: "Delete" }
          ]
        };
        var yres = ObjectStore.updateById(yurl, yobject);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });