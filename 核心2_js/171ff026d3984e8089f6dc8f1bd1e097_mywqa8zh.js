let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var param = [
      {
        name: "安",
        age: "20"
      },
      {
        name: "王",
        age: "25"
      },
      {
        name: "李",
        age: "18"
      },
      {
        name: "刘",
        age: "40"
      },
      {
        name: "张",
        age: "60"
      },
      {
        name: "赵",
        age: "10"
      },
      {
        name: "陈",
        age: "40"
      },
      {
        name: "赵",
        age: "100"
      }
    ];
    //请求地址
    let url = "https://s58g509438.goho.co:443/csv";
    //头部信息
    let header = {
      //提交格式
      "Content-Type": "application/json;charset=UTF-8"
    };
    let strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(param));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });