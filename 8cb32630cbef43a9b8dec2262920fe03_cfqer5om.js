let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 可以弹出具体的信息（类似前端函数的alert）
    //生成uuid
    //信息体
    let body = {
      receive_id: "youridHere",
      msg_type: "text",
      content: '{"text":"杨嘉龙test content测试通过"}',
      uuid: "youridHere"
    };
    //信息头
    let header = {
      Authorization: "Bearer t-g1045qeeD4OERNY2E4XUHLXJ6AOWH7I76KBRFSPU",
      "Content-Type": "application/json; charset=utf-8"
    };
    // 可以直观的看到具体的错误信息
    let responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return {
      responseObj
    };
  }
}
exports({
  entryPoint: MyTrigger
});