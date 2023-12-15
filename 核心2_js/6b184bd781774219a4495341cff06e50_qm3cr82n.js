let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      pageIndex: "1",
      pageSize: "10"
    };
    let func1 = extrequire("GT19153AT99.getoPenAPI.getAccessToken");
    let res = func1.execute(request);
    console.log(res);
    var token = res.access_token;
    //请求数据
    let apiResponse = postman("post", base_path.concat("?access_token=d2b78651d01646aea758bd918d3a4b1c"), JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });