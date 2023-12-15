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
      var object = { id: id, xiaoshouyewuleixing: "运营项目单（运营开单）", _status: "Update" };
      var res = ObjectStore.updateById("GT6363AT15.GT6363AT15.XS001", object, "yb2a4ceb8d");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });