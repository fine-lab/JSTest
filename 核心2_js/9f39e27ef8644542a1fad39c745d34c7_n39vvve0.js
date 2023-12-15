let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.data.id;
    var time = new Date();
    var object = {
      id: "" + id + "",
      shifuyihuixie: "" + time + ""
    };
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      apicode: "90c04e2f30b84df18ff0ed29ece9a573",
      appkey: "yourkeyHere"
    };
    let apiResponse = apiman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(request.data));
    let resp = JSON.parse(apiResponse);
    if (resp.returnCode != null && resp.returnCode == "200") {
      var res = ObjectStore.updateById("GT1972AT1.GT1972AT1.TEST01", object);
      return {
        apiResponse
      };
    } else {
      return {
        apiResponse
      };
    }
  }
}
exports({ entryPoint: MyAPIHandler });