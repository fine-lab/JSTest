let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询是否存在
    var sql = `select count(1) cnt from AT1601184E09C80009.AT1601184E09C80009.Business where sf_code = '${request.request.sf_code}'`;
    var rows = ObjectStore.queryByYonQL(sql);
    var res = new Object();
    //数量为空的时候插入
    if (parseInt(rows[0].cnt) <= 0) {
      var object = {
        code: request.request.code,
        sf_code: request.request.sf_code,
        name: request.request.name,
        person: request.request.person,
        stage: request.request.stage,
        client: request.request.client
      };
      res = ObjectStore.insert("AT1601184E09C80009.AT1601184E09C80009.Business", object, "916c3d1bList");
    } else {
      var sqlInfo = `select * from AT1601184E09C80009.AT1601184E09C80009.Business where sf_code = '${request.request.sf_code}'`;
      var businessInfo = ObjectStore.queryByYonQL(sqlInfo);
      // 更新条件
      var updateWrapper = new Wrapper();
      // 书本分类名为计算机类、件数>200
      updateWrapper.eq("sf_code", request.request.sf_code);
      // 待更新字段内容
      var toUpdate = {
        code: request.request.code,
        name: request.request.name,
        person: request.request.person,
        stage: request.request.stage,
        client: request.request.client
      };
      res = ObjectStore.update("AT1601184E09C80009.AT1601184E09C80009.Business", toUpdate, updateWrapper, "916c3d1bList");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });