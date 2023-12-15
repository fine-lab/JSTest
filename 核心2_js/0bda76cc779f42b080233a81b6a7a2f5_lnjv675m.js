let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = request.code;
    let id = request.id;
    let idstr = "";
    let codestr = "";
    if (!!id) {
      idstr = "id=" + UrlEncode(id);
    }
    if (!!code) {
      codestr = "code=" + UrlEncode(code);
    }
    let baseurl = "https://www.example.com/" + (idstr == "" ? codestr : idstr);
    let apiResponse = openLinker("GET", baseurl, "GT34544AT7", JSON.stringify({})); //TODO：注意填写应用编码(请看注意事项)
    let res = JSON.parse(apiResponse);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });