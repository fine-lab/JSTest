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
    //地区
    var reszdyr03 = ObjectStore.queryByYonQL("select * from GT10779AT19.GT10779AT19.DQDA001 where dr=0");
    var lastdate = formatDate(new Date(Date.parse(request.suoshuhuijiqijian)));
    var nextdate = formatDate2(new Date(Date.parse(request.suoshuhuijiqijian)));
    //团队分配明细   1547049608180400137
    var res = ObjectStore.queryByYonQL(
      "select yewuhaoxiangmu,Team,suoshufenbu as fenbu,suoshudiqu as diqu,zDYR01 as yewudalei,SUM(jine) as summoney from GT1745AT3.GT1745AT3.YSYF01 where jiaoyiriqi>='" +
        lastdate +
        "' and jiaoyiriqi<'" +
        nextdate +
        "' and jiaoyileixing='1547049608180400137' and shifuyewu='1' and feiyongxiangmu in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 group by Team,suoshufenbu,suoshudiqu,zDYR01,yewuhaoxiangmu"
    );
    var resjq = ObjectStore.queryByYonQL(
      "select yewuhaoxiangmu,Team,suoshufenbu as fenbu,suoshudiqu as diqu,zDYR01 as yewudalei,SUM(weihexiaojine) as summoney from GT1745AT3.GT1745AT3.YSYF01 where jiaoyiriqi>='" +
        lastdate +
        "' and jiaoyiriqi<'" +
        nextdate +
        "' and jiaoyileixing='1547049668298407943' and shifuyewu='1' and feiyongxiangmu in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 group by Team,suoshufenbu,suoshudiqu,zDYR01,yewuhaoxiangmu"
    );
    resjq.forEach((item, index) => {
      item.summoney = 0 - item.summoney;
    });
    res = res.concat(resjq);
    var res2 = ObjectStore.queryByYonQL(
      "select BusinessCode_project as yewuhaoxiangmu,Team,zDYR08 as fenbu,dQDA001 as diqu,SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='1' and Whetherbusiness='1'  and Expenseitems in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 group by Team,zDYR08,dQDA001,yewudalei,BusinessCode_project"
    );
    var res22 = ObjectStore.queryByYonQL(
      "select BusinessCode_project as yewuhaoxiangmu, Team,zDYR08 as fenbu,dQDA001 as diqu ,SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='2' and Whetherbusiness='1'  and Expenseitems in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378')  and dr=0 group by  Team,zDYR08,dQDA001,yewudalei,BusinessCode_project"
    );
    var yewuhaoid = [];
    res.forEach((item, index) => {
      yewuhaoid.push(item.yewuhaoxiangmu);
      for (var i = 0; i < res2.length; i++) {
        if (res2[i].yewuhaoxiangmu == item.yewuhaoxiangmu && res2[i].Team == item.Team && res2[i].fenbu == item.fenbu && res2[i].diqu == item.diqu) {
          res2[i].summoney += item.summoney;
          res.splice(index, 1);
        }
      }
    });
    res = res.concat(res2);
    for (var i = 0; i < res22.length; i++) {
      res22[i].summoney = -1 * res22[i].summoney;
    }
    res.forEach((item, index) => {
      for (var i = 0; i < res22.length; i++) {
        if (res22[i].yewuhaoxiangmu == item.yewuhaoxiangmu && res22[i].fenbu == item.fenbu && res22[i].diqu == item.diqu) {
          res22[i].summoney += item.summoney;
          res.splice(index, 1);
        }
      }
    });
    res = res.concat(res22);
    //循环 res   分配团队
    for (var i = 0; i < res.length; i++) {
      var yeuwhaosql = "select  * from   GT1589AT1.GT1589AT1.YWH02  where  dr=0 and YWH01_id='" + res[i].yewuhaoxiangmu + "'";
      var yeuwhaores = ObjectStore.queryByYonQL(yeuwhaosql);
      //只有一条说明不用拆分比例
      if (yeuwhaores.length == 1) {
        res[i].Team = yeuwhaores[0].tuandui;
      } else {
        //多条需要拆分比例
      }
    }
    //循环 res 根据团队   分部   地区  业务大类   合并金额
    var lilumap = new Map();
    var resnew = [];
    var zongshouru = 0;
    for (var i = 0; i < res.length; i++) {
      var summoney = 0;
      var lilu = res[i].Team + res[i].fenbu + res[i].diqu; //+res[i].yewudalei
      if (lilumap.get(lilu) == null || lilumap.get(lilu) == undefined) {
        lilumap.set(lilu, "1");
        for (var j = 0; j < res.length; j++) {
          if (res[i].Team == res[j].Team && res[i].fenbu == res[j].fenbu && res[i].diqu == res[j].diqu) {
            summoney += res[j].summoney;
          }
        }
        res[i].summoney = summoney;
        zongshouru += summoney;
        resnew.push(res[i]);
      } else {
      }
    }
    res = resnew;
    var teamres = resnew;
    var teamdeptres = resnew;
    //真对第一个表计算   按照团队取合计数 ，/总收入
    var teammap = new Map();
    var temnew = [];
    for (var i = 0; i < teamres.length; i++) {
      var summoney = 0;
      var lilu = teamres[i].Team;
      var grouplist = {};
      if (teammap.get(lilu) == null || teammap.get(lilu) == undefined) {
        teammap.set(lilu, "1");
        for (var j = 0; j < teamres.length; j++) {
          if (teamres[i].Team == teamres[j].Team) {
            summoney += teamres[j].summoney;
          }
        }
        grouplist.summoney = summoney;
        grouplist.Team = teamres[i].Team;
        temnew.push(grouplist);
      }
    }
    //冒泡排序金额降序
    for (var i = 0; i < temnew.length - 1; i++) {
      for (var j = 0; j < temnew.length - 1 - i; j++) {
        if (temnew[j].summoney > temnew[j + 1].summoney) {
          var temp = temnew[j];
          temnew[j] = temnew[j + 1];
          temnew[j + 1] = temp;
        }
      }
    }
    var groupbili = 0;
    for (var i = 0; i < temnew.length; i++) {
      if (i == temnew.length - 1) {
        temnew[i].pro = 1 - groupbili;
      } else {
        temnew[i].pro = Number(zongshouru == 0 ? 0 : ((!!temnew[i].summoney ? temnew[i].summoney : 0) / zongshouru).toFixed(4));
        groupbili += temnew[i].pro;
      }
    }
    //团队 -   部门  比例计算  按照分部去合计分组
    var teamdeptmap = new Map();
    var map = {};
    for (var i = 0; i < teamdeptres.length; i++) {
      var summoney = 0;
      var lilu = teamdeptres[i].fenbu;
      if (map[lilu] == null || map[lilu] == undefined || map[lilu].length < 0) {
        var temdeptnew = [];
        var listdept = {};
        listdept.summoney = teamdeptres[i].summoney;
        listdept.Team = teamdeptres[i].Team;
        listdept.fenbu = teamdeptres[i].fenbu;
        temdeptnew.push(listdept);
        map[lilu] = temdeptnew;
      } else {
        var listdept = {};
        listdept.summoney = teamdeptres[i].summoney;
        listdept.Team = teamdeptres[i].Team;
        listdept.fenbu = teamdeptres[i].fenbu;
        map[lilu].push(listdept);
      }
    }
    var fbftblilinew = [];
    for (var key in map) {
      //冒泡排序
      for (var i = 0; i < map[key].length - 1; i++) {
        for (var j = 0; j < map[key].length - 1 - i; j++) {
          if (map[key][j].summoney > map[key][j + 1].summoney) {
            var temp = map[key][j];
            map[key][j] = map[key][j + 1];
            map[key][j + 1] = temp;
          }
        }
      }
      var zongmoney = 0;
      for (var i = 0; i < map[key].length; i++) {
        zongmoney += map[key][i].summoney;
      }
      var groupbili = 0;
      for (var i = 0; i < map[key].length; i++) {
        if (i == map[key].length - 1) {
          map[key][i].pro = 1 - groupbili;
        } else {
          map[key][i].pro = Number(zongmoney == 0 ? 0 : ((!!map[key][i].summoney ? map[key][i].summoney : 0) / zongmoney).toFixed(4));
          groupbili += map[key][i].pro;
        }
        fbftblilinew.push(map[key][i]);
      }
      var teammapfbbl = new Map();
      var fbtemnewbili = [];
      for (var i = 0; i < fbftblilinew.length; i++) {
        var summoney = 0;
        var lilu = fbftblilinew[i].fenbu + fbftblilinew[i].Team;
        var grouplist = {};
        if (teammapfbbl.get(lilu) == null || teammapfbbl.get(lilu) == undefined) {
          teammapfbbl.set(lilu, "1");
          for (var j = 0; j < fbftblilinew.length; j++) {
            if (fbftblilinew[i].Team == fbftblilinew[j].Team && fbftblilinew[i].fenbu == fbftblilinew[j].fenbu) {
              summoney += fbftblilinew[j].pro;
            }
          }
          grouplist.pro = summoney;
          grouplist.Team = fbftblilinew[i].Team;
          grouplist.fenbu = fbftblilinew[i].fenbu;
          fbtemnewbili.push(grouplist);
        }
      }
      fbftblilinew = fbtemnewbili;
    }
    //团队比例计算依据
    var res3 = ObjectStore.queryByYonQL(
      "select suoshufenbu as fenbu,SUM(jine) as summoney from GT1745AT3.GT1745AT3.YSYF01 where jiaoyiriqi>='" +
        lastdate +
        "' and jiaoyiriqi<'" +
        nextdate +
        "' and jiaoyileixing='1547049608180400137'  and shifuyewu='1' and feiyongxiangmu in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0  group by suoshufenbu"
    );
    var res3jq = ObjectStore.queryByYonQL(
      "select suoshufenbu as fenbu,SUM(weihexiaojine) as summoney from GT1745AT3.GT1745AT3.YSYF01 where jiaoyiriqi>='" +
        lastdate +
        "' and jiaoyiriqi<'" +
        nextdate +
        "' and jiaoyileixing='1547049668298407943' and shifuyewu='1' and feiyongxiangmu in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378')  and dr=0  group by suoshufenbu"
    );
    res3jq.forEach((item, index) => {
      item.summoney = 0 - item.summoney;
    });
    res3 = res3.concat(res3jq);
    var res4 = ObjectStore.queryByYonQL(
      "select zDYR08 as fenbu,SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='1'and Whetherbusiness='1'   and Expenseitems in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 group by zDYR08"
    );
    var res42 = ObjectStore.queryByYonQL(
      "select zDYR08 as fenbu,SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='2' and Whetherbusiness='1'  and Expenseitems in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 group by zDYR08"
    );
    res3.forEach((item, index) => {
      for (var i = 0; i < res4.length; i++) {
        if (res4[i].fenbu == item.fenbu) {
          res4[i].summoney += item.summoney;
          res3.splice(index, 1);
        }
      }
    });
    res3 = res3.concat(res4);
    for (var i = 0; i < res42.length; i++) {
      res42[i].summoney = -1 * res42[i].summoney;
    }
    res3.forEach((item, index) => {
      for (var i = 0; i < res42.length; i++) {
        if (res42[i].fenbu == item.fenbu) {
          res42[i].summoney += item.summoney;
          res3.splice(index, 1);
        }
      }
    });
    res3 = res3.concat(res42);
    var res3lilumap = new Map();
    var resnew = [];
    var zongshouru = 0;
    for (var i = 0; i < res3.length; i++) {
      var summoney = 0;
      var lilu = res3[i].fenbu;
      if (res3lilumap.get(lilu) == null || res3lilumap.get(lilu) == undefined) {
        res3lilumap.set(lilu, "1");
        for (var j = 0; j < res3.length; j++) {
          if (res3[i].fenbu == res3[j].fenbu) {
            summoney += res3[j].summoney;
          }
        }
        res3[i].summoney = summoney;
        zongshouru += summoney;
        resnew.push(res3[i]);
      } else {
      }
    }
    res3 = resnew;
    //团队-集团分配比例
    //团队总数
    var res5 = ObjectStore.queryByYonQL(
      "select Team,SUM(jine) as summoney from GT1745AT3.GT1745AT3.YSYF01 where jiaoyiriqi>='" +
        lastdate +
        "' and jiaoyiriqi<'" +
        nextdate +
        "' and jiaoyileixing='1547049608180400137' and shifuyewu='1' and feiyongxiangmu in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 group by Team"
    );
    var res6 = ObjectStore.queryByYonQL(
      "select Team,SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='1' and Whetherbusiness='1' and Expenseitems in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 group by Team"
    );
    var res62 = ObjectStore.queryByYonQL(
      "select Team,SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='2' and Whetherbusiness='1' and Expenseitems in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 group by Team"
    );
    //集团总数
    var res7 = ObjectStore.queryByYonQL(
      "select SUM(jine) as summoney from GT1745AT3.GT1745AT3.YSYF01 where jiaoyiriqi>='" +
        lastdate +
        "' and jiaoyiriqi<'" +
        nextdate +
        "' and jiaoyileixing='1547049608180400137' and shifuyewu='1' and feiyongxiangmu in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 "
    );
    var res8 = ObjectStore.queryByYonQL(
      "select SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='1' and Whetherbusiness='1'  and Expenseitems in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 "
    );
    var res82 = ObjectStore.queryByYonQL(
      "select SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='2' and Whetherbusiness='1'  and Expenseitems in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 "
    );
    var jtzs = 0;
    if (res7.length > 0) {
      jtzs += res7[0].summoney;
    }
    if (res8.length > 0) {
      jtzs += res8[0].summoney;
    }
    if (res82.length > 0) {
      jtzs -= res82[0].summoney;
    }
    res5.forEach((item, index) => {
      for (var i = 0; i < res6.length; i++) {
        if (res6[i].Team == item.Team) {
          res6[i].summoney += item.summoney;
          res5.splice(index, 1);
        }
      }
    });
    res5 = res5.concat(res6);
    for (var i = 0; i < res62.length; i++) {
      res62[i].summoney = -1 * res62[i].summoney;
    }
    res5.forEach((item, index) => {
      for (var i = 0; i < res62.length; i++) {
        if (res62[i].Team == item.Team) {
          res62[i].summoney += item.summoney;
          res5.splice(index, 1);
        }
      }
    });
    res5 = res5.concat(res62);
    for (var i = 0; i < res5.length; i++) {
      res5[i].pro = jtzs == 0 ? 0 : (!!res5[i].summoney ? res5[i].summoney : 0) / jtzs;
    }
    //团队-分部分配比例
    //团队总数
    var res9 = ObjectStore.queryByYonQL(
      "select Team,suoshufenbu as fenbu,SUM(jine) as summoney from GT1745AT3.GT1745AT3.YSYF01 where jiaoyiriqi>='" +
        lastdate +
        "' and jiaoyiriqi<'" +
        nextdate +
        "' and jiaoyileixing='1547049608180400137' and dr=0 and shifuyewu='1' and feiyongxiangmu in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') group by Team,suoshufenbu"
    ); //and ySYF02='2'
    var res10 = ObjectStore.queryByYonQL(
      "select Team,zDYR08 as fenbu,SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='1'  and Whetherbusiness='1' and Expenseitems in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 group by Team,zDYR08"
    ); //and Costattribution='2'
    var res102 = ObjectStore.queryByYonQL(
      "select Team,zDYR08 as fenbu,SUM(money) as summoney from GT6903AT9.GT6903AT9.SFKD001 where Transactiondate>='" +
        lastdate +
        "' and Transactiondate<'" +
        nextdate +
        "'  and Documenttype='2' and Whetherbusiness='1'  and Expenseitems in( '1529184124780150796' , '1529184124780150798','1533686642075762692','1529184124780150800','1529184133370085376','1529184133370085378') and dr=0 group by Team,zDYR08"
    ); //and Costattribution='2'
    //分部总数取自团队比例计算依据
    res9.forEach((item, index) => {
      for (var i = 0; i < res10.length; i++) {
        if (res10[i].fenbu == item.fenbu && res10[i].Team == item.Team) {
          res10[i].summoney += item.summoney;
          res9.splice(index, 1);
        }
      }
    });
    res9 = res9.concat(res10);
    for (var i = 0; i < res102.length; i++) {
      res102[i].summoney = -1 * res102[i].summoney;
    }
    res9.forEach((item, index) => {
      for (var i = 0; i < res102.length; i++) {
        if (res102[i].fenbu == item.fenbu && res102[i].Team == item.Team) {
          res102[i].summoney += item.summoney;
          res9.splice(index, 1);
        }
      }
    });
    res9 = res9.concat(res102);
    res3.forEach((item, index) => {
      for (var i = 0; i < res9.length; i++) {
        if (item.fenbu == res9[i].fenbu) {
          res9[i].pro = (!!res9[i].summoney ? res9[i].summoney : 0) / item.summoney;
        }
      }
    });
    for (var i = 0; i < res5.length; i++) {
      res5[i].pro = jtzs == 0 ? 0 : (!!res5[i].summoney ? res5[i].summoney : 0) / jtzs;
    }
    for (var i = 0; i < res.length; i++) {
      for (var j = 0; j < reszdyr08.length; j++) {
        if (!!res[i].fenbu && res[i].fenbu == reszdyr08[j].id) {
          res[i].fenbuname = reszdyr08[j].name;
        }
      }
      for (var j = 0; j < reszdyr04.length; j++) {
        if (!!res[i].Team && res[i].Team == reszdyr04[j].id) {
          res[i].Teamname = reszdyr04[j].name;
        }
      }
      for (var j = 0; j < reszdyr01.length; j++) {
        if (!!res[i].yewudalei && res[i].yewudalei == reszdyr01[j].id) {
          res[i].yewudaleiname = reszdyr01[j].name;
        }
      }
      for (var j = 0; j < reszdyr03.length; j++) {
        if (!!res[i].diqu && res[i].diqu == reszdyr03[j].id) {
          res[i].diquname = reszdyr03[j].diqu;
        }
      }
    }
    for (var i = 0; i < res3.length; i++) {
      for (var j = 0; j < reszdyr08.length; j++) {
        if (!!res3[i].fenbu && res3[i].fenbu == reszdyr08[j].id) {
          res3[i].fenbuname = reszdyr08[j].name;
        }
      }
    }
    for (var i = 0; i < res5.length; i++) {
      for (var j = 0; j < reszdyr04.length; j++) {
        if (!!res5[i].Team && res5[i].Team == reszdyr04[j].id) {
          res5[i].Teamname = reszdyr04[j].name;
        }
      }
    }
    for (var i = 0; i < res9.length; i++) {
      for (var j = 0; j < reszdyr04.length; j++) {
        if (!!res9[i].Team && res9[i].Team == reszdyr04[j].id) {
          res9[i].Teamname = reszdyr04[j].name;
        }
      }
      for (var j = 0; j < reszdyr08.length; j++) {
        if (!!res9[i].fenbu && res9[i].fenbu == reszdyr08[j].id) {
          res9[i].fenbuname = reszdyr08[j].name;
        }
      }
    }
    for (var i = 0; i < temnew.length; i++) {
      for (var j = 0; j < reszdyr04.length; j++) {
        if (!!temnew[i].Team && temnew[i].Team == reszdyr04[j].id) {
          temnew[i].Teamname = reszdyr04[j].name;
        }
      }
      for (var j = 0; j < reszdyr08.length; j++) {
        if (!!temnew[i].fenbu && temnew[i].fenbu == reszdyr08[j].id) {
          temnew[i].fenbuname = reszdyr08[j].name;
        }
      }
    }
    for (var i = 0; i < fbftblilinew.length; i++) {
      for (var j = 0; j < reszdyr04.length; j++) {
        if (!!fbftblilinew[i].Team && fbftblilinew[i].Team == reszdyr04[j].id) {
          fbftblilinew[i].Teamname = reszdyr04[j].name;
        }
      }
      for (var j = 0; j < reszdyr08.length; j++) {
        if (!!fbftblilinew[i].fenbu && fbftblilinew[i].fenbu == reszdyr08[j].id) {
          fbftblilinew[i].fenbuname = reszdyr08[j].name;
        }
      }
    }
    var thisresult = {};
    thisresult.rtnlist = res;
    thisresult.rtngroup = res3;
    thisresult.rtnjtbl = temnew;
    thisresult.rtnfbbl = fbftblilinew;
    thisresult.rtnzsr = zongshouru.toFixed(2);
    return { thisresult: thisresult };
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });