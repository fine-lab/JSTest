viewModel.get("button24yi") &&
  viewModel.get("button24yi").on("click", function (data) {
    // 按钮--单击
    let url = "https://www.example.com/";
    let requestParams = JSON.stringify({ a: "123" });
    post(url, requestParams);
  });
function post(url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onload = function () {
    console.log(this.response);
  };
  xhr.send(data);
}