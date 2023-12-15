let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT6923AT3.checkOrderBe.getAccessToken");
    let res = func1.execute(null, null);
    let token = res.access_token;
    let orderId = request.id;
    let fileStasus = request.fileStasus;
    let saveOeder = {
      data: {
        resubmitCheckKey: S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4(),
        id: orderId,
        _status: "Update",
        headItem: {
          id: orderId,
          define8: fileStasus,
          _status: "Update"
        }
      }
    };
    var saveOrder = postman("post", "https://www.example.com/" + token, "", JSON.stringify(saveOeder));
    return { saveOeder };
  }
}
exports({ entryPoint: MyAPIHandler });