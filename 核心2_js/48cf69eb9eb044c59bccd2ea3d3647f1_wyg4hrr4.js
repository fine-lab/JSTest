let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //月初
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      return y + "-" + m;
    };
    //月末
    var formatDate2 = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 2;
      m = m < 10 ? "0" + m : m;
      if (m == 13) {
        y++;
        m = 1;
      }
      return y + "-" + m;
    };
    debugger;
    //分部
    var reszdyr08 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR08.ZDYR08 where dr=0", "ucfbasedoc");
    //团队
    var reszdyr04 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR04.ZDYR04 where dr=0", "ucfbasedoc");
    //业务大类
    var reszdyr01 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR01.ZDYR01 where dr=0", "ucfbasedoc");
    //业务类型
    var reszdyr02 = ObjectStore.queryByYonQL("select * from GT10666AT17.GT10666AT17.YWLX001 where dr=0");
    //地区
    var reszdyr03 = ObjectStore.queryByYonQL("select * from GT10779AT19.GT10779AT19.DQDA001 where dr=0");
    var lastdate = formatDate(new Date(Date.parse(request.suoshuhuijiqijian)));
    var nextdate = formatDate2(new Date(Date.parse(request.suoshuhuijiqijian)));
    var restotal = ObjectStore.queryByYonQL(
      "select t.yewudalei,t.yewuleixing,t.zDYR08,t.dQDA001,t.zuizhongshouyi,tuandui,fentanbili,zuizhongshouyifentanjin,fentanfangshi  from GT2054AT4.GT2054AT4.XMLZ04 t1 left join GT2054AT4.GT2054AT4.XMLZ01 t on t1.XMLZ01_id=t.id where t.ziduan7>='" +
        lastdate +
        "' and t.ziduan7<='" +
        nextdate +
        "' and t.dr=0 "
    ); //and t.verifystate=2
    var reslist = [];
    restotal.forEach((item, index) => {
      item.t_zuizhongshouyi = 1.0 * item.t_zuizhongshouyi;
      if (reslist.length == 0) {
        reslist.push(item);
      } else {
        var flag = true; //如果无相同团队，则插入reslist
        for (var i = 0; i < reslist.length; i++) {
          if (item.tuandui == reslist[i].tuandui) {
            reslist[i].t_zuizhongshouyi = 1.0 * reslist[i].t_zuizhongshouyi;
            item.t_zuizhongshouyi = 1.0 * item.t_zuizhongshouyi;
            reslist[i].t_zuizhongshouyi += item.t_zuizhongshouyi;
            flag = false;
          }
        }
        if (flag) {
          reslist.push(item);
        }
      }
    });
    var resyw = ObjectStore.queryByYonQL(
      "select t.zuizhongshouyi,tuandui,fentanbili,zuizhongshouyifentanjin,fentanfangshi  from GT2054AT4.GT2054AT4.XMLZ04 t1 left join GT2054AT4.GT2054AT4.XMLZ01 t on t1.XMLZ01_id=t.id where t.ziduan7>='" +
        lastdate +
        "' and t.ziduan7<='" +
        nextdate +
        "' and t.dr=0 "
    ); //and t.verifystate=2
    var ztbl = ObjectStore.queryByYonQL(
      "select tuandui,bili from AT18BEA1800870000A.AT18BEA1800870000A.FBTDFPBMX where dr=0 and FBTDFPB_id in (select id from AT18BEA1800870000A.AT18BEA1800870000A.FBTDFPB where dr=0)"
    );
    var totalzzsy = 0.0;
    var zgzzsy = 0.0;
    var res = [];
    var guizhouzzsy = 0.0;
    resyw.forEach((item, index) => {
      item.t_zuizhongshouyi = 1.0 * item.t_zuizhongshouyi;
      if (item.tuandui != "1691851578702561281") {
        totalzzsy += item.t_zuizhongshouyi;
      }
      if (res.length == 0) {
        item.tuanduishouyi = item.t_zuizhongshouyi * item.fentanbili;
        res.push(item);
      } else {
        item.tuanduishouyi = item.t_zuizhongshouyi * item.fentanbili;
        var flag = true; //如果无相同团队，则插入res
        for (var i = 0; i < res.length; i++) {
          if (item.tuandui == res[i].tuandui && item.fentanfangshi == res[i].fentanfangshi && item.tuandui != "1691851578702561281") {
            res[i].t_zuizhongshouyi = 1.0 * res[i].t_zuizhongshouyi;
            item.t_zuizhongshouyi = 1.0 * item.t_zuizhongshouyi;
            res[i].t_zuizhongshouyi += item.t_zuizhongshouyi;
            res[i].tuanduishouyi += item.tuanduishouyi;
            flag = false;
          }
        }
        if (flag && item.tuandui != "1691851578702561281") {
          res.push(item);
        }
      }
      for (var i = 0; i < ztbl.length; i++) {
        if (item.tuandui == ztbl[i].tuandui) {
          guizhouzzsy += item.tuanduishouyi;
        }
      }
    });
    ztbl.forEach((item, index) => {
      for (var i = 0; i < res.length; i++) {
        if (item.tuandui == res[i].tuandui) {
          item.zuizhongshouyi = res[i].t_zuizhongshouyi;
          item.bili = item.zuizhongshouyi / guizhouzzsy;
        }
      }
    });
    res.forEach((item, index) => {
      if (totalzzsy == 0) {
        item.tuanduibili = 0;
      } else {
        item.tuanduibili = (item.tuanduishouyi / totalzzsy).toFixed(4);
      }
      for (var i = 0; i < ztbl.length; i++) {
        if (item.tuandui == ztbl[i].tuandui) {
          if (totalzzsy == 0) {
            item.tuanduibili = 0;
          } else {
            item.tuanduibili = ((guizhouzzsy / totalzzsy) * ztbl[i].bili).toFixed(4);
          }
        }
      }
    });
    for (var i = 0; i < reslist.length; i++) {
      //团队
      for (var j = 0; j < reszdyr04.length; j++) {
        if (!!reslist[i].tuandui && reslist[i].tuandui == reszdyr04[j].id) {
          reslist[i].tuanduiname = reszdyr04[j].name;
        }
      }
      //分部
      for (var j = 0; j < reszdyr08.length; j++) {
        if (!!reslist[i].t_zDYR08 && reslist[i].t_zDYR08 == reszdyr08[j].id) {
          reslist[i].fenbuname = reszdyr08[j].name;
        }
      }
      //业务大类
      for (var j = 0; j < reszdyr01.length; j++) {
        if (!!reslist[i].t_yewudalei && reslist[i].t_yewudalei == reszdyr01[j].id) {
          reslist[i].yewudaleiname = reszdyr01[j].name;
        }
      }
      //业务类型
      for (var j = 0; j < reszdyr02.length; j++) {
        if (!!reslist[i].t_yewuleixing && reslist[i].t_yewuleixing == reszdyr02[j].id) {
          reslist[i].yewuleixingname = reszdyr02[j].yewuleixing;
        }
      }
      //地区
      for (var j = 0; j < reszdyr03.length; j++) {
        if (!!reslist[i].t_dQDA001 && reslist[i].t_dQDA001 == reszdyr03[j].id) {
          reslist[i].diquname = reszdyr03[j].diqu;
        }
      }
    }
    for (var i = 0; i < res.length; i++) {
      //团队
      for (var j = 0; j < reszdyr04.length; j++) {
        if (!!res[i].tuandui && res[i].tuandui == reszdyr04[j].id) {
          res[i].tuanduiname = reszdyr04[j].name;
        }
      }
    }
    for (var i = 0; i < ztbl.length; i++) {
      //团队
      for (var j = 0; j < reszdyr04.length; j++) {
        if (!!ztbl[i].tuandui && ztbl[i].tuandui == reszdyr04[j].id) {
          ztbl[i].tuanduiname = reszdyr04[j].name;
        }
      }
      ztbl[i].fenbu = "1529233138940641285";
      ztbl[i].fenbuname = "贵州分部";
    }
    var thisresult = {};
    thisresult.rtnzsr = totalzzsy; //集团最终收益
    thisresult.rtngroup = [{ fenbu: "1529233138940641285", fenbuname: "贵州分部", summoney: guizhouzzsy }]; //分部最终收益
    thisresult.rtnlist = reslist;
    thisresult.rtnjtbl = res;
    thisresult.rtnfbbl = ztbl;
    return thisresult;
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });