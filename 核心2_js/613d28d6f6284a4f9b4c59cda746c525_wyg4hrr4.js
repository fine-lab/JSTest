let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    if (!!data.yewuhaoxiangmu) {
      var xiangmu = ObjectStore.queryByYonQL("select * from GT1589AT1.GT1589AT1.YWH01 where id='" + data.yewuhaoxiangmu + "'");
      if (xiangmu.length > 0) {
        if (!!!data.zDYR01) {
          param.data[0].set("zDYR01", xiangmu[0].yewudalei);
          //业务大类
          var reszdyr01 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR01.ZDYR01 where id='" + data.zDYR01 + "'", "ucfbasedoc");
          if (reszdyr01.length > 0) {
            param.data[0].set("zDYR01_name", reszdyr01[0].name);
          }
        }
        if (!!!data.zDYR08) {
          param.data[0].set("suoshufenbu", xiangmu[0].zDYR08);
          //分部
          var reszdyr08 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR08.ZDYR08 where id='" + data.suoshufenbu + "'", "ucfbasedoc");
          if (reszdyr08.length > 0) {
            param.data[0].set("suoshufenbu_name", reszdyr08[0].name);
          }
        }
        if (!!!data.suoshudiqu) {
          param.data[0].set("suoshudiqu", xiangmu[0].dQDA001);
          //地区
          var reszdyr03 = ObjectStore.queryByYonQL("select * from GT10779AT19.GT10779AT19.DQDA001 where id='" + data.suoshudiqu + "'");
          if (reszdyr08.length > 0) {
            param.data[0].set("suoshudiqu_name", reszdyr03[0].diqu);
          }
        }
        if (!!!data.merchant) {
          param.data[0].set("merchant", xiangmu[0].kehubianma);
          param.data[0].set("merchant_name", xiangmu[0].kehumingchen);
        }
        if (!!!data.gongyingshang) {
          param.data[0].set("gongyingshang", xiangmu[0].gongyingshang);
          param.data[0].set("gongyingshang_name", xiangmu[0].new15);
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });