let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //会计期
    let qianshouri = request.qianshouri;
    let hth = request.hth;
    qianshouri = substring(qianshouri, 0, 7);
    //查询需要生成应收数据
    //原始报告与已作废
    let sql1 = "";
    //已冲销与已更新
    let sql2 = "";
    if (isEmpty(hth)) {
      sql1 =
        "select ziduan2,dept_code,sum(baogaojine) from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and document_status in ('1','2') and dept_code!='DZB' and qianshouri leftlike '" +
        qianshouri +
        "' group by ziduan2,dept_code";
      sql2 =
        "select ziduan2,dept_code,sum(baogaojine) from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and document_status in ('3','4') and dept_code!='DZB' and update_data leftlike '" +
        qianshouri +
        "' group by ziduan2,dept_code";
    } else {
      sql1 =
        "select ziduan2,dept_code,sum(baogaojine) from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and document_status in ('1','2') and dept_code!='DZB' and ziduan2='" +
        hth +
        "' and qianshouri leftlike '" +
        qianshouri +
        "' group by ziduan2,dept_code";
      sql2 =
        "select ziduan2,dept_code,sum(baogaojine) from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and document_status in ('3','4') and dept_code!='DZB' and ziduan2='" +
        hth +
        "' and update_data leftlike '" +
        qianshouri +
        "' group by ziduan2,dept_code";
    }
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
    function isEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });