//读取身份证
viewModel.get("button46jf") &&
  viewModel.get("button46jf").on("click", function (data) {
    //读取身份证--单击
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
        console.log(result.IDCardInfo.cardID); // 输出身份证号
        console.log(result);
        cb.rest.invokeFunction("", {}, function (err, res) {
          viewModel.get("xuanzefangyuan_id").setValue(result.IDCardInfo.cardID);
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
//读取一张健康权益卡身份证
viewModel.get("button32oc") &&
  viewModel.get("button32oc").on("click", function (data) {
    //读取身份证--单击
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
        console.log(result.IDCardInfo.cardID); // 输出身份证号
        console.log(result);
        cb.rest.invokeFunction("", {}, function (err, res) {
          viewModel.get("shenfenzhenghaoma01xinkajihuo").setValue(result.IDCardInfo.cardID, true);
          viewModel.get("xingming01xinkajihuo").setValue(result.IDCardInfo.name, true); // 输出权益激活收益人姓名
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
//读取二张健康权益卡身份证
viewModel.get("button38pd") &&
  viewModel.get("button38pd").on("click", function (data) {
    //读取身份证--单击
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
        console.log(result.IDCardInfo.cardID); // 输出身份证号
        console.log(result);
        cb.rest.invokeFunction("", {}, function (err, res) {
          viewModel.get("shenfenzhenghaoma02xinkajihuo").setValue(result.IDCardInfo.cardID, true);
          viewModel.get("ziduan56").setValue(result.IDCardInfo.name, true); // 输出权益激活收益人姓名
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });