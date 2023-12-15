let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT34544AT7.authManager.getAll_orgAdmin");
    let res1 = func1.execute(request);
    let arr = res1.arr;
    let bodydata = {
      tree: request.tree,
      condition: arr,
      top: request.top,
      down: request.down
    };
    let url = "https://www.example.com/";
    var accept = postman("post", url, null, JSON.stringify(bodydata));
    var data1 = JSON.parse(accept).data;
    var res = JSON.parse(data1);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });