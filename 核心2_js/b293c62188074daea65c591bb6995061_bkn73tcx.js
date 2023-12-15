let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let qianshouri = request.qianshouri;
    qianshouri = substring(qianshouri, 0, 7);
    let result = [];
    //查询需要生成应收数据
    let sql1 =
      "select ziduan2,is_supplement,dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ01 where dr=0" +
      " and settlement_data leftlike '" +
      qianshouri +
      "' group by ziduan2,is_supplement,dept_code";
    let sql2 =
      "select ziduan2,is_supplement,dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ01 where dr=0" +
      " and qianshouri leftlike '" +
      qianshouri +
      "' group by ziduan2,is_supplement,dept_code";
    var res = ObjectStore.queryByYonQL(sql1);
    var newRes = new Array();
    if (res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].is_supplement == "1") {
          newRes.push(res[i]);
        }
      }
    }
    var res2 = ObjectStore.queryByYonQL(sql2);
    var newRes2 = new Array();
    if (res.length > 0) {
      for (var j = 0; j < res2.length; j++) {
        if (res2[j].is_supplement == "0") {
          newRes2.push(res2[j]);
        }
      }
    }
    if (newRes.length == 0) {
      if (newRes2.length != 0) {
        newRes = newRes2;
      }
    } else {
      if (newRes2.length > 0) {
        newRes = newRes.concat(newRes2);
      }
    }
    return { newRes };
  }
}
exports({ entryPoint: MyAPIHandler });