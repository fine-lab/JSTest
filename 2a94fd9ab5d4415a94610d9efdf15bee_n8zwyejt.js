viewModel.get("button34xi").setVisible(false);
if (viewModel.getParams().mode !== "add") {
  viewModel.get("button34xi").setVisible(true);
}
viewModel.get("button34xi") &&
  viewModel.get("button34xi").on("click", function (data) {
    // 上传国家医疗器械标识库--单击
    //获取接口调用凭据
    cb.utils.alert("接口维护中...", "error");
  });
function userApi(urlType, urlInfo, header, body) {
  cb.rest.invokeFunction(
    "I0P_UDI.publicFunction.apiManInfo",
    {
      //传入参数 sqlType：类型
      urlType: urlType,
      urlInfo: urlInfo,
      header: header,
      body: body
    },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("查询数据异常");
        return false;
      }
      console.log(res.apiResponse);
      return res.apiResponse;
    }
  );
}
//连通性测试
function getConnectionTest() {
  //信息头
  let header = {
    "Content-Type": "application/json;charset=UTF-8"
  };
  //信息体
  let body = {};
  //连通性测试
  cb.rest.invokeFunction(
    "I0P_UDI.publicFunction.apiManInfo",
    {
      //传入参数 sqlType：类型
      urlType: "post",
      urlInfo: "https://www.example.com/",
      header: header,
      body: body
    },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("查询数据异常");
        return false;
      }
      console.log(res.apiResponse);
    }
  );
}
//获取接口调用凭据
function getApiToken() {
  //信息头
  let header = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  //信息体
  let obj = {
    params: {
      appId: "应用码",
      appSecret: "应用授权码",
      TYSHXYDM: "统一社会信用代码"
    }
  };
  let urlType = "post";
  let urlInfo = "https://www.example.com/";
  let obj1 = new URLSearchParams();
  obj1.append("appId", "2342");
  obj1.append("appSecret", "2342");
  obj1.append("TYSHXYDM", "2342");
  let obj2 = new URLSearchParams();
  obj2.append("params", obj1.toString());
  let rsData = userApi(urlType, urlInfo, header, obj2.toString());
  console.log(rsData);
}
viewModel.get("yjlb_rangeName") &&
  viewModel.get("yjlb_rangeName").on("afterValueChange", function (data) {
    // 一级类别--值改变后
    viewModel.get("item511ae").setValue("");
    viewModel.get("item412mi").setValue("");
    viewModel.get("ejlb_rangeName").setValue("");
    viewModel.get("item612yf").setValue("");
    viewModel.get("sjlb_rangeName").setValue("");
  });
viewModel.get("ejlb_rangeName") &&
  viewModel.get("ejlb_rangeName").on("afterValueChange", function (data) {
    // 二级类别--值改变后
    viewModel.get("item612yf").setValue("");
    viewModel.get("sjlb_rangeName").setValue("");
    let yij = viewModel.get("item313sc").getValue();
    let erj = viewModel.get("item412mi").getValue();
    let yflbm = yij + "-" + erj;
    viewModel.get("FLBM").setValue(yflbm);
  });
viewModel.get("sjlb_rangeName") &&
  viewModel.get("sjlb_rangeName").on("afterValueChange", function (data) {
    // 三级类别--值改变后
    let yij = viewModel.get("item313sc").getValue();
    let erj = viewModel.get("item412mi").getValue();
    let sanj = viewModel.get("item612yf").getValue();
    let sanjt = "-" + sanj;
    if (sanj === null || sanj === undefined || sanj === "") {
      sanjt = "";
    }
    let yflbm = yij + "-" + erj + sanjt;
    viewModel.get("FLBM").setValue(yflbm);
  });