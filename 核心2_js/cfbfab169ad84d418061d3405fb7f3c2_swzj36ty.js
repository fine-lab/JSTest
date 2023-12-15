let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let base_path = "https://qz.tjscim.com:19998/tzjhtzykj/jtapprove/tzjhtzapproveListen";
    let data = param.data[0];
    //查询内容
    var object = {
      id: data.id
    };
    //实体查询
    var res = ObjectStore.selectById("GT21873AT3.GT21873AT3.tzjhtz", object);
    var resobj = {
      processEnd: "true",
      _entityName: "GT21873AT3.GT21873AT3.tzjhtz",
      code: res.code,
      jihuamingchen: res.jihuamingchen
    };
    var resdata = JSON.stringify(resobj);
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
    return true;
  }
}
exports({ entryPoint: MyTrigger });