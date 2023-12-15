let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let qianshouri = request.qianshouri;
    qianshouri = substring(qianshouri, 0, 7);
    let result = [];
    let hth = request.hth;
    let benqiclbSql1 = ""; //材料部sql
    let benqiclbSql2 = ""; //材料部sql
    let benqiSql1 = ""; //非材料部sql
    let benqiSql2 = ""; //非材料部sql
    if (request.hth == undefined) {
      benqiclbSql1 =
        "select ziduan2,'D'as dept_code, sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and dept_name like '材料部' and document_status in ('3','4')  and qianshouri!=null and update_data leftlike '" +
        qianshouri +
        "' group by ziduan2"; // 报告更新日;
      benqiclbSql2 =
        "select ziduan2,'D'as dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and dept_name like '材料部' and document_status in ('1','2') and qianshouri leftlike '" +
        qianshouri +
        "' group by ziduan2";
      benqiSql1 =
        "select ziduan2,dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and dept_code not in('JY','D','ZCCLB','44v0000012','ZQCLB')  and document_status in ('3','4') and qianshouri!=null and update_data leftlike '" +
        qianshouri +
        "' group by ziduan2,dept_code";
      benqiSql2 =
        "select ziduan2,dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and dept_code not in('JY','D','ZCCLB','44v0000012','ZQCLB') and document_status in ('1','2') and qianshouri leftlike '" +
        qianshouri +
        "' group by ziduan2,dept_code";
    } else {
      benqiclbSql1 =
        "select ziduan2,'D'as dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and dept_name like '材料部' and document_status in ('3','4') and ziduan2='" +
        hth +
        "' and qianshouri!=null  and update_data leftlike '" +
        qianshouri +
        "' group by ziduan2"; // 报告更新日;
      benqiclbSql2 =
        "select ziduan2,'D'as dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and dept_name like '材料部' and document_status in ('1','2') and ziduan2='" +
        hth +
        "' and qianshouri leftlike '" +
        qianshouri +
        "' group by ziduan2";
      benqiSql1 =
        "select ziduan2,dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and dept_code not in('JY','D','ZCCLB','44v0000012','ZQCLB') and document_status in ('3','4') and qianshouri!=null and ziduan2='" +
        hth +
        "'  and update_data leftlike '" +
        qianshouri +
        "' group by ziduan2,dept_code";
      benqiSql2 =
        "select ziduan2,dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and dept_code not in('JY','D','ZCCLB','44v0000012','ZQCLB') and document_status in ('1','2') and ziduan2='" +
        hth +
        "' and qianshouri leftlike '" +
        qianshouri +
        "' group by ziduan2,dept_code";
    }
    let benqiclb1 = ObjectStore.queryByYonQL(benqiclbSql1);
    let benqiclb2 = ObjectStore.queryByYonQL(benqiclbSql2);
    let benqi1 = ObjectStore.queryByYonQL(benqiSql1);
    let benqi2 = ObjectStore.queryByYonQL(benqiSql2);
    let zfSql = "";
    var newRes = new Array();
    benqiclb1.forEach((item) => {
      item.baogaojine = MoneyFormatReturnBd(item.baogaojine, 2);
      newRes.push(item);
    });
    benqiclb2.forEach((item) => {
      item.baogaojine = MoneyFormatReturnBd(item.baogaojine, 2);
      newRes.push(item);
    });
    benqi1.forEach((item) => {
      item.baogaojine = MoneyFormatReturnBd(item.baogaojine, 2);
      newRes.push(item);
    });
    benqi2.forEach((item) => {
      item.baogaojine = MoneyFormatReturnBd(item.baogaojine, 2);
      newRes.push(item);
    });
    const aMap = new Map();
    const arr = [];
    newRes.forEach((e) => {
      const ziduan2 = e.ziduan2;
      const dept_code = e.dept_code;
      const k = ziduan2 + "&" + dept_code;
      aMap.set(k, (aMap.get(k) || 0) + Number(e.baogaojine));
    });
    aMap.forEach((val, key) => {
      const item = {};
      item.ziduan2 = JSON.parse(split(key, "&", 2))[0];
      item.dept_code = JSON.parse(split(key, "&", 2))[1];
      item.baogaojine = MoneyFormatReturnBd(val, 2);
      arr.push(item);
    });
    newRes = arr;
    return { newRes };
  }
}
exports({ entryPoint: MyAPIHandler });