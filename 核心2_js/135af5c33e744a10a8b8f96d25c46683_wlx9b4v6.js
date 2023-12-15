let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //意向信息单主键
    var person_name = request.person_name;
    //收证合同主键
    var idnumber = request.idnumber;
    //单据状态
    var verifystate = request.verifystate;
    //查询【闲置】、【出证】状态的收证合同数据
    if (verifystate === 0) {
      //开立态
      var sql = 'select id from GT60601AT58.GT60601AT58.certReceiContract  where vstate in (1,2) and person_name = "' + person_name + '" ';
      var rst = ObjectStore.queryByYonQL(sql);
      if (idnumber === undefined && rst.length > 0) {
        throw new Error("所选的人才姓名数据已存在正常数据，不可再次添加！");
      } else if (idnumber !== undefined && idnumber != rst[0].id) {
        throw new Error("所选的人才姓名数据已存在正常数据，不可再次添加！");
      }
    }
    return { verifystate };
  }
}
exports({ entryPoint: MyAPIHandler });