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
    //部门
    var resbm = ObjectStore.queryByYonQL("select id,code,name from bd.adminOrg.AdminOrgVO where dr=0", "ucf-org-center");
    //分部
    var reszdyr08 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR08.ZDYR08 where dr=0", "ucfbasedoc");
    //团队
    var reszdyr04 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR04.ZDYR04 where dr=0", "ucfbasedoc");
    //业务大类
    var reszdyr01 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR01.ZDYR01 where dr=0", "ucfbasedoc");
    //地区
    var reszdyr03 = ObjectStore.queryByYonQL("select * from GT10779AT19.GT10779AT19.DQDA001  where dr=0 ");
    //分部团队对应关系
    var fbtd = ObjectStore.queryByYonQL("select id,zDYR08,diqu from GT10779AT19.GT10779AT19.DQDA001 where dr=0");
    var fbtd2 = ObjectStore.queryByYonQL("select zDYR04,DQDA001_id from GT10779AT19.GT10779AT19.TD01 where dr=0");
    fbtd.forEach((item, index) => {
      for (var i = 0; i < fbtd2.length; i++) {
        if (item.id == fbtd2[i].DQDA001_id) {
          fbtd2[i].fatherfb = item.zDYR08;
          fbtd2[i].dq = item.diqu;
        }
      }
    });
    var lastdate = formatDate(new Date(Date.parse(request.huijiqijian)));
    var nextdate = formatDate2(new Date(Date.parse(request.huijiqijian)));
    //取费用收入单
    var fy = ObjectStore.queryByYonQL("select * from GT3217AT5.GT3217AT5.YDSR01 where suoshuhuijiqijian='" + request.huijiqijianid + "' and dr=0 ");
    if (fy.length == 0) {
      throw new Error("未找到可用的费用收入单");
    }
    //取分部-团队
    var fbteam = ObjectStore.queryByYonQL(
      "select tuandui,fenbu,jituanhuomian,sFHM01,canyufenpeishuliang from GT3217AT5.GT3217AT5.FBTD01 where YDSR01_id ='" +
        fy[0].id +
        "' and dr=0 group by tuandui,fenbu,jituanhuomian,sFHM01,canyufenpeishuliang "
    );
    //取集团-团队
    var jtteam = ObjectStore.queryByYonQL(
      "select tuandui,jituanhuomian,sFHM01,canyufenpeishuliang from GT3217AT5.GT3217AT5.FBTD01 where YDSR01_id ='" + fy[0].id + "' and dr=0 group by tuandui,jituanhuomian,sFHM01,canyufenpeishuliang "
    );
    //取集团浮动分配
    var jtfdfp = ObjectStore.queryByYonQL("select zDYR04 as Team,jituanfudongbili from GT3217AT5.GT3217AT5.TDFT01 where YDSR01_id='" + fy[0].id + "' and dr=0 ");
    //取中台浮动分配
    var ztfdfp = ObjectStore.queryByYonQL("select zDYR04 as Team,jituanfudongbili from GT3217AT5.GT3217AT5.TDFT01 where YDSR01_id='" + fy[0].id + "' and dr=0 ");
    //取分部浮动分配
    var fbfdfp = ObjectStore.queryByYonQL("select tuandui as Team,fenbu,fenbufudongbili from GT3217AT5.GT3217AT5.FBFT01 where YDSR01_id='" + fy[0].id + "' and dr=0  ");
    //取应付、付款单
    var res = ObjectStore.queryByYonQL(
      "select Team,zDYR08 as fenbu,Costattribution as fygs,Costtype as fylx,SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'and Costbeardepartment!='1705164972300435456' and Costbeardepartment!='1705165109738340352'  and Documenttype='2' and shifufentan=1 and dr=0  group by Team,zDYR08,Costattribution,Costtype"
    );
    var res2 = ObjectStore.queryByYonQL(
      "select Team,suoshufenbu as fenbu,ySYF02 as fygs,feiyongleixing as fylx,SUM(jine) as summoney from GT1745AT3.GT1745AT3.YSYF01 where jiaoyiriqi>='" +
        lastdate +
        "' and jiaoyiriqi<'" +
        nextdate +
        "'and bumen!='1705164972300435456' and bumen!='1705165109738340352' and jiaoyileixing='1547049668298407943' and ySYF01=1 and dr=0 group by Team,suoshufenbu,ySYF02,feiyongleixing"
    );
    //若不取应付 删掉此部分
    res.forEach((item, index) => {
      for (var i = 0; i < res2.length; i++) {
        if (res2[i].Team == item.Team && res2.fenbu == item.fenbu && res2.fygs == item.fygs && res2.fylx == item.fylx) {
          res2[i].summoney += item.summoney;
          res.splice(index, 1);
        }
      }
    });
    res = res.concat(res2);
    var resall3 = [];
    res.forEach((item, index) => {
      if (resall3.length > 0) {
        var flg = true;
        for (var i = 0; i < resall3.length; i++) {
          if (resall3[i].fenbu == item.fenbu && resall3[i].Team == item.Team && resall3[i].fylx == item.fylx) {
            resall3[i].summoney += item.summoney;
            flg = false;
            continue;
          }
        }
        if (flg) {
          resall3.push(item);
        }
      } else {
        resall3.push(item);
      }
    });
    res = resall3;
    //分部汇总
    var fbres = ObjectStore.queryByYonQL(
      "select zDYR08 as fenbu,Costattribution as fygs,Costtype as fylx,SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='2' and shifufentan=1 and Costattribution=2  and dr=0  group by zDYR08,Costattribution,Costtype"
    );
    var fbres2 = ObjectStore.queryByYonQL(
      "select suoshufenbu as fenbu,ySYF02 as fygs,feiyongleixing as fylx,SUM(jine) as summoney from GT1745AT3.GT1745AT3.YSYF01 where jiaoyiriqi>='" +
        lastdate +
        "' and jiaoyiriqi<'" +
        nextdate +
        "' and jiaoyileixing='1547049668298407943'  and ySYF01=1 and ySYF02=2 and dr=0 group by suoshufenbu,ySYF02,feiyongleixing"
    );
    fbres.forEach((item, index) => {
      for (var i = 0; i < fbres2.length; i++) {
        if (fbres2.fenbu == item.fenbu) {
          fbres2[i].summoney += item.summoney;
          fbres.splice(index, 1);
        }
      }
    });
    fbres = fbres.concat(fbres2);
    var allfbtotal = 0;
    for (var i = 0; i < fbres.length; i++) {
      allfbtotal += fbres[i].summoney;
    }
    //集团固定
    var jtgdtotal = 0;
    //集团浮动
    var jtfdtotal = 0;
    for (var i = 0; i < res.length; i++) {
      if (res[i].fygs == "1" && res[i].fylx == "1") {
        jtgdtotal += res[i].summoney;
      }
      if (res[i].fygs == "1" && res[i].fylx == "2") {
        jtfdtotal += res[i].summoney;
      }
    }
    var jtres = [];
    //团队-集团固定
    for (var i = 0; i < jtteam.length; i++) {
      if (jtteam[i].jituanhuomian == "2") {
        jtres.push({ Team: jtteam[i].tuandui, jtgd: (jtgdtotal / fy[0].jituanfenpeishu).toFixed(2) });
      } else {
        jtres.push({ Team: jtteam[i].tuandui, jtgd: 0.0 });
      }
    }
    //团队-集团浮动
    for (var i = 0; i < jtres.length; i++) {
      for (var j = 0; j < jtfdfp.length; j++) {
        if (jtres[i].Team == jtfdfp[j].Team) {
          jtres[i].tdjtfd = 0.0;
          jtres[i].tdjtfd = jtfdtotal * jtfdfp[j].jituanfudongbili;
          jtres[i].tdjtfdbl = jtfdfp[j].jituanfudongbili;
          jtres[i].feiyongjineheji = 0.0;
        }
      }
      jtres[i].feiyongjineheji = parseFloat(!!jtres[i].tdjtfd ? jtres[i].tdjtfd : 0.0) + parseFloat(!!jtres[i].jtgd ? jtres[i].jtgd : 0.0);
    }
    //只取分部
    var fb1 = ObjectStore.queryByYonQL(
      "select zDYR08 as fenbu,Costtype as fylx,SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='2' and shifufentan=1 and Costattribution=2   and dr=0  group by zDYR08,Costtype"
    );
    var fb2 = ObjectStore.queryByYonQL(
      "select suoshufenbu as fenbu,feiyongleixing as fylx,SUM(jine) as summoney from GT1745AT3.GT1745AT3.YSYF01 where jiaoyiriqi>='" +
        lastdate +
        "' and jiaoyiriqi<'" +
        nextdate +
        "' and jiaoyileixing='1547049668298407943' and ySYF01=1 and ySYF02=2 and dr=0 group by suoshufenbu,feiyongleixing"
    );
    //若不取应付 删掉此部分
    fb1.forEach((item, index) => {
      for (var i = 0; i < fb2.length; i++) {
        if (fb2[i].fenbu == item.fenbu && fb2[i].fygs == item.fygs && fb2[i].fylx == item.fylx) {
          fb2[i].summoney += item.summoney;
          fb1.splice(index, 1);
        }
      }
    });
    fb1 = fb1.concat(fb2);
    var fb3 = [];
    fb1.forEach((item, index) => {
      if (fb3.length > 0) {
        var flg = true;
        for (var i = 0; i < fb3.length; i++) {
          if (fb3[i].fenbu == item.fenbu && fb3[i].fylx == item.fylx) {
            fb3[i].summoney += item.summoney;
            flg = false;
            continue;
          }
        }
        if (flg) {
          fb3.push(item);
        }
      } else {
        fb3.push(item);
      }
    });
    fb1 = fb3;
    var jgres = [];
    //团队-分部固定
    for (var i = 0; i < fbteam.length; i++) {
      jgres.push({ Team: fbteam[i].tuandui, fenbu: fbteam[i].fenbu });
      for (var j = 0; j < fb1.length; j++) {
        if (fbteam[i].fenbu == fb1[j].fenbu && fb1[j].fylx == "1" && fbteam[i].sFHM01 == "2") {
          jgres[i].fbgd = fb1[j].summoney / fbteam[i].canyufenpeishuliang;
        }
      }
    }
    //团队-分部浮动
    fbfdfp.forEach((item, index) => {
      item.fbfdtotal = 0.0;
      item.fbgd = 0.0;
      for (var fbfdfpi = 0; fbfdfpi < res.length; fbfdfpi++) {
        if (item.fenbu == res[fbfdfpi].fenbu) {
          item.fbfdtotal = res[fbfdfpi].summoney;
          item.fbfd = item.fbfdtotal * item.fenbufudongbili;
        }
      }
    });
    jgres.forEach((item, index) => {
      for (var jgresi = 0; jgresi < fbfdfp.length; jgresi++) {
        if (item.fenbu == fbfdfp[jgresi].fenbu) {
          fbfdfp[jgresi].fbgd = item.fbgd;
          if (item.Team == fbfdfp[jgresi].Team) {
            jgres.splice(index, 1);
          }
        } else {
        }
      }
    });
    jgres.forEach((item, index) => {
      var repeat = false;
      for (var mmm = 0; mmm < fbfdfp.length; mmm++) {
        if (item.fenbu == fbfdfp[mmm].fenbu && item.Team == fbfdfp[mmm].Team) {
          repeat = true;
        }
      }
      if (!repeat) {
        fbfdfp.push(item);
      }
    });
    //中台分配
    //取分部团队比例
    var bigteam = [{ Team: "1509383114350657550" }, { Team: "1509383114350657557" }, { Team: "1509383114350657545" }]; //常胜铁军，北方战狼，英雄联盟
    var littleteam = [{ Team: "1509383114350657553" }, { Team: "1509383105760722948" }]; //开拓者，飞虎队
    var ztblhead = ObjectStore.queryByYonQL("select * from AT18BEA1800870000A.AT18BEA1800870000A.FBTDFPB where dr=0");
    var ztbl = ObjectStore.queryByYonQL("select * from AT18BEA1800870000A.AT18BEA1800870000A.FBTDFPBMX where dr=0 and FBTDFPB_id='" + ztblhead[0].id + "'");
    var ztres = ObjectStore.queryByYonQL(
      "select Team,zDYR08 as fenbu,Costattribution as fygs,Costtype as fylx,SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='2' and shifufentan=1 and dr=0 and (Costbeardepartment='1705164972300435456' or Costbeardepartment='1705165109738340352')   group by Team,zDYR08,Costattribution,Costtype"
    );
    var ztres2 = ObjectStore.queryByYonQL(
      "select Team,suoshufenbu as fenbu,ySYF02 as fygs,feiyongleixing as fylx,SUM(jine) as summoney from GT1745AT3.GT1745AT3.YSYF01 where jiaoyiriqi>='" +
        lastdate +
        "' and jiaoyiriqi<'" +
        nextdate +
        "' and jiaoyileixing='1547049668298407943' and ySYF01=1 and dr=0 and(bumen='1705164972300435456' or bumen='1705165109738340352')  group by Team,suoshufenbu,ySYF02,feiyongleixing"
    );
    //若不取应付 删掉此部分
    ztres.forEach((item, index) => {
      for (var i = 0; i < ztres2.length; i++) {
        if (ztres2[i].Team == item.Team && ztres2.fenbu == item.fenbu && ztres2.fygs == item.fygs && ztres2.fylx == item.fylx) {
          ztres2[i].summoney += item.summoney;
          ztres.splice(index, 1);
        }
      }
    });
    ztres = ztres.concat(ztres2);
    //中台固定
    var ztgdtotal = 0;
    //中台浮动
    var ztfdtotal = 0;
    for (var i = 0; i < ztres.length; i++) {
      if (ztres[i].fylx == "1") {
        ztgdtotal += ztres[i].summoney;
      }
      if (ztres[i].fylx == "2") {
        ztfdtotal += ztres[i].summoney;
      }
    }
    //计算比例
    for (var i = 0; i < bigteam.length; i++) {
      bigteam[i].gdbl = 0.25;
    }
    for (var i = 0; i < littleteam.length; i++) {
      littleteam[i].gdbl = 0.0;
      for (var j = 0; j < ztbl.length; j++) {
        if (littleteam[i].Team == ztbl[j].tuandui) {
          littleteam[i].gdbl = 0.25 * ztbl[j].bili;
        }
      }
    }
    var gdblres = bigteam.concat(littleteam);
    ztbl.forEach((item, index) => {
      for (var i = 0; i < gdblres.length; i++) {
        if (item.tuandui == gdblres[i].Team) {
          item.gdbl = gdblres[i].gdbl;
          item.Team = item.tuandui;
          gdblres.splice(i, 1);
        }
      }
    });
    ztbl = ztbl.concat(gdblres);
    ztbl.forEach((item, index) => {
      item.ztgd = item.gdbl * ztgdtotal;
    });
    //团队-中台浮动
    ztfdfp.forEach((item, index) => {
      item.tdjtfd = ztfdtotal * item.jituanfudongbili;
    });
    ztbl.forEach((item, index) => {
      for (var i = 0; i < ztfdfp.length; i++) {
        if (item.Team == ztfdfp[i].Team) {
          item.ztfd = ztfdfp[i].tdjtfd;
          item.ztfdbl = ztfdfp[i].jituanfudongbili;
          ztfdfp.splice(i, 1);
        }
      }
    });
    ztbl = ztbl.concat(ztfdfp);
    ztbl.forEach((item, index) => {
      if (!!!item.ztfd) {
        item.ztfd = 0;
        item.ztfdbl = 0;
      }
      item.feiyongjineheji = item.ztfd + item.ztgd;
    });
    var zttotal = ztfdtotal + ztgdtotal;
    //格式化数据
    for (var i = 0; i < fbfdfp.length; i++) {
      fbfdfp[i].feiyongjineheji = parseFloat(!!fbfdfp[i].fbfd ? fbfdfp[i].fbfd : 0.0) + parseFloat(!!fbfdfp[i].fbgd ? fbfdfp[i].fbgd : 0.0);
    }
    for (var i = 0; i < jtres.length; i++) {
      for (var j = 0; j < reszdyr04.length; j++) {
        if (!!jtres[i].Team && jtres[i].Team == reszdyr04[j].id) {
          jtres[i].Teamname = reszdyr04[j].name;
        }
      }
    }
    for (var i = 0; i < fbfdfp.length; i++) {
      for (var j = 0; j < reszdyr04.length; j++) {
        if (!!fbfdfp[i].Team && fbfdfp[i].Team == reszdyr04[j].id) {
          fbfdfp[i].Teamname = reszdyr04[j].name;
        }
      }
      for (var j = 0; j < reszdyr08.length; j++) {
        if (!!fbfdfp[i].fenbu && fbfdfp[i].fenbu == reszdyr08[j].id) {
          fbfdfp[i].fenbuname = reszdyr08[j].name;
        }
      }
    }
    for (var i = 0; i < ztbl.length; i++) {
      for (var j = 0; j < reszdyr04.length; j++) {
        if (!!ztbl[i].Team && ztbl[i].Team == reszdyr04[j].id) {
          ztbl[i].Teamname = reszdyr04[j].name;
        }
      }
      for (var j = 0; j < reszdyr08.length; j++) {
        if (!!ztbl[i].fenbu && ztbl[i].fenbu == reszdyr08[j].id) {
          ztbl[i].fenbuname = reszdyr08[j].name;
        }
      }
    }
    var thisresult = {};
    thisresult.jttotal = jtgdtotal + jtfdtotal;
    thisresult.jtfdtotal = jtfdtotal;
    thisresult.jtgdtotal = jtgdtotal;
    thisresult.jtfp = jtres;
    thisresult.tdfp = fbfdfp;
    thisresult.fbtotal = allfbtotal;
    thisresult.ztfp = ztbl;
    thisresult.zttotal = zttotal;
    return { thisresult: thisresult };
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });