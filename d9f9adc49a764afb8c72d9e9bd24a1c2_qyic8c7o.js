let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      data: {
        id: request.id,
        createOrg: request.createOrg,
        belongOrg: request.belongOrg,
        merchantDefine: {
          id: request.id,
          define5: request.sopStaus,
          _status: "Update"
        },
        _status: "Update"
      }
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "CUST", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });