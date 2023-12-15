let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var hth = request.a;
    var gsmc = request.b;
    //取通用收款积分
    var sql = "select sum(bencihuodejifen) bencihuodejifen ,sum(jifen) jifen from  GT56762AT44.GT56762AT44.QTshoukuan where gongsimingchen ='" + hth + "'";
    var res = ObjectStore.queryByYonQL(sql);
    //如果没值赋值0
    var ret1 = 0;
    var ret1_1 = 0;
    if (res.length > 0) {
      var ret1 = res[0].bencihuodejifen;
      var ret1_1 = res[0].jifen;
    }
    //取资质收款积分
    var sql2 = "select sum(bencihuodejifen) bencihuodejifen,sum(jifen) jifen  from  GT57700AT57.GT57700AT57.QTZZSK where qiyemingchen ='" + gsmc + "'";
    var res2 = ObjectStore.queryByYonQL(sql2);
    //如果没值赋值0
    var ret2 = 0;
    var ret2_1 = 0;
    if (res2.length > 0) {
      var ret2 = res2[0].bencihuodejifen;
      //消耗积分
      var ret2_1 = res2[0].jifen;
    }
    //通用收款和资质收款积分累加
    //取企业库初始化积分
    var sql3 = "select jifen chushihuajifen  from  GT56481AT32.GT56481AT32.QYK where gongsimingchen ='" + gsmc + "'";
    var res3 = ObjectStore.queryByYonQL(sql3);
    //如果没值赋值0
    var ret3 = 0;
    if (res3.length > 0) {
      var ret3 = res3[0].chushihuajifen;
    }
    var addret = ret1 + ret2;
    var addret1 = ret1_1 + ret2_1;
    return { res: addret, res2: addret1, res3: ret3 };
  }
}
exports({ entryPoint: MyAPIHandler });