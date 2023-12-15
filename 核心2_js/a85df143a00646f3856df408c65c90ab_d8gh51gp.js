let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取检测项目编码
    var testings = "Iy02"; //检测项目编码
    throw new Error(testings);
    var testingsSql = "select * from bd.project.ProjectVO where code = '" + testings + "' and dr = 0";
    var testingsres = ObjectStore.queryByYonQL(testingsSql, "ucfbasedoc");
    return { testingsres };
    if (testingsres.length == 0) {
      var err = "  -- 检测项目编码查询为空,请检查'检测项目编码'字段 --  ";
      throw new Error(err);
    }
    //检测项目编码id
    var testingsId = testingsres[0].id;
    //项目自定义项子表
    var projectSonSql = "select * from bd.project.ProjectVODefine where id = '" + testingsId + "'";
    var projectSonRes = ObjectStore.queryByYonQL(projectSonSql, "ucfbasedoc");
    return { projectSonRes };
    //项目中产品线自定义项字段
    var weihuID = projectSonRes[0].define1;
    if (weihuID == null) {
      var err = "-- " + testingsres[0].code + "：项目没有绑定产品线,请检查 --";
      throw new Error(err);
    }
    //获取跟检测项目绑定的检测方式；
    var defineJCFS = projectSonRes[0].define2;
    if (defineJCFS == null) {
      var err = "-- " + testingsres[0].code + "：项目没有绑定检测方式,请检查 --";
      throw new Error(err);
    }
  }
}
exports({ entryPoint: MyAPIHandler });