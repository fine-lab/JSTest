let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    if (!!data) {
      if (!!data.BusinessCode_project) {
        var xiangmu = ObjectStore.queryByYonQL("select * from GT1589AT1.GT1589AT1.YWH01 where code='" + data.BusinessCode_project_code + "'");
        if (xiangmu.length > 0) {
          if (!!!data.yewudalei) {
            if (param.data.length > 0) {
              param.data[0].set("yewudalei", !!xiangmu[0].yewudalei ? xiangmu[0].yewudalei : "");
              //业务大类
              var reszdyr01 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR01.ZDYR01 where id='" + xiangmu[0].yewudalei + "'", "ucfbasedoc");
              if (reszdyr01.length > 0) {
                param.data[0].set("yewudalei_name", reszdyr01[0].name);
              }
            }
          }
          if (!!!data.zDYR08) {
            if (param.data.length > 0) {
              param.data[0].set("zDYR08", !!xiangmu[0].zDYR08 ? xiangmu[0].zDYR08 : "");
              //分部
              var reszdyr08 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR08.ZDYR08 where id='" + xiangmu[0].zDYR08 + "'", "ucfbasedoc");
              if (reszdyr08.length > 0) {
                param.data[0].set("zDYR08_name", reszdyr08[0].name);
              }
            }
          }
          if (!!!data.dQDA001) {
            if (param.data.length > 0) {
              param.data[0].set("dQDA001", !!xiangmu[0].dQDA001 ? xiangmu[0].dQDA001 : "");
              var reszdyr03 = ObjectStore.queryByYonQL("select * from GT10779AT19.GT10779AT19.DQDA001 where id='" + xiangmu[0].dQDA001 + "'");
              //地区
              if (reszdyr08.length > 0) {
                param.data[0].set("dQDA001_diqu", reszdyr03[0].diqu);
              }
            }
          }
          if (!!!data.Customer) {
            if (param.data.length > 0) {
              param.data[0].set("Customer", !!xiangmu[0].kehubianma ? xiangmu[0].kehubianma : 0);
              param.data[0].set("Customer_name", !!xiangmu[0].kehumingchen ? xiangmu[0].kehumingchen : "");
            }
          }
          if (!!!data.supplier) {
            if (param.data.length > 0) {
              param.data[0].set("supplier", !!xiangmu[0].gongyingshang ? xiangmu[0].gongyingshang : 0);
              param.data[0].set("supplier_name", !!xiangmu[0].new15 ? xiangmu[0].new15 : "");
            }
          }
          if (!!!data.yewuhaomingchen) {
            if (param.data.length > 0) {
              param.data[0].set("yewuhaomingchen", !!xiangmu[0].yewumingchen ? xiangmu[0].yewumingchen : "");
            }
          }
        }
      }
      if (!!!data.Bankaccount) {
        if (param.data.length > 0) {
          var reszdyr09 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR09.ZDYR09 where id='" + data.zDYR09 + "'", "ucfbasedoc");
          if (reszdyr09.length > 0) {
            param.data[0].set("Bankaccount", reszdyr09[0].code);
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });