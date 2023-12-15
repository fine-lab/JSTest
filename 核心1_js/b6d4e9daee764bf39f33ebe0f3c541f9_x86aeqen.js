let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取前端脚本传入信息
    var guizeleixingbianma = request.guizeleixingmingchen;
    //查询符合条件的结果
    var gzlxhjsql = `select * from AT17FE7F8616F80008.AT17FE7F8616F80008.GZLXHJ `;
    var gzlxhjres = ObjectStore.queryByYonQL(gzlxhjsql);
    var param21 = { ziduan: "业务信息===" + JSON.stringify(gzlxhjres[0].new10) };
    ObjectStore.insert("AT17FE7F8616F80008.AT17FE7F8616F80008.YWRZS", param21, "YWRZSList");
    gzlxhjres = gzlxhjres.filter((item) => {
      return item.new10 == guizeleixingbianma;
    });
    var array = gzlxhjres.map((item, index) => {
      if (item.zhixingyaoqiu == "1728967664119316481") {
        return { huanjiebianma: item.huanjiebianma, huanjiemingchen: item.huanjiemingchen, morenzhixingren: item.morenzhixingren, zhixingyaoqiu: "必选" };
      } else {
        return { huanjiebianma: item.huanjiebianma, huanjiemingchen: item.huanjiemingchen, morenzhixingren: item.morenzhixingren, zhixingyaoqiu: "可选" };
      }
    });
    //返回前端
    return { res: array };
  }
}
exports({ entryPoint: MyAPIHandler });