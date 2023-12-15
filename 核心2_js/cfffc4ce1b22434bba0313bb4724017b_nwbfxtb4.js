let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取前端函数数据
    let data1 = request.data;
    let id;
    for (let j = 0; j < data1.length; j++) {
      let value = data1[j];
      id = value.id;
      //更新实体
      var object = { id: id, jiesuankehu: "2588745165099776", _status: "Update" };
      var res = ObjectStore.updateById("GT6363AT15.GT6363AT15.XS001", object, "yb2a4ceb8d");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });