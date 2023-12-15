viewModel.get("button22xi") &&
  viewModel.get("button22xi").on("click", function (data) {
    //按钮--单击
    debugger;
    var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.testinv", {}, function (err, res) {}, viewModel, { async: false });
    var pusht = new Array();
    for (var i = 0; i < res.result.resList.length; i++) {
      // 设置缓存
      localStorage.setItem("test" + i, JSON.stringify(res.result.resList[i]));
    }
    // 取出缓存
    var itemdata = localStorage.getItem("test1");
    var vv = localStorage.valueOf();
    localStorage.clear();
    alert(itemdata);
  });