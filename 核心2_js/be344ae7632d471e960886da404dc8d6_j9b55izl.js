const options = {
  // 定义请求选项
  hostname: "127.0.0.1", // 请求的主机名
  port: 38088, // 请求的端口号
  path: "/card=idcard", // 请求的路径
  method: "POST" // 请求的方法为POST
};
fetch("http://127.0.0.1:38088/card=idcard", options) // 发送请求
  .then((response) => response.json()) // 将响应数据解析为JSON格式
  .then((result) => {
    console.log("123");
    console.log(result);
    viewModel.get("item276lk_id").on("afterValueChange", function (data) {
      console.log(result);
    });
  })
  .catch((error) => {
    console.error(error); // 输出错误信息
  });