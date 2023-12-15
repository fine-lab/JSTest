let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取请求数据
    var obj = request.data;
    //查看状态设置为已读
    obj.gongyingshangchakanzhuangtai = "1";
    var res = ObjectStore.updateById("GT3AT2.GT3AT2.sh_01", obj);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });