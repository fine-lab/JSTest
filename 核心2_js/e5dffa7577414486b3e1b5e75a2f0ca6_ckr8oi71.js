let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datas = request.data;
    //新增
    //组织
    var orgid = datas.org;
    //编码
    var codes = datas.code;
    //名称
    var names = datas.name;
    //时间
    var dates = datas.date;
    //信息
    var messages = datas.message;
    //是否成功
    var isSunccess = datas.isSuccess;
    //自定义状态
    var cutomStatusc = datas.customStatus;
    //消息体
    var body = {
      org_id: orgid,
      log_code: codes,
      names: names,
      shijian: dates,
      logDatas: messages,
      log_information: isSunccess,
      custom_status: cutomStatusc
    };
    //新增
    var res = ObjectStore.insert("AT17604A341D580008.AT17604A341D580008.logs", body, "logs");
    return { Insert: res };
  }
}
exports({ entryPoint: MyAPIHandler });