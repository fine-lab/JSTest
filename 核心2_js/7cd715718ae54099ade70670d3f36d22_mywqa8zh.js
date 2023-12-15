let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 可以弹出具体的信息（类似前端函数的alert）
    //信息体
    let body = {
      timestamp: "1659594321424",
      param:
        '{"logisticsNo":"XcPu49Eho6Z","senderName":"测试1","senderProvinceName":"上海","senderCityName":"上海市","senderCountyName":"青浦区","senderAddress":"汇金路100号","senderMobile":"15900521555","recipientName":"测试","recipientProvinceName":"重庆","recipientCityName":"重庆市","recipientCountyName":"万州区","recipientAddress":"汇金路100好","recipientMobile":"021-5985121","remark":"remark-test","gotCode":"123","increments":[{"type":4,"amount":888}],"goods":[{"name":"mobile","weight":5,"length":10,"width":20,"height":5,"price":100,"quantity":1},{"name":"mobile1","weight":1,"length":1,"width":1,"height":1,"price":1,"quantity":1}],"startTime":"2022-08-04 14:25:21","endTime":"2022-08-04 14:25:21","cstOrderNo":"csorderno","weight":5,"productCode":"PK"}',
      sign: "z6x3cE+YWR+o1YgBiXdofg==",
      format: "JSON"
    };
    return {
      body
    };
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      // 就是appCode
      apicode: "5fa61d7dd1054db4a4ccda29ead91b8c",
      appkey: "yourkeyHere"
    };
    // 可以是http请求
    // 也可以是https请求
    let responseObj = apiman("get", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    // 可以直观的看到具体的错误信息
    throw new Error(responseObj);
    return {
      responseObj
    };
  }
}
exports({
  entryPoint: MyTrigger
});