let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //部门编码
    let dept_code = request.dept_code;
    //会计期间
    let kjqj = substring(request.kjqj, 0, 7);
    //项目编号
    let projectCode = request.projectCode;
    let benqicjSql1 = "";
    let benqicjSql2 = "";
    let benqicjSql3 = "";
    let benqiqsSql1 = "";
    let benqiqsSql2 = "";
    let benqiqsSql3 = "";
    let benqizfsql = "";
    if (dept_code != "D") {
      benqicjSql1 =
        "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where dr=0 and ziduan2='" +
        projectCode +
        "'" +
        " and dept_code='" +
        dept_code +
        "' and document_status in('1','2') and baogaori leftlike '" +
        kjqj +
        "'";
      benqicjSql2 =
        "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where dr=0 and ziduan2='" +
        projectCode +
        "'" +
        " and dept_code='" +
        dept_code +
        "' and document_status in('3','4') and baogaori!=null and update_data leftlike '" +
        kjqj +
        "'";
      benqiqsSql1 =
        "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where dr=0 and ziduan2='" +
        projectCode +
        "'" +
        " and dept_code='" +
        dept_code +
        "' and document_status in('1','2') and qianshouri leftlike '" +
        kjqj +
        "'";
      benqiqsSql2 =
        "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where dr=0 and ziduan2='" +
        projectCode +
        "'" +
        " and dept_code='" +
        dept_code +
        "' and document_status in('3','4') and qianshouri!=null and update_data leftlike '" +
        kjqj +
        "'";
      benqizfsql =
        "select count(1) totbg,dept_code,baogaobianma,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and dept_code='" +
        dept_code +
        "' and ziduan2='" +
        projectCode +
        "' and document_status='3'  and update_data leftlike '" +
        kjqj +
        "' group by baogaobianma having count(1)>1";
    } else {
      benqicjSql1 =
        "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where dr=0 and ziduan2='" +
        projectCode +
        "'" +
        " and dept_name like '材料部' and document_status in('1','2') and baogaori leftlike '" +
        kjqj +
        "'";
      benqicjSql2 =
        "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where dr=0 and ziduan2='" +
        projectCode +
        "'" +
        " and dept_name like '材料部' and document_status in('3','4') and baogaori!=null and update_data leftlike '" +
        kjqj +
        "'";
      benqiqsSql1 =
        "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where dr=0 and ziduan2='" +
        projectCode +
        "'" +
        " and dept_name like '材料部' and document_status in('1','2') and qianshouri leftlike '" +
        kjqj +
        "'";
      benqiqsSql2 =
        "select sum(baogaojine) baogaojine  from GT59740AT1.GT59740AT1.RJ001 where dr=0 and ziduan2='" +
        projectCode +
        "'" +
        " and dept_name like '材料部' and document_status in('3','4') and qianshouri!=null and update_data leftlike '" +
        kjqj +
        "'";
      benqizfsql =
        "select count(1) totbg,'D'as dept_code,baogaobianma,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
        " and dept_name like '材料部' and ziduan2='" +
        projectCode +
        "' and document_status='3'  and update_data leftlike '" +
        kjqj +
        "' group by baogaobianma having count(1)>1";
    }
    let bqbgje = new Object();
    let bqcjres1 = ObjectStore.queryByYonQL(benqicjSql1);
    let bqcjres2 = ObjectStore.queryByYonQL(benqicjSql2);
    let bqqsres1 = ObjectStore.queryByYonQL(benqiqsSql1);
    let bqqsres2 = ObjectStore.queryByYonQL(benqiqsSql2);
    let bqcjbgje = 0;
    let bqqsbjje = 0;
    if (bqcjres1.length > 0) {
      bqcjbgje += bqcjres1[0].baogaojine;
    }
    if (bqcjres2.length > 0) {
      bqcjbgje += bqcjres2[0].baogaojine;
    }
    if (bqqsres1.length > 0) {
      bqqsbjje += bqqsres1[0].baogaojine;
    }
    if (bqqsres2.length > 0) {
      bqqsbjje += bqqsres2[0].baogaojine;
    }
    let benqizfRes = ObjectStore.queryByYonQL(benqizfsql);
    let qszfSql = "";
    let cjzfsql = "";
    var newRes = new Array();
    let bgbm = "";
    if (benqizfRes.length > 0) {
      benqizfRes.forEach((e) => {
        bgbm = bgbm + "'" + e.baogaobianma + "'" + ",";
      });
      bgbm = substring(bgbm, 0, bgbm.length - 1);
    }
    if (benqizfRes.length > 0) {
      if (dept_code != "D") {
        qszfSql =
          "select ziduan2,dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
          " and dept_code='" +
          dept_code +
          "' and ziduan2='" +
          projectCode +
          "' and document_status='2' and baogaobianma in(" +
          bgbm +
          ") and qianshouri!=null and LEFT(qianshouri,7) != '" +
          kjqj +
          "' and update_data leftlike '" +
          kjqj +
          "' group by ziduan2";
        cjzfsql =
          "select ziduan2,dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
          " and dept_code='" +
          dept_code +
          "' and ziduan2='" +
          projectCode +
          "' and document_status='2' and baogaobianma in(" +
          bgbm +
          ") and baogaori!=null and LEFT(baogaori,7) != '" +
          kjqj +
          "' and update_data leftlike '" +
          kjqj +
          "' group by ziduan2";
      } else {
        qszfSql =
          "select ziduan2,'D' as dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
          " and dept_name like '材料部' and ziduan2='" +
          projectCode +
          "' and document_status='2' and baogaobianma in(" +
          bgbm +
          ") and qianshouri!=null and LEFT(qianshouri,7) != '" +
          kjqj +
          "' and update_data leftlike '" +
          kjqj +
          "' group by ziduan2";
        cjzfsql =
          "select ziduan2,'D' as dept_code,sum(baogaojine) baogaojine from GT59740AT1.GT59740AT1.RJ001 where dr=0" +
          " and dept_name like '材料部' and ziduan2='" +
          projectCode +
          "' and document_status='2' and baogaobianma in(" +
          bgbm +
          ") and baogaori!=null and LEFT(baogaori,7) != '" +
          kjqj +
          "' and update_data leftlike '" +
          kjqj +
          "' group by ziduan2";
      }
      let zfqsRes = ObjectStore.queryByYonQL(qszfSql);
      let zfcjRes = ObjectStore.queryByYonQL(cjzfsql);
      if (zfqsRes.length > 0) {
        bqqsbjje += zfqsRes[0].baogaojine;
      }
      if (zfcjRes.length > 0) {
        bqcjbgje += zfcjRes[0].baogaojine;
      }
    }
    bqbgje.bqcjbgje = MoneyFormatReturnBd(bqcjbgje / 1.06, 2);
    bqbgje.bqqsbjje = MoneyFormatReturnBd(bqqsbjje / 1.06, 2);
    bqbgje.dept_code = dept_code;
    bqbgje.kjqj = kjqj;
    bqbgje.projectCode = projectCode;
    return { bqbgje };
  }
}
exports({ entryPoint: MyAPIHandler });