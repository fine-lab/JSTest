viewModel.get("button25nk") &&
  viewModel.get("button25nk").on("click", function (data) {
    // 按钮--单击
    let responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(processStartMessage));
    throw Error(responseObj);
  });