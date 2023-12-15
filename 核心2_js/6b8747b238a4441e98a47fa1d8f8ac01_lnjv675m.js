viewModel.on("customInit", function (data) {
  //测试空页面空白模板--页面初始化
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "https://www.example.com/");
  document.body.insertBefore(secScript, document.body.lastChild);
  console.log("viewModel", viewModel);
  console.log("window", window);
  let { React, ReactDOM } = window;
  const person = {
    name: "Gregorio Y. Zara",
    theme: {
      backgroundColor: "black",
      color: "pink"
    }
  };
  const myh1 = React.createElement("h1", { id: "myh1", title: "title", style: person.theme }, person.name);
  ReactDOM.render(myh1, document.getElementById("yxyweb-support-container"));
});