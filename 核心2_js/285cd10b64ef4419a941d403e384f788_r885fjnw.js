let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let aaa = {
      Documentsid: request.Documentsid,
      Documentstype: request.Documentstype,
      creater: request.creater,
      mark: request.mark
    };
    let test = request.Documentsid;
    let Body = JSON.stringify(aaa);
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT16976F5409A00009", JSON.stringify(aaa));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });