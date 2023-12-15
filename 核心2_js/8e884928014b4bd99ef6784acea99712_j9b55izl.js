//读取身份证
viewModel.get("button322eg") &&
  viewModel.get("button322eg").on("click", function (data) {
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
          viewModel.get("item2331de_code").setValue(result.IDCardInfo.cardID);
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
//变更激活读取身份证01
viewModel.get("button121ja") &&
  viewModel.get("button121ja").on("click", function (data) {
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
          viewModel.get("item2594pf").setValue(result.IDCardInfo.cardID, true);
          viewModel.get("biangengjihuoxianshouyiren01").setValue(result.IDCardInfo.name, true); // 输出权益激活收益人姓名
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
//变更激活读取身份证02
viewModel.get("button185mf") &&
  viewModel.get("button185mf").on("click", function (data) {
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
          viewModel.get("item2785zh").setValue(result.IDCardInfo.cardID);
          viewModel.get("biangengjihuoxianshouyiren02").setValue(result.IDCardInfo.name, true); // 输出权益激活收益人姓名
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
//变更激活读取身份证03
viewModel.get("button250md") &&
  viewModel.get("button250md").on("click", function (data) {
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
          viewModel.get("item2966cf").setValue(result.IDCardInfo.cardID);
          viewModel.get("biangengjihuoxianshouyiren03").setValue(result.IDCardInfo.name, true); // 输出权益激活收益人姓名
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
//变更激活读取身份证04
viewModel.get("button316wb") &&
  viewModel.get("button316wb").on("click", function (data) {
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
          viewModel.get("item3137oa").setValue(result.IDCardInfo.cardID);
          viewModel.get("biangengjihuoxianshouyiren04").setValue(result.IDCardInfo.name, true); // 输出权益激活收益人姓名
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
viewModel.get("button336rb") &&
  viewModel.get("button336rb").on("click", function (data) {
    //拍照--单击
    window.open("http://localhost/"); // 打开网址http://localhost/
  });