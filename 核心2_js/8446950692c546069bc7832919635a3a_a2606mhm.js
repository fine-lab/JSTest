let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //总分
    var value1 = request.number1;
    //得分
    var value2 = request.number2;
    var value3 = request.id;
    //联系方式
    var value4 = request.iphone;
    var value5 = value4.split("-")[1];
    //题目名称id
    var value6 = request.timunames.xuanzeshitiv3;
    //计数
    var lj = 0;
    //时间操作
    //查询更新
    var sql1 = "select id from GT65548AT19.GT65548AT19.text_hzyV2_17 where renyuan ='" + value3 + "'";
    var res1 = ObjectStore.queryByYonQL(sql1);
    //查询题库名称
    var sql2 = "select shitimingchen from GT65548AT19.GT65548AT19.text_hzyV2_15 where id ='" + value6 + "'";
    var res5 = ObjectStore.queryByYonQL(sql2); //res5[0].shitimingchen
    //查询之前的得分
    if (res1.length == 0) {
      //插入实体
      var object3 = {
        renyuan: value3,
        zongfen: value1,
        defen: value2,
        iphone: value4,
        kaoshimingchen: res5[0].shitimingchen
      };
      var res3 = ObjectStore.insert("GT65548AT19.GT65548AT19.text_hzyV2_17", object3, "8f8adc7fList");
    } else {
      //查询之前的得分
      var sql4 = "select defen from GT65548AT19.GT65548AT19.text_hzyV2_17 where renyuan ='" + value3 + "'";
      var res4 = ObjectStore.queryByYonQL(sql4);
      var defen1 = res4[0].defen;
      if (defen1 < value2) {
        defen1 = value2;
      }
      //更新实体
      var object2 = { id: res1[0].id, zongfen: value1, defen: defen1, iphone: value4, kaoshimingchen: res5[0].shitimingchen };
      var res2 = ObjectStore.updateById("GT65548AT19.GT65548AT19.text_hzyV2_17", object2, "8f8adc7fList");
    }
    return { res5 };
  }
}
exports({ entryPoint: MyAPIHandler });