let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    let body = {
      categories: ["ad", "politics", "abuse", "porn", "contraband", "flood"],
      items: [
        {
          text: request.text,
          type: "content"
        }
      ]
    }; //请求参数
    let apiResponse = openLinker("POST", url, "GT6641AT24", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    let res = JSON.parse(apiResponse);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });