let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var clientId = request.clientCode;
    var clientSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation where clientCode = '" + clientId + "'";
    var clientRes = ObjectStore.queryByYonQL(clientSql, "developplatform");
    if (clientRes.length > 0) {
      // 查到数据
      // 说明委托方编码存在于委托方信息中, 获取委托方的启用状态
      var enable = clientRes[0].enable;
      if (enable == 1) {
        // 说明委托方是启用状态,获取委托方的许可证
        var expiryDate = clientRes[0].expiryDate;
        var nowDate = getNowFormatDate();
        // 对比许可证时间与当前时间做对比
        var date1 = new Date(expiryDate);
        var date2 = new Date(nowDate);
        if (date1 > date2) {
          // 获取委托方主表的id
          var masterId = clientRes[0].id;
          // 根据委托方主表id去查询委托合同
          var clientInfoSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.entrustmentContract where ClientInformation_id= '" + masterId + "'";
          var clientInfoRes = ObjectStore.queryByYonQL(clientInfoSql, "developplatform");
          let arr = new Array();
          for (var i = 0; i < clientInfoRes.length; i++) {
            // 每一条委托合同数据
            var clientDetails = clientInfoRes[i];
            // 委托方子表委托合同有效期(停止委托时间)
            var endDate = clientDetails.endDate;
            // 当前时间与停止委托时间对比
            var clientInfoDate = new Date(endDate);
            if (clientInfoDate > date2) {
              arr.push(clientDetails);
            } else {
              // 循环对比每一条委托合同停止委托时间，不在有委托期跳出进入下一次循环
              continue;
            }
          }
          // 判断委托合同是否在有效期
          if (arr.length > 0) {
          } else {
            throw new Error("当前时间与当前委托方企业的所有委托方合同有效期都不匹配!");
          }
        } else {
          throw new Error("委托方经营许可证未在有效期内!");
        }
      } else {
        throw new Error("委托方未启用!");
      }
    } else {
      throw new Error("在委托方档案中没有该委托方编码的数据！");
    }
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      // 给月份为一位数数据前面加"0"
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });