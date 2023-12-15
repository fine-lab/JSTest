var treeList = "";
viewModel.get("subjects_1741449173823651849") &&
  viewModel.get("subjects_1741449173823651849").on("afterSelect", function (data) {
    // 搜索树--选择后
    treeList = data[0];
  });
function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime) {
      return;
    }
  }
}
//分配科目--单击
viewModel.get("btnAdd") &&
  viewModel.get("btnAdd").on("click", function (data) {
    //保证前一个页面的数据保存完成
    sleep(1000);
    //判断是否是末级节点
    var subjectClassName = "";
    if (treeList == "" || (treeList.children != "" && treeList.children != undefined && treeList.children != null)) {
      cb.utils.alert("请点击分类末级节点", "error");
    } else {
      let idList = treeList.path.split("|");
      idList.forEach((item) => {
        if (item != "") {
          let subjecClassUrl = "AT17AF88F609C00004.common.getSCNameById";
          let subjecClassParam = {
            id: item
          };
          let subjecClassResult = cb.rest.invokeFunction(subjecClassUrl, subjecClassParam, function (err, res) {}, viewModel, { async: false });
          subjectClassName = subjectClassName + subjecClassResult.result.res[0].className;
        }
      });
      console.log(subjectClassName);
    }
    if (subjectClassName != "") {
      let subjectClassNameUrl = "AT17AF88F609C00004.common.getSubIdByName";
      let subjectClassNameParam = {
        subjectClassName: subjectClassName
      };
      let subjectClassNameResult = cb.rest.invokeFunction(subjectClassNameUrl, subjectClassNameParam, function (err, res) {}, viewModel, { async: false });
      let tableList = viewModel.getAllData();
      var result = {
        tableList: tableList,
        treeList: treeList
      };
      cb.loader.runCommandLine(
        "bill",
        {
          billtype: "voucher",
          billno: "yb17a323ca",
          params: {
            mode: "edit",
            id: subjectClassNameResult.result.res[0].id, //TODO:填写详情id
            perData: result
          }
        },
        viewModel
      );
    }
  });
viewModel.on("afterMount", function (args) {
  document.getElementsByClassName("close dnd-cancel")[0].style.display = "none";
  var height = document.getElementsByClassName("wui-modal-content react-draggable");
  height[0].setAttribute("style", "transform: translate(492px, 100px); min-height: 150px; min-width: 200px; width: 950px; height: 600px;");
});
viewModel.get("button4pi") &&
  viewModel.get("button4pi").on("click", function (data) {
    // 取消--单击
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    var select = parentViewModel.get("button14ee");
    viewModel.communication({ type: "modal", payload: { data: false } }); //关闭模态框
  });
viewModel.get("button8rf") &&
  viewModel.get("button8rf").on("click", function (data) {
    // 确定--单击
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    var select = parentViewModel.get("button14ee");
    viewModel.communication({ type: "modal", payload: { data: false } }); //关闭模态框
  });
viewModel.get("button9nj") &&
  viewModel.get("button9nj").on("click", function (data) {
    //重置科目--单击
    cb.rest.invokeFunction("AT17AF88F609C00004.commonII.initialization", {}, function (err, res) {
      viewModel.execute("refresh"); //刷新页面
    });
  });
viewModel.get("button13pg") &&
  viewModel.get("button13pg").on("click", function (data) {
    //同步科目分类--单击
    cb.rest.invokeFunction("AT17AF88F609C00004.commonII.initSubjectTree", {}, function (err, res) {
      viewModel.execute("refresh"); //刷新页面
    });
  });