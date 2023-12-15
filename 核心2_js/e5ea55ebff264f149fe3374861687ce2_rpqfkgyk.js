var gridModel = viewModel.getGridModel();
//获取表格列模型
var a = gridModel.getEditRowModel().get("order_code_code");
var secScript = document.createElement("script");
secScript.setAttribute("type", "text/javascript");
secScript.setAttribute("src", "https://www.example.com/");
document.body.insertBefore(secScript, document.body.lastChild);
viewModel.get("stereogram_1520422262642049033") &&
  viewModel.get("stereogram_1520422262642049033").on("afterSetDataSource", function (data) {
    console.log("123456");
    console.log("3333333");
    console.log("data-start");
    console.log(JSON.stringify(data));
    console.log("data-end");
  });
gridModel.on("cellJointQuery", function (params) {
  console.log("cellJointQuery-start");
  console.log(JSON.stringify(params));
  let body = {};
  $.ajax({
    url: "https://www.example.com/",
    type: "POST",
    data: {
      Code: "1525940634173571079"
    },
    success: function (result) {
      console.log("result - start");
      console.log(JSON.stringify(result));
      $("#weather-temp").html("<strong>" + result + "</strong> degrees");
    }
  });
  console.log("cellJointQuery-end");
});
viewModel.on("customInit", function (data) {
  // 立体图--页面初始化
});