//客户&意见改进表
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let shiyebu = request.shiyebu;
    let shiyebu_name = request.shiyebu_name; //事业部名称
    var object = { shiyebu: shiyebu, shiyebu_name: shiyebu_name };
    var res = ObjectStore.updateById("AT17854C0208D8000B.AT17854C0208D8000B.khcpjy", object, "ybcfdffbf7"); //URI  单据编码
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });