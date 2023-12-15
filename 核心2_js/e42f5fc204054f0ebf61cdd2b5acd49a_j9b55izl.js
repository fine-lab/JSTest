viewModel.get("button19nc") &&
  viewModel.get("button19nc").on("click", function (data) {
    //读取二代身份证--单击
    const http = require("http"); // 导入http模块
    const options = {
      // 定义请求选项
      hostname: "127.0.0.1", // 请求的主机名
      port: 38088, // 请求的端口号
      path: "/card=idcard", // 请求的路径
      method: "POST" // 请求的方法为POST
    };
    const req = http.request(options, (res) => {
      // 发送请求
      let data = ""; // 定义一个空字符串用于存储响应数据
      res.on("data", (chunk) => {
        // 监听响应数据的接收事件
        data += chunk; // 将数据拼接到字符串中
      });
      res.on("end", () => {
        // 监听响应数据接收完成事件
        const result = JSON.parse(data); // 解析响应数据为JSON格式
        console.log(result.IDCardInfo.cardID); // 输出身份证号
      });
    });
    req.on("error", (error) => {
      // 监听请求错误事件
      console.error(error); // 输出错误信息
    });
    req.end(); // 结束请求
  });
viewModel.get("button40kg") &&
  viewModel.get("button40kg").on("click", function (data) {
    //读取业主权益卡--单击
    // 引入http模块
    const http = require("http");
    // 定义一个POST请求需要提交的数据
    const postData = {
      iccardtype: "2"
    };
    // 初始化一个空字符串变量
    let cleanedStrICUID = "";
    // 定义请求的选项
    const options = {
      hostname: "127.0.0.1", // 请求的主机名
      port: 38088, // 请求的端口号
      path: "/card=iccard", // 请求的路径
      method: "POST", // 请求的方法
      headers: {
        // 请求头信息
        "Content-Type": "application/json", // 请求数据类型为json
        "Content-Length": Buffer.byteLength(JSON.stringify(postData)) // 请求数据的长度
      }
    };
    // 发起http请求
    const req = http.request(options, (res) => {
      let data = ""; // 定义一个空字符串变量用于存储响应数据
      res.on("data", (chunk) => {
        // 监听响应数据流事件
        data += chunk; // 每次收到数据都将其加入到data变量中
      });
      res.on("end", () => {
        // 监听响应结束事件
        try {
          const jsonData = JSON.parse(data); // 将响应数据解析为JSON对象
          const strICUID = jsonData.strICUID; // 获取JSON对象的strICUID字段的值
          const strICUIDArr = strICUID.split(" "); // 将strICUID字段的值按空格切割成数组
          const reversedStrICUIDArr = strICUIDArr.reverse(); // 将数组倒序排列
          cleanedStrICUID = reversedStrICUIDArr.join(""); // 将数组转为字符串
          jsonData.strICUID = parseInt(cleanedStrICUID, 16); // 将字符串解析为16进制数字，并赋值给JSON对象的strICUID字段
          console.log(jsonData.strICUID); // 只输出strICUID字段的值
        } catch (error) {
          // 捕获解析JSON数据时可能出现的错误
          console.error(error);
        }
      });
    });
    // 监听请求错误事件
    req.on("error", (error) => {
      console.error(error);
    });
    // 将数据写入请求体中
    req.write(JSON.stringify(postData));
    // 结束请求
    req.end();
  });