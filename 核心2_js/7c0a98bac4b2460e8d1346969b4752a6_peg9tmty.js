let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取前端脚本传来的委托方ID、
    let clientId = request.clientId;
    // 使用sql进行查询委托方信息
    let clientSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation where dr=0 and limit 0,5000";
    let clientRes = ObjectStore.queryByYonQL(clientRes);
    // 判断委托方信息是否存在
    if (clientRes.length > 0) {
      for (let i = 0; i < clientRes.length; i++) {
        let clientReq = clientRes[i];
        // 获取委托方启用状态
        let enable = clientReq.enable;
        // 判断是否启用委托方
        if ((enable = 0)) {
          return { res: "委托方信息未启用" };
        } else {
          // 判断委托方经营许可证是否在有效期内
          let expiryDate = clientReq.expiryDate;
          // 将获取到的有效期转化为时间戳
        }
      }
    } else {
      return { res: "在委托方档案中没有该委托方编码的数据" };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });