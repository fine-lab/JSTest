let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let value1 = request.level;
    //选择题
    let sql1 = "select * from GT68755AT20.GT68755AT20.testMeasures_hzy_10 where timusuoshulingyu = '" + value1 + "' and tixingxuanze = '" + 1 + "'";
    //判断题
    let sql2 = "select * from GT68755AT20.GT68755AT20.testMeasures_hzy_10 where timusuoshulingyu = '" + value1 + "' and tixingxuanze = '" + 2 + "'";
    var res1 = ObjectStore.queryByYonQL(sql1);
    var res2 = ObjectStore.queryByYonQL(sql2);
    //生成题库：选择题2题，判断题1题
    var numbers1 = res1.length - 1; //3
    var xz1 = 0;
    var xz2 = 0;
    if (numbers1 != 0 || numbers1 != null || numbers1 != undefined) {
      xz1 = parseInt(numbers1 * Math.random()); //生成0到2的随机数
      xz2 = parseInt(numbers1 * Math.random());
      while (xz2 == xz1) {
        xz2 = parseInt(numbers1 * Math.random());
      }
    }
    var numbers2 = res2.length - 1;
    var xz3 = 0;
    if (numbers1 != 0 || numbers1 != null || numbers1 != undefined) {
      xz3 = parseInt(numbers1 * Math.random()); //生成0到2的随机数
    }
    var value2 = res1[xz1];
    var value3 = res1[xz2];
    var value4 = res2[xz3];
    return { value2, value3, value4 };
  }
}
exports({ entryPoint: MyAPIHandler });