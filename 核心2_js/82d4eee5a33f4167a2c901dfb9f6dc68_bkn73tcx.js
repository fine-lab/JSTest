let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let qianshouri = request.qianshouri;
    qianshouri = substring(qianshouri, 0, 7);
    //查询需要生成应收数据
    let sql1 =
      "select ziduan2,is_supplement,dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ01 where dr=0" +
      " and is_supplement='1' and settlement_data leftlike '" +
      qianshouri +
      "' group by ziduan2,is_supplement,dept_code";
    let sql2 =
      "select ziduan2,is_supplement,dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ01 where dr=0" +
      " and is_supplement='0' and qianshouri leftlike '" +
      qianshouri +
      "'  group by ziduan2,is_supplement,dept_code";
    var res = ObjectStore.queryByYonQL(sql1);
    var res2 = ObjectStore.queryByYonQL(sql2);
    if (res.length == 0) {
      if (res2.length != 0) {
        res = res2;
      }
    } else {
      if (res2.length > 0) {
        res = res.concat(res2);
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });