let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var startDate1 = request.startDate1;
    var object = {
      id: id
    };
    //实体查询
    var apply = ObjectStore.selectById("GT30659AT3.GT30659AT3.ssp_parter_apply_yy", object);
    if (apply.verifystate !== 2) {
      return {};
    }
    function addMonth(date, months) {
      if (months === undefined || months === "") months = 6;
      var newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + months);
      return newDate;
    }
    function format(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    }
    function nextYear() {
      var y = new Date().getFullYear() + 1;
      return y + "-03-31";
    }
    var startDate = format(new Date());
    if (startDate1) {
      startDate = startDate1;
    }
    var endDate;
    if (apply.certLevel === "00505") {
      endDate = format(addMonth(startDate, 3));
    } else {
      endDate = nextYear();
    }
    var object2 = { id: id, startDate: startDate, endDate: endDate };
    var res2 = ObjectStore.updateById("GT30659AT3.GT30659AT3.ssp_parter_apply_yy", object2);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });