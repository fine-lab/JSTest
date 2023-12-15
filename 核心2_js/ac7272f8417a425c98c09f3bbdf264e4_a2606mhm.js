let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var value1 = request.kaoshimingchens;
    //查询数据库的数据
    //查询选择题的ID
    var sqls = "select * from GT65548AT19.GT65548AT19.text_hzyV2_15 where id = '" + value1 + "'";
    var ress = ObjectStore.queryByYonQL(sqls);
    //获取题目id
    var timuidAll = [];
    var timuid1 = ress[0].timu1;
    var timuid2 = ress[0].timu2;
    var timuid3 = ress[0].timu3;
    //选择题
    var res1 = ObjectStore.queryByYonQL("select timu,xuanxianga,xuanxiangb,xuanxiangc,xuanxiangd from GT65548AT19.GT65548AT19.text_hzyV2_9_1 where id ='" + timuid1 + "'");
    timuidAll.push(res1[0]);
    var res2 = ObjectStore.queryByYonQL("select timu,xuanxianga,xuanxiangb,xuanxiangc,xuanxiangd from GT65548AT19.GT65548AT19.text_hzyV2_9_1 where id ='" + timuid2 + "'");
    timuidAll.push(res2[0]);
    //判断题
    var res3 = ObjectStore.queryByYonQL("select timu from GT65548AT19.GT65548AT19.text_hzyV2_9_2 where id ='" + timuid3 + "'");
    timuidAll.push(res3[0].timu);
    //获取答案
    var daandAll = [];
    daandAll.push(ress[0].daan1);
    daandAll.push(ress[0].daan2);
    daandAll.push(ress[0].daan3);
    return { timuidAll, daandAll };
  }
}
exports({ entryPoint: MyAPIHandler });