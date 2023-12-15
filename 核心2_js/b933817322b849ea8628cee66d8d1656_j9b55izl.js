//基础数据读取身份证
viewModel.get("button195qe") &&
  viewModel.get("button195qe").on("click", function (data) {
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
          viewModel.get("xuanzemaishouren_code").setValue(result.IDCardInfo.cardID);
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
//权益激活读取身份证01
viewModel.get("button203hi") &&
  viewModel.get("button203hi").on("click", function (data) {
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
          viewModel.get("item2680fj").setValue(result.IDCardInfo.cardID, true);
          viewModel.get("quanyijihuoshouyirenxingming01").setValue(result.IDCardInfo.name, true); // 输出权益激活收益人姓名
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
//权益激活读取身份证02
viewModel.get("button205od") &&
  viewModel.get("button205od").on("click", function (data) {
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
          viewModel.get("item2878ag").setValue(result.IDCardInfo.cardID);
          viewModel.get("quanyijihuoshouyirenxingming02").setValue(result.IDCardInfo.name, true); // 输出权益激活收益人姓名
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
//权益激活读取身份证03
viewModel.get("button208pc") &&
  viewModel.get("button208pc").on("click", function (data) {
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
          viewModel.get("item3067nf").setValue(result.IDCardInfo.cardID);
          viewModel.get("quanyijihuoshouyirenxingming03").setValue(result.IDCardInfo.name, true); // 输出权益激活收益人姓名
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
//权益激活读取身份证04
viewModel.get("button212mf") &&
  viewModel.get("button212mf").on("click", function (data) {
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
          viewModel.get("item3250yh").setValue(result.IDCardInfo.cardID);
          viewModel.get("quanyijihuoshouyirenxingming04").setValue(result.IDCardInfo.name, true); // 输出权益激活收益人姓名
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
//权益激活读取业主卡
viewModel.get("button229kj") &&
  viewModel.get("button229kj").on("click", function (data) {
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
          viewModel.get("item2684sc_code").setValue(result.IDCardInfo.cardID);
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
viewModel.get("button229kj") &&
  viewModel.get("button229kj").on("click", function (data) {
    //拍照--单击
    window.open("http://localhost/"); // 打开网址http://localhost/
  });