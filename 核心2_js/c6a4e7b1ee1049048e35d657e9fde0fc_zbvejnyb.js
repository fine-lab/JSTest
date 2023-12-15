let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var xiangmubianhao = param.data[0].xiangmubianhao;
    var sql = "select id,sum(shijihezuojine),sum(shijicaigoujiage) from GT64724AT4.GT64724AT4.Playwithdetail where dr=0 and xiangmubianhao='" + xiangmubianhao + "'";
    var res = ObjectStore.queryByYonQL(sql);
    var shijihezuojine;
    var shijicaigoujiage;
    shijihezuojine = res[0].shijihezuojine;
    shijicaigoujiage = res[0].shijicaigoujiage;
    if (shijihezuojine == null) {
      shijihezuojine = 0;
    }
    if (shijicaigoujiage == null) {
      shijicaigoujiage = 0;
    }
    var updateWrapper = new Wrapper();
    updateWrapper.eq("ProjectVO", xiangmubianhao);
    var toUpdate = { zhixingjine: shijihezuojine, gongzhonghaocaigoujine: shijicaigoujiage };
    var updateres = ObjectStore.update("GT64724AT4.GT64724AT4.results", toUpdate, updateWrapper, "3ee5055f");
    var sql1 = "select * from GT64724AT4.GT64724AT4.results where dr=0 and ProjectVO='" + xiangmubianhao + "'";
    var res1 = ObjectStore.queryByYonQL(sql1);
    if (res1.length > 0) {
      // 税点费用
      var shui = res1[0].zhixingjine * 0.06 - res1[0].caigoushuidiandikou;
      // 利润
      var zhangqijitichengben = res1[0].zhangqijitichengben;
      var gongfanqita = res1[0].gongfanqita;
      var li;
      // 已回金额汇总
      var yihui;
      yihui = res1[0].ziduan25;
      if (yihui == null) {
        yihui = 0;
      }
      var weihui = res1[0].zhixingjine - yihui;
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
      var lirunlv = (li / res1[0].zhixingjine) * 100;
      // 获取id
      var id = res1[0].id;
      var updateWrapper1 = new Wrapper();
      updateWrapper1.eq("ProjectVO", res1[0].ProjectVO);
      var toUpdate1 = { shuidianfeiyong: shui, lirun: li, lirunlv: lirunlv, weihuijinehuizong: weihui };
      var updateres1 = ObjectStore.update("GT64724AT4.GT64724AT4.results", toUpdate1, updateWrapper1, "3ee5055f");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });