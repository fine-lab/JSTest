//读取身份证
viewModel.get("button64qi") &&
  viewModel.get("button64qi").on("click", function (data) {
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
          viewModel.get("xuanzemaishouren_jichushujumaishourenshenfenzhenghaoma").setValue(result.IDCardInfo.cardID);
        });
      })
      .catch((error) => {
        console.error(error); // 输出错误信息
      });
  });
//读取权益卡01
viewModel.get("button37mf") &&
  viewModel.get("button37mf").on("click", function (data) {
    fetch("http://127.0.0.1:5000/read_card")
      .then((response) => response.json())
      .then((result) => {
        if (result && result.IDCardInfo && result.IDCardInfo.strICUID) {
          console.log(result.IDCardInfo.strICUID); // 输出卡号
          console.log(result);
          cb.rest.invokeFunction("", {}, function (err, res) {
            viewModel.get("fakamingxixuanzekapian01_id").setValue(result.IDCardInfo.strICUID, true);
          });
        } else {
          console.error("未获取到卡信息");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
//读取权益卡02
viewModel.get("button41qc") &&
  viewModel.get("button41qc").on("click", function (data) {
    fetch("http://127.0.0.1:5000/read_card")
      .then((response) => response.json())
      .then((result) => {
        if (result && result.IDCardInfo && result.IDCardInfo.strICUID) {
          console.log(result.IDCardInfo.strICUID); // 输出卡号
          console.log(result);
          cb.rest.invokeFunction("", {}, function (err, res) {
            viewModel.get("fakamingxixuanzekapian02_id").setValue(result.IDCardInfo.strICUID, true);
          });
        } else {
          console.error("未获取到卡信息");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
//读取权益卡03
viewModel.get("button46fg") &&
  viewModel.get("button46fg").on("click", function (data) {
    fetch("http://127.0.0.1:5000/read_card")
      .then((response) => response.json())
      .then((result) => {
        if (result && result.IDCardInfo && result.IDCardInfo.strICUID) {
          console.log(result.IDCardInfo.strICUID); // 输出卡号
          console.log(result);
          cb.rest.invokeFunction("", {}, function (err, res) {
            viewModel.get("fakamingxixuanzekapian03_id").setValue(result.IDCardInfo.strICUID, true);
          });
        } else {
          console.error("未获取到卡信息");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
//读取权益卡04
viewModel.get("button52fb") &&
  viewModel.get("button52fb").on("click", function (data) {
    fetch("http://127.0.0.1:5000/read_card")
      .then((response) => response.json())
      .then((result) => {
        if (result && result.IDCardInfo && result.IDCardInfo.strICUID) {
          console.log(result.IDCardInfo.strICUID); // 输出卡号
          console.log(result);
          cb.rest.invokeFunction("", {}, function (err, res) {
            viewModel.get("fakamingxixuanzekapian04_id").setValue(result.IDCardInfo.strICUID, true);
          });
        } else {
          console.error("未获取到卡信息");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
viewModel.get("button54dd") &&
  viewModel.get("button54dd").on("click", function (data) {
    //拍照--单击
    window.open("http://localhost/"); // 打开网址http://localhost/
  });