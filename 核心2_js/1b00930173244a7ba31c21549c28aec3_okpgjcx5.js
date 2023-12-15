let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var id = request.data.id;
    var useqty = request.data.useqty; //使用数量
    var sign = "未签字"; //是否已签字
    var url = "GT21859AT11.GT21859AT11.consume_detail1";
    var object = {
      id: id,
      sign: sign,
      subTable: [
        { hasDefaultInit: true, id: id, _status: "Insert" },
        { id: id, _status: "Delete" }
      ]
    };
    var res = ObjectStore.updateById(url, object);
    if (res != undefined) {
      //更新班组库相关信息
      var yurl = "GT21859AT11.GT21859AT11.team_wh_detail1";
      //班组库主键id，暂时写死，私有化之后优化
      var id = "youridHere";
      var thsql = 'select * from GT21859AT11.GT21859AT11.team_wh_detail1 where id = "' + id + '"';
      var thres = ObjectStore.queryByYonQL(thsql);
      if (thres != null && thres.length > 0) {
        var tsurplusqty = parseFloat(thres[0].surplusqty) + parseFloat(useqty);
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