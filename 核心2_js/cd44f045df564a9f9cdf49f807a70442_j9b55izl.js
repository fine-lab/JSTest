let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var jsonData = JSON.stringify(context); // 转成JSON格式
    var jsonparam = JSON.stringify(param); // 转成JSON格式
    // 可以弹出具体的信息（类似前端函数的alert）
    throw new Error("contextResult====>" + jsonData + "  param====> " + jsonparam);
    // 定义一个POST请求需要提交的数据
    const postData = {
      iccardtype: "2"
    };
    // 初始化一个空字符串变量
    let cleanedStrICUID = "";
    // 定义请求的选项
    const options = {
      method: "POST", // 请求的方法
      headers: {
        // 请求头信息
        "Content-Type": "application/json" // 请求数据类型为json
      },
      body: JSON.stringify(postData) // 请求的数据
    };
    // 发起http请求
    fetch("https://127.0.0.1:38088/card=iccard", options)
      .then((response) => {
        console.log(response);
        // 对响应头进行处理，允许content-type字段
        if (response.headers.has("Access-Control-Allow-Headers")) {
          const headers = response.headers.get("Access-Control-Allow-Headers");
          if (!headers.includes("content-type")) {
            throw new Error("content-type is not allowed by Access-Control-Allow-Headers in preflight response");
          }
        }
        return response.json();
      })
      .then((jsonData) => {
        const strICUID = jsonData.strICUID; // 获取JSON对象的strICUID字段的值
        const strICUIDArr = strICUID.split(" "); // 将strICUID字段的值按空格切割成数组
        const reversedStrICUIDArr = strICUIDArr.reverse(); // 将数组倒序排列
        cleanedStrICUID = reversedStrICUIDArr.join(""); // 将数组转为字符串
        jsonData.strICUID = parseInt(cleanedStrICUID, 16); // 将字符串解析为16进制数字，并赋值给JSON对象的strICUID字段
        console.log(jsonData.strICUID); // 只输出strICUID字段的值
      })
      .catch((error) => {
        console.error(error);
      });
    return {};
  }
}
exports({ entryPoint: MyTrigger });