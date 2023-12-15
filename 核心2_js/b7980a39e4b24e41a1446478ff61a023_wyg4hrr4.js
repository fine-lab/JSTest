let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = ObjectStore.queryByYonQL("select id,zDYR08 from 	GT10779AT19.GT10779AT19.DQDA001 "); //group by Team,zDYR08
    var res2 = ObjectStore.queryByYonQL("select DQDA001_id,zDYR04 from 	 GT10779AT19.GT10779AT19.TD01 ");
    var res3 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR08.ZDYR08 where dr=0", "ucfbasedoc");
    var res4 = ObjectStore.queryByYonQL("select * from bd.customerdoc_ZDYR04.ZDYR04 where dr=0", "ucfbasedoc");
    res2.forEach((item) => {
      for (var i = 0; i < res.length; i++) {
        if (item.DQDA001_id == res[i].id) {
          item.zDYR08 = res[i].zDYR08;
        }
      }
      for (var i = 0; i < res3.length; i++) {
        if (item.zDYR08 == res3[i].id) {
          item.zDYR08name = res3[i].name;
        }
      }
      for (var i = 0; i < res4.length; i++) {
        if (!!item.zDYR04 && item.zDYR04 == res4[i].id) {
          item.ZDYR04name = res4[i].name;
        }
      }
    });
    for (var i = 0; i < res4.length; i++) {
      for (var j = 0; j < res2.length; j++) {
        if (res4[i].id == res2[j].zDYR04) {
          res4[i].zDYR08 = res2[j].zDYR08;
          res4[i].zDYR08name = res2[j].zDYR08name;
        }
      }
    }
    return { res: res4 };
  }
}
exports({ entryPoint: MyAPIHandler });