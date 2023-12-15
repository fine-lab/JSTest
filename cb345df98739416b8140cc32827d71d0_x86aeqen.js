let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询申请单
    var billId = param.variablesMap.id;
    var zzSql = `select * from AT1947947A16180003.AT1947947A16180003.ZZD01 where id = ` + billId;
    var ZZDRes = ObjectStore.queryByYonQL(zzSql);
    //日志记录：
    //获取业务信息：是否部门负责人、业务归属部门
    var shifubumenfuzeren = ZZDRes[0].shifubumenfuzeren;
    var yuangongsuoshubumen = ZZDRes[0].yewuguishubumen;
    //查询审批规则子表，获取符合条件的审核信息
    var sql = `select * from AT1947947A16180003.AT1947947A16180003.CCGCGLZB where yewuguishubumen = "` + yuangongsuoshubumen + `" and yewuleixing = "转正" `;
    var CCGCGLZBres = ObjectStore.queryByYonQL(sql);
    var CCGCGLZBId = CCGCGLZBres[0].id;
    //查询内容
    var object = {
      id: CCGCGLZBId,
      compositions: [
        {
          name: "CCGCGLZB_erjishenpiList"
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("AT1947947A16180003.AT1947947A16180003.CCGCGLZB", object);
    //日志记录：
    let EJSP;
    var EJZH = null;
    var YJSP = null;
    var YJJC = null;
    //为审批信息进行赋值
    YJSP = res.yijishenpi;
    YJJC = res.yijijuece;
    EJSP = res.CCGCGLZB_erjishenpiList.map((obj) => obj.erjishenpi);
    EJZH = res.erjizhihui;
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
        }
      }
    };
  }
}
exports({ entryPoint: MyTrigger });