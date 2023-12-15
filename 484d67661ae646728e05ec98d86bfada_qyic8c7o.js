let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    var proxy = cb.rest.DynamicProxy.create({
      accept: {
        url: url,
        method: "POST",
        options: { async: true, domainKey: "yourKeyHere" }
      }
    });
    var params = {
      billnum: "sfa_opptcard",
      data: JSON.stringify(request.data)
    };
    proxy.accept(params, function (err, result) {
      if (err) {
        cb.utils.alert(err.message, "error");
        return;
      }
      return result;
    });
  }
}
exports({ entryPoint: MyAPIHandler });