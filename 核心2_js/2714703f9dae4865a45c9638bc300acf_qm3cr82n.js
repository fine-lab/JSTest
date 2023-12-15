let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取当前账号绑定的用户名
    var name = JSON.parse(AppContext()).currentUser.name;
    // 组装入参的json对象（不要传string）
    var json = { xingming: name, dakashijian: request.date, yuangong: "baa69c33-3ece-4dd8-8e9c-49bc45a91303" };
    // 执行插入语句
    var res = ObjectStore.insert("GT28586AT162.GT28586AT162.punchRecord", json, "d680e816");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });