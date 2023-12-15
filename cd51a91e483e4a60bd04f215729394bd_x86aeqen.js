let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询申请单
    var billId = param.variablesMap.id;
    var qjSql = `select * from AT1947947A16180003.AT1947947A16180003.QJD01 where id = ` + billId;
    var QJDRes = ObjectStore.queryByYonQL(qjSql);
    //获取业务信息：是否部门负责人、业务归属部门
    var shifubumenfuzeren = QJDRes[0].shifubumenfuzeren;
    var yuangongsuoshubumen = QJDRes[0].yuangongsuoshubumen;
    //查询审批规则子表，获取符合条件的审核信息
    var Zbsql = `select * from AT1947947A16180003.AT1947947A16180003.CCGCGLZB  where yewuguishubumen = "` + yuangongsuoshubumen + `" and yewuleixing = "请假" `;
    var ZBres = ObjectStore.queryByYonQL(Zbsql);
    var ZBId = ZBres[0].id;
    //查询内容
    var object = {
      id: ZBId,
      compositions: [
        {
          name: "CCGCGLZB_erjishenpiList"
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("AT1947947A16180003.AT1947947A16180003.CCGCGLZB", object);
    let EJSP;
    var EJZH = null;
    var YJSP = null;
    var YJJC = null;
    var IFYJSP = 0;
    var IFYJJC = 0;
    //为审批信息进行赋值
    if (shifubumenfuzeren == 1) {
      YJSP = res.yijishenpi;
      if (YJSP != null) {
        IFYJSP = 1;
      } else {
        YJJC = res.yijijuece;
        IFYJJC = 1;
      }
    } else {
      EJSP = res.CCGCGLZB_erjishenpiList.map((obj) => obj.erjishenpi);
      EJZH = res.erjizhihui;
    }
    return {
      bindType: "multiVar",
      variables: {
        EJSP: {
          dataType: "staff",
          data: EJSP
        },
        EJZH: {
          dataType: "staff",
          data: EJZH
        },
        YJSP: {
          dataType: "staff",
          data: YJSP
        },
        YJJC: {
          dataType: "staff",
          data: YJJC
        },
        IFYJSP: IFYJSP,
        IFYJJC: IFYJJC
      }
    };
  }
}
exports({ entryPoint: MyTrigger });