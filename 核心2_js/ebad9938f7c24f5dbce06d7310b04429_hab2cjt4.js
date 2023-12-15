let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 测试获取页面传递数据。
    let data = request.data;
    let url = request.url;
    let state = request.state;
    let objectArr = [];
    for (var i = data.length - 1; i >= 0; i--) {
      let obj = {
        id: data[i],
        state: state
      };
      objectArr.push(obj);
    }
    var res = ObjectStore.updateBatch(url, objectArr);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });