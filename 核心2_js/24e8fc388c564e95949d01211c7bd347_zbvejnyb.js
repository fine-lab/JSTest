let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var xiangmubianhao = request.xiangmubianhao;
    var sql = "select id,sum(shijihezuojine),sum(ziduan34) from GT64724AT4.GT64724AT4.Playwithdetail where dr=0 and xiangmubianhao='" + xiangmubianhao + "'";
    var res = ObjectStore.queryByYonQL(sql);
    var shijihezuojine;
    var ziduan34;
    shijihezuojine = res[0].shijihezuojine;
    ziduan34 = res[0].ziduan34;
    if (shijihezuojine == null) {
      shijihezuojine = 0;
    }
    if (ziduan34 == null) {
      ziduan34 = 0;
    }
    var xuangmuid = res[0].id;
    var zhangqi = " select sum(caiwudakuanjine),sum(dakuanjine) from GT64724AT4.GT64724AT4.zhangqi where Playwithdetail_id='" + xuangmuid + "'";
    var reszhangqi = ObjectStore.queryByYonQL(zhangqi);
    // 计算申请打款金额汇总
    var shenqing;
    var shenqing = zhangqi[0].caiwudakuanjine;
    // 计算已付金额汇总
    var yifu;
    yifu = zhangqi[0].dakuanjine;
    if (shenqing == null) {
      shenqing = 0;
    }
    if (yifu == null) {
      yifu = 0;
    }
    var updateWrapperzhang = new Wrapper();
    updateWrapperzhang.eq("id", xuangmuid);
    var toUpdatezhang = { charuziduan37: shenqing, ziduan28: yifu };
    var updatereszhangqi = ObjectStore.update("GT64724AT4.GT64724AT4.Playwithdetail", toUpdatezhang, updateWrapperzhang, "1cffde62");
    var updateWrapper = new Wrapper();
    updateWrapper.eq("ProjectVO", xiangmubianhao);
    var toUpdate = { zhixingjine: shijihezuojine, koccaigouchengben: ziduan34 };
    var updateres = ObjectStore.update("GT64724AT4.GT64724AT4.results", toUpdate, updateWrapper, "3ee5055f");
    var sql1 = "select * from GT64724AT4.GT64724AT4.results where dr=0 and ProjectVO='" + xiangmubianhao + "'";
    var res1 = ObjectStore.queryByYonQL(sql1);
    if (res1.length > 0) {
      // 同步业绩统计
      // 税点费用
      var shui = res1[0].zhixingjine * 0.06 - res1[0].caigoushuidiandikou;
      // 利润
      var zhangqijitichengben = res1[0].zhangqijitichengben;
      var gongfanqita = res1[0].gongfanqita;
      var li;
      if (zhangqijitichengben == null && gongfanqita == null) {
        li = res1[0].zhixingjine - res1[0].gongzhonghaocaigoujine - res1[0].koccaigouchengben - res1[0].xiaoguochengben - shui;
      } else if (zhangqijitichengben == null) {
        li = res1[0].zhixingjine - res1[0].gongzhonghaocaigoujine - res1[0].koccaigouchengben - res1[0].xiaoguochengben - shui - gongfanqita;
      } else if (gongfanqita == null) {
        li = res1[0].zhixingjine - res1[0].gongzhonghaocaigoujine - res1[0].koccaigouchengben - res1[0].xiaoguochengben - shui - zhangqijitichengben;
      } else {
        li = res1[0].zhixingjine - res1[0].gongzhonghaocaigoujine - res1[0].koccaigouchengben - res1[0].xiaoguochengben - shui - zhangqijitichengben - gongfanqita;
      }
      // 利润率
      var lirunlv = res1[0].zhixingjine / li;
      // 获取id
      var id = res1[0].id;
      var updateWrapper1 = new Wrapper();
      updateWrapper1.eq("ProjectVO", xiangmubianhao);
      var toUpdate1 = { shuidianfeiyong: shui, lirun: li, lirunlv: lirunlv };
      var updateres1 = ObjectStore.update("GT64724AT4.GT64724AT4.results", toUpdate1, updateWrapper1, "3ee5055f");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });