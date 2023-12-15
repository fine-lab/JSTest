let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, response, keyname) {
    try {
      //获取数据
      let funcGetSubjects = extrequire("AT17AF88F609C00004.common.getSubjects");
      var subjects = funcGetSubjects.execute(context);
      response[keyname] = subjects;
      return { response };
    } catch (e) {
      throw new Error("getDataByDate参数报错" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });