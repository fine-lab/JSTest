let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var xiangmubianhao = request.xiangmubianhao;
    var sql =
      "select sum(shijihezuojine),sum(shijicaigoujiage),sum(ziduan34),sum(xiaoguochengben),sum(caigoushuifeidikou) from GT64724AT4.GT64724AT4.Playwithdetail where dr=0 and xiangmubianhao='" +
      xiangmubianhao +
      "'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      var shijihezuojine = res[0].shijihezuojine;
      var shijicaigoujiage = res[0].shijicaigoujiage;
      var ziduan34 = res[0].ziduan34;
      var xiaoguochengben = res[0].xiaoguochengben;
      var caigoushuifeidikou = res[0].caigoushuifeidikou;
      // 同步业绩统计
      var updateWrapper = new Wrapper();
      updateWrapper.eq("ProjectVO", xiangmubianhao);
      var toUpdate = { zhixingjine: shijihezuojine, gongzhonghaocaigoujine: shijicaigoujiage, koccaigouchengben: ziduan34, xiaoguochengben: xiaoguochengben, caigoushuidiandikou: caigoushuifeidikou };
      var updateres = ObjectStore.update("GT64724AT4.GT64724AT4.results", toUpdate, updateWrapper, "3ee5055f");
      var sql1 = "select * from GT64724AT4.GT64724AT4.results where dr=0 and ProjectVO='" + xiangmubianhao + "'";
      var res1 = ObjectStore.queryByYonQL(sql1);
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
    } else {
      // 同步业绩统计
      var updateWrappernull = new Wrapper();
      updateWrappernull.eq("ProjectVO", xiangmubianhao);
      var toUpdatenull = {
        zhixingjine: 0,
        gongzhonghaocaigoujine: 0,
        koccaigouchengben: 0,
        xiaoguochengben: 0,
        caigoushuidiandikou: 0,
        shuidianfeiyong: 0,
        lirun: 0,
        lirunlv: 0,
        weihuijinehuizong: 0
      };
      var updateres = ObjectStore.update("GT64724AT4.GT64724AT4.results", toUpdatenull, updateWrappernull, "3ee5055f");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });