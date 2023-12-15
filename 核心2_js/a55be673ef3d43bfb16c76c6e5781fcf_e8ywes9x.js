let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //后端API
    //获取前端函数传递的数据
    let { start, rows } = request;
    //公有云验证接口
    let apiResponse = postman("get", "https://www.example.com/");
    //把字符串转成JSON对象
    let apiData = JSON.parse(apiResponse);
    //得到验证码
    let Authorization = apiData.data;
    let header = { Authorization: Authorization };
    let body = {};
    let url = 'https://iot.diwork.com/thing/api/v1/product/simple?pageInfo={"pageNum":' + start + ',"pageSize":' + rows + "}";
    //执行接口获取数据
    let result = postman("get", url, JSON.stringify(header), JSON.stringify(body));
    //解析数据  把字符串数据转成JSON对象
    let resultJson = JSON.parse(result);
    //获取想要的数据  eMList
    let eMList = resultJson.data.items;
    return { data: eMList };
  }
}
exports({ entryPoint: MyAPIHandler });