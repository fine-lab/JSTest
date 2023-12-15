let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(context) {
    try {
      // 获取收入类中所有的科目类别，编码，借贷方向等信息，供后续使用
      let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectType = funcSubjectType.execute(context, "收入类");
      // 定义一个codes的list  用于存放科目编码所有
      var codes = resSubjectType.res.codes;
      // 获取所有科目及其子科目的信息
      context.codes = codes;
      let funcSub = extrequire("AT17AF88F609C00004.common.getSubjectsAll");
      let ressub = funcSub.execute(context);
      let resObject = {
        ressub: ressub
      };
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getSubjectSub报错：" + e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });