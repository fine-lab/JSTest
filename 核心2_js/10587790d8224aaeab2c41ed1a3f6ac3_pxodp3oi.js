let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object = {
      shifukeyong: "1"
    };
    var sql = "select yhtUserId from GT3734AT5.GT3734AT5.txr where shifukeyong = " + 0;
    //实体查询
    var res = ObjectStore.queryByYonQL(sql);
    if (res != undefined && res.length > 0) {
      var uspaceReceiver = new Array(); //发送给具体的用户id列表
      for (var i = 0; i < res.length; i++) {
        let yhtUserId = res[i].yhtUserId; //组织id
        uspaceReceiver.push(yhtUserId);
      }
    } else {
      throw new Error("不需要发送，因为维护列表为空！" + JSON.stringify(res));
    }
    var channels = ["uspace"];
    var templateCode = "testmailcheck##uPuE5Kcd";
    var busiData = {
      name: "testuser"
    };
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      templateCode: templateCode, //模板编码
      uspaceReceiver: uspaceReceiver, //收件人
      busiData: busiData, //模板参数
      channels: channels //通道配置
    };
    var result = sendMessage(messageInfo);
    return { rst: true, msg: "success" };
  }
}
exports({ entryPoint: MyTrigger });