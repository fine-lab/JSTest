let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let qianshouri = request.qianshouri;
    qianshouri = substring(qianshouri, 0, 7);
    //查询需要生成应收数据
    let sql1 =
      "select ziduan2,dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ01 where dr=0" + " and qianshouri leftlike '" + qianshouri + "' and ziduan1='WB' group by ziduan2,dept_code";
    var res = ObjectStore.queryByYonQL(sql1);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });