let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //看一下业务信息
    //查看单据信息
    var billId = param.variablesMap.id;
    var sql = `select * from AT17EC16B41620000A.AT17EC16B41620000A.YWDJ WHERE id= ` + billId;
    var res = ObjectStore.queryByYonQL(sql);
    var param21 = { new2: "业务信息===" + JSON.stringify(res) };
    ObjectStore.insert("AT17EC16B41620000A.AT17EC16B41620000A.YWRZ", param21, "YWRZList");
    var cate = res[0].fenlei;
    //通过类别获取规则表
    var gzsql = `select * from AT17EC16B41620000A.AT17EC16B41620000A.GZGLSJ  `;
    var gzres = ObjectStore.queryByYonQL(gzsql);
    gzres = gzres.map((item) => {
      if (item.new4 == cate) return item;
    });
    var id = gzres[0].id;
    //获取符合条件的子表信息
    var gzhsql = `select * from AT17EC16B41620000A.AT17EC16B41620000A.GZGLSJZB  `;
    var gzhres = ObjectStore.queryByYonQL(gzhsql);
    gzhres = gzhres.map((item) => {
      if (item.GZGLSJ_id == id && item.bumen == "1518909034223108096") return item;
    });
    var param211 = { new2: "业务信息===" + JSON.stringify(gzhres) };
    ObjectStore.insert("AT17EC16B41620000A.AT17EC16B41620000A.YWRZ", param211, "YWRZList");
    var zhixing = gzhres[0].zhixing;
    return gzhres[0].zhixing;
  }
}
exports({ entryPoint: MyTrigger });