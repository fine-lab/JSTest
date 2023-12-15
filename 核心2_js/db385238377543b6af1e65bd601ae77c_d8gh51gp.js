let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取检测项目编码
    var testings = "Mr07"; //检测项目编码
    var testingsSql = "select * from bd.project.ProjectVO where code = '" + testings + "' and dr = 0";
    var testingsres = ObjectStore.queryByYonQL(testingsSql, "ucfbasedoc");
    if (testingsres.length == 0) {
      var err = "  -- 检测项目编码查询为空,请检查'检测项目编码'字段 --  ";
      throw new Error(err);
    }
    var arrayByTestingsres = testingsres[0];
    //产品线
    if (arrayByTestingsres.hasOwnProperty("defineCharacter") == false) {
      throw new Error(" -- 检测方法未维护 --");
    }
    var attrext = arrayByTestingsres.defineCharacter;
    if (attrext.hasOwnProperty("attrext12") == false) {
      var err = "-- " + arrayByTestingsres.code + "：项目没有绑定产品线,请检查 --";
      throw new Error(err);
    }
    var weihuID = attrext.attrext12;
    if (attrext.hasOwnProperty("attrext42") == false) {
      var err = "-- " + arrayByTestingsres.code + "：项目没有绑定检测方式,请检查 --";
      throw new Error(err);
    }
    var defineJCFS = attrext.attrext42;
    var data = {
      attrext12: weihuID,
      attrext42: defineJCFS
    };
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });