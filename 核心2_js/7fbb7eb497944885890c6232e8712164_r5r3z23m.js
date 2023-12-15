let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var p = request.data.productID;
    var o = request.data.orgID;
    if (p.length > 0 && o.length > 0) {
      // 可以弹出具体的信息（类似前端函数的alert）
      //信息体
      let body = {};
      //信息头
      let header = {
        "Content-Type": "application/json;charset=UTF-8",
        apicode: "e92a1310367f4227b8fdaacef7de9fc8",
        appkey: "yourkeyHere"
      };
      // 可以直观的看到具体的错误信息
      let responseObj = apiman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(request));
      return {
        responseObj
      };
    } else {
      throw new Error("未选择物料，或未选择下发组织");
    }
  }
}
exports({ entryPoint: MyAPIHandler });