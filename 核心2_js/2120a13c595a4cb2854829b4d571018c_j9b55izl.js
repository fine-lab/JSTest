//读取身份证
viewModel.get("button135qf") &&
  viewModel.get("button135qf").on("click", function (data) {
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
viewModel.get("button145uc") &&
  viewModel.get("button145uc").on("click", function (data) {
    //拍照--单击
    window.open("http://localhost/"); // 打开网址http://localhost/
  });
//读取权益卡01
viewModel.get("button55ka") &&
  viewModel.get("button55ka").on("click", function (data) {
    fetch("http://127.0.0.1:5000/read_card")
      .then((response) => response.json())
      .then((result) => {
        if (result && result.IDCardInfo && result.IDCardInfo.strICUID) {
          console.log(result.IDCardInfo.strICUID); // 输出卡号
          console.log(result);
          cb.rest.invokeFunction("", {}, function (err, res) {
            viewModel.get("item2521nb_code").setValue(result.IDCardInfo.strICUID, true);
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
viewModel.get("button80xc") &&
  viewModel.get("button80xc").on("click", function (data) {
    fetch("http://127.0.0.1:5000/read_card")
      .then((response) => response.json())
      .then((result) => {
        if (result && result.IDCardInfo && result.IDCardInfo.strICUID) {
          console.log(result.IDCardInfo.strICUID); // 输出卡号
          console.log(result);
          cb.rest.invokeFunction("", {}, function (err, res) {
            viewModel.get("item2832mc_code").setValue(result.IDCardInfo.strICUID, true);
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
viewModel.get("button106cj") &&
  viewModel.get("button106cj").on("click", function (data) {
    fetch("http://127.0.0.1:5000/read_card")
      .then((response) => response.json())
      .then((result) => {
        if (result && result.IDCardInfo && result.IDCardInfo.strICUID) {
          console.log(result.IDCardInfo.strICUID); // 输出卡号
          console.log(result);
          cb.rest.invokeFunction("", {}, function (err, res) {
            viewModel.get("item3136ic_code").setValue(result.IDCardInfo.strICUID, true);
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
viewModel.get("button133ck") &&
  viewModel.get("button133ck").on("click", function (data) {
    fetch("http://127.0.0.1:5000/read_card")
      .then((response) => response.json())
      .then((result) => {
        if (result && result.IDCardInfo && result.IDCardInfo.strICUID) {
          console.log(result.IDCardInfo.strICUID); // 输出卡号
          console.log(result);
          cb.rest.invokeFunction("", {}, function (err, res) {
            viewModel.get("item3433vc_shitikahao").setValue(result.IDCardInfo.strICUID, true);
          });
        } else {
          console.error("未获取到卡信息");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });