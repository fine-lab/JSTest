let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let base_path = "https://qz.tjscim.com:19998/ykj/ykjpushncctzjhservice/pushncc";
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
    } else {
      var editData = { id: data.id, shifuchenggongtuisongncc: "是" };
      var res = ObjectStore.updateById("GT21873AT3.GT21873AT3.cstzjhbz", editData, "fa57aa0e");
      var sql = "select * from GT21873AT3.GT21873AT3.cstzjhbz where id='" + data.id + "'";
      var rst = ObjectStore.queryByYonQL(sql);
      if (rst != null) {
        return { data: rst[0] };
      }
    }
  }
}
exports({ entryPoint: MyTrigger });