let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var billId = param.variablesMap.id;
    var qjSql = `select * from AT1957625017480008.AT1957625017480008.QJD20230927 where id = ` + billId;
    var QJDRes = ObjectStore.queryByYonQL(qjSql);
    //获取业务类型：请假，转正
    var yewu = QJDRes[0].yewu;
    //获取业务信息：所属部门
    var suoshubumen = QJDRes[0].suoshubumen;
    var shifubumenfuzeren = QJDRes[0].shifubumenfuzeren;
    var sql = `select * from AT1957625017480008.AT1957625017480008.ZBGLZB where orgid = "` + suoshubumen + `"  `;
    var ZBres = ObjectStore.queryByYonQL(sql);
    let approver;
    let cc;
    var preOrg = suoshubumen;
    var org = ZBres[0].parentorgid;
    var assignedmanager = ZBres[0].assignedmanager;
    var ZXFS;
    var curOrg;
    if (shifubumenfuzeren == 1) {
      if (assignedmanager != null) {
        var sql3 = `select * from AT1957625017480008.AT1957625017480008.ZBGLZB where orgid = "` + org + `"  and defaultmanager = "` + assignedmanager + `" `;
        var ZBres3 = ObjectStore.queryByYonQL(sql3);
        if (ZBres3.length != 0) {
          var priority = ZBres3[0].priority;
          var sql4 = `select * from AT1957625017480008.AT1957625017480008.ZBGLZB where orgid = "` + org + `"  and priority <= ` + priority;
          var ZBres4 = ObjectStore.queryByYonQL(sql4);
          approver = ZBres4.map((obj) => obj.defaultmanager);
          ZXFS = "Priority";
          curOrg = ZBres4[0].orgid;
        } else {
          approver = null;
        }
        ZXFS = "Priority";
      } else {
        var sql1 = `select * from AT1957625017480008.AT1957625017480008.ZBGLZB where orgid = "` + org + `" `;
        var ZBres1 = ObjectStore.queryByYonQL(sql1);
        if (ZBres1[0].shenpileixinggenorgidbangding == "Single") {
          var single = ZBres1.filter(function (e) {
            return e.priority == 1;
          });
          approver = single.map((obj) => obj.defaultmanager);
          var singlecc = ZBres1.filter(function (e) {
            return e.priority != 1;
          });
          cc = singlecc.map((obj) => obj.defaultmanager);
          ZXFS = "Single";
        } else if (ZBres1[0].shenpileixinggenorgidbangding == "Normal") {
          approver = ZBres1.map((obj) => obj.defaultmanager);
          ZXFS = "Normal";
        } else if (ZBres1[0].shenpileixinggenorgidbangding == "Equal") {
          approver = ZBres1.map((obj) => obj.defaultmanager);
          ZXFS = "Equal";
        } else if (ZBres1[0].shenpileixinggenorgidbangding == "Priority") {
          ZBres1.sort(function (a, b) {
            return b.priority - a.priority;
          });
          approver = ZBres1.map((obj) => obj.defaultmanager);
          ZXFS = "Priority";
        }
        curOrg = ZBres1[0].parentorgid;
      }
      preOrg = org;
    } else {
      if (ZBres[0].shenpileixinggenorgidbangding == "Single") {
        var single = ZBres.filter(function (e) {
          return e.priority == 1;
        });
        approver = single.map((obj) => obj.defaultmanager);
        var singlecc = ZBres.filter(function (e) {
          return e.priority != 1;
        });
        cc = singlecc.map((obj) => obj.defaultmanager);
        ZXFS = "Single";
      } else if (ZBres[0].shenpileixinggenorgidbangding == "Normal") {
        approver = ZBres.map((obj) => obj.defaultmanager);
        ZXFS = "Normal";
      } else if (ZBres[0].shenpileixinggenorgidbangding == "Equal") {
        approver = ZBres.map((obj) => obj.defaultmanager);
        ZXFS = "Equal";
      } else if (ZBres[0].shenpileixinggenorgidbangding == "Priority") {
        ZBres.sort(function (a, b) {
          return b.priority - a.priority;
        });
        approver = ZBres.map((obj) => obj.defaultmanager);
        ZXFS = "Priority";
      }
      curOrg = ZBres[0].parentorgid;
      preOrg = suoshubumen;
    }
    return {
      bindType: "multiVar",
      variables: {
        HQSPR: {
          dataType: "staff",
          data: approver
        },
        cc: {
          dataType: "staff",
          data: cc
        },
        SFBHXDLC: 1,
        ZXFS: ZXFS,
        preOrg: preOrg,
        curOrg: curOrg
      }
    };
  }
}
exports({ entryPoint: MyTrigger });