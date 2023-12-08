let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询申请单
    var billId = param.variablesMap.id;
    var qjSql = `select * from AT19426EC817080004.AT19426EC817080004.QJD where id = ` + billId;
    console.log(qjSql);
    var QJDRes = ObjectStore.queryByYonQL(qjSql);
    //日志记录：
    var QJDReslog = { rizhibianma: "A001", rizhixinxi: JSON.stringify(QJDRes) };
    ObjectStore.insert("AT19426EC817080004.AT19426EC817080004.YWRZJL", QJDReslog, "YWRZJLList");
    //获取业务信息：是否部门负责人、业务归属部门
    var shifubumenfuzeren = QJDRes[0].shifubumenfuzeren;
    var yuangongsuoshubumen = QJDRes[0].yuangongsuoshubumen;
    //查询审批规则子表，获取符合条件的审核信息
    var sql = `select * from AT19426EC817080004.AT19426EC817080004.ZB1 where yewuguishubumen = "` + yuangongsuoshubumen + `" and yewuleixing = "请假" `;
    var ZBres = ObjectStore.queryByYonQL(sql);
    var ZBId = ZBres[0].id;
    //查询内容
    var object = {
      id: ZBId,
      compositions: [
        {
          name: "ZB1_erjishenpiduorenqiangzhanshenpiList"
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("AT19426EC817080004.AT19426EC817080004.ZB1", object);
    //日志记录：
    var QJDReslog2 = { rizhibianma: "A002", rizhixinxi: JSON.stringify(res) };
    ObjectStore.insert("AT19426EC817080004.AT19426EC817080004.YWRZJL", QJDReslog2, "YWRZJLList");
    var EJSP = null;
    var EJCS = null;
    var yjsp = null;
    var yjjc = null;
    var sfyjsp = 0;
    var sfyjjc = 0;
    //为审批信息进行赋值
    if (shifubumenfuzeren == 1) {
      yjsp = res.yijishenpi;
      if (yjsp != null) {
        sfyjsp = 1;
      } else {
        yjjc = res.yijijuece;
        sfyjjc = 1;
      }
    } else {
      EJSP = res.ZB1_erjishenpiduorenqiangzhanshenpiList[0].erjishenpiduorenqiangzhanshenpi;
      EJCS = res.erjizhihuiquanxianjiaodideyonghuchaosong;
    }
    [光标位置]
    return {
      bindType: "multiVar",
      variables: {
        EJSP: {
          dataType: "staff",
          data: EJSP
        },
        EJCS: {
          dataType: "staff",
          data: EJCS
        },
        yjsp: {
          dataType: "staff",
          data: yjsp
        },
        yjjc: {
          dataType: "staff",
          data: yjjc
        },
        sfyjsp: sfyjsp,
        sfyjjc: sfyjjc
      }
    };
  }
}
exports({ entryPoint: MyTrigger });