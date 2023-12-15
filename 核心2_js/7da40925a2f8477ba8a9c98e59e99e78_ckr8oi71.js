let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //拿到批次号
    var picihaos = request.picihao;
    //日期
    var dates = request.newdates;
    //猪只类型
    var pigtypes = request.pigtype;
    //查询批次日存栏
    var daySa = "select * from AT17604A341D580008.AT17604A341D580008.batchColumn where picihao = '" + picihaos + "' and zhuzhileixing = '" + pigtypes + "' and dr = 0";
    var daySares = ObjectStore.queryByYonQL(daySa, "developplatform");
    if (daySares.length == 0) {
      throw new Error("  -- 批次日存栏查询为空 --  ");
    }
    var b = 0;
    var pigtypeName = "";
    for (var a = 0; a < daySares.length; a++) {
      //统计时间
      var tongji = daySares[a].tongjiriqi;
      //截取
      var jiequ1 = substring(tongji, 0, 7);
      //是本月的就将期末存栏汇总
      if (jiequ1 === dates) {
        var qimocun = daySares[a].qimocunlan;
        b = qimocun + b;
      }
      var zzlx = daySares[a].zhuzhileixing;
      var lxsql = "select * from AT17604A341D580008.AT17604A341D580008.ShareProportion where zhuzhileixing = '" + zzlx + "'";
      var lxres = ObjectStore.queryByYonQL(lxsql, "developplatform");
      var bizhong = 0;
      if (lxres.length != 0) {
        bizhong = lxres[0].bizhong;
      }
    }
    return { PigCount: b, biz: bizhong };
  }
}
exports({ entryPoint: MyAPIHandler });