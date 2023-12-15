let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //拿子表数据
    var sql = "select * from GT21859AT11.GT21859AT11.productzsb where productcode = '" + id + "' ";
    var req = ObjectStore.queryByYonQL(sql);
    var caiwu = "";
    var kaipiao = "";
    caiwu = req.caiwu;
    kaipiao = req.kaipiao;
    //合并两条数据
    var hebin = id + kaipiao;
    //把不同的数据拿到一个集合当中(测试)
    var shuzu = new Array();
    //根据集合对应数据分别形成新集合
    //拿取新集合数据形成集合
    var sql2 = "select * from GT21859AT11.GT21859AT11.productzsb where productcode = '" + id + "' ";
    var req2 = ObjectStore.queryByYonQL(sql2);
    var shuju = req2;
    //返回集合即可
    return shuju;
    return {};
  }
}
exports({ entryPoint: MyTrigger });