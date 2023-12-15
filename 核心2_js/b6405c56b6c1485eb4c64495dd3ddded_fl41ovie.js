let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let base_path = "https://qz.tjscim.com:19988/ykj/ykjpushncctzjhtzservice/pushncc";
    let data = param.data[0];
    var resdata = JSON.stringify(data);
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    let apiResponse = postman("post", base_path, JSON.stringify(header), resdata);
    var obj = JSON.parse(apiResponse);
    var msgSuccess = obj.msgSuccess;
    if (!msgSuccess) {
      throw new Error(obj.desc);
      return false;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });