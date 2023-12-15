let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var id = request.id;
    var useqty = request.useqty; //领用数量
    var surplusqty = request.surplusqty; //剩余数量
    var sign = "未签字"; //是否已签字
    var url = "GT21859AT11.GT21859AT11.team_wh_detail1";
    var object = {
      id: id,
      sign: sign,
      surplusqty: surplusqty,
      subTable: [
        { hasDefaultInit: true, id: id, _status: "Insert" },
        { id: id, _status: "Delete" }
      ]
    };
    var res = ObjectStore.updateById(url, object);
    if (res != undefined) {
      //更新食堂库相关信息
      var yurl = "GT21859AT11.GT21859AT11.canteen_wh_detail1";
      //食堂库主键id，暂时写死，私有化之后优化
      var id = "youridHere";
      var whsql = 'select * from GT21859AT11.GT21859AT11.canteen_wh_detail1 where id = "' + id + '"';
      var whres = ObjectStore.queryByYonQL(whsql);
      if (whres != null && whres.length > 0) {
        var wcurrentqty = parseFloat(whres[0].currentqty) + parseFloat(useqty);
        var wtaxamount = parseFloat(whres[0].taxunitprice) * parseFloat(wcurrentqty);
        var wnotaxamount = parseFloat(whres[0].notaxunitprice) * parseFloat(wcurrentqty);
        var yobject = {
          id: id,
          currentqty: wcurrentqty,
          taxamount: wtaxamount,
          notaxamount: wnotaxamount,
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