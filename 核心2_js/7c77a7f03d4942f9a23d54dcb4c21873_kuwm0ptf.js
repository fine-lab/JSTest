viewModel.on("customInit", function (data) {
  //测试详情--页面初始化
  const newDiv = document.createElement("div");
  newDiv.setAttribute("class", "container");
  newDiv.innerHTML = "<p>Hello World!</p>";
  const data = viewModel.getAllData();
  const value = viewModel.get("").getValue();
});