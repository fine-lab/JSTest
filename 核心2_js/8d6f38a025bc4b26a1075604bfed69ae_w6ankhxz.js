viewModel.get("payDate") &&
  viewModel.get("payDate").on("beforeValueChange", function (data) {
    // 到期付款日--值改变前
    if (data.value == null) return true;
    var today = new Date();
    var endDate = new Date(data.value);
    if (endDate <= today) {
      cb.utils.alert("到期付款日必须大于当前日期");
      return false;
    }
  });
viewModel.get("amount") &&
  viewModel.get("amount").on("beforeValueChange", function (data) {
    // 凭证金额--值改变前
    var leftLimit = viewModel.get("item153kh").getValue();
    if (leftLimit === null && data.value == null) return true;
    if (leftLimit < data.value) {
      cb.utils.alert("凭证金额不能大于可用额度");
      return false;
    }
  });
viewModel.get("button19rk") &&
  viewModel.get("button19rk").on("click", function (data) {
    // 测试打开新窗口--单击
    window.open("https://www.baidu.com");
  });
// 文件上传
window.fileUpload = function () {
  const serviceUrl1 = "https://www.example.com/";
  const serviceUrl2 = "https://www.example.com/";
  const url = serviceUrl2 + "/rc/pub/fileupload/upload";
  const formData = new FormData();
  formData.append("file", $("#file")[0].files[0]);
  $.ajax({
    type: "post",
    url: url,
    data: formData,
    cache: false,
    processData: false,
    contentType: "application/json"
  })
    .done(function (data) {
      alert(JSON.stringify(data));
    })
    .fail(function () {
      cb.utils.alert("上传失败", "error");
      var gridModel = viewModel.getGridModel();
      const oldList = viewModel.getGridModel().getRows();
      gridModel.setDataSource([...oldList, { name: $("#file")[0].files[0].name }]);
    });
};
window.onUploadBtnClick = function () {
  $("#file").click();
};
//动态加载js文件函数
function addScript(jsfile, callback) {
  //动态加载js文件
  var secScript = document.createElement("script");
  secScript.setAttribute("src", jsfile);
  document.body.insertBefore(secScript, document.body.lastChild);
  //判断动态js文件加载完成
  secScript.onload = secScript.onreadystatechange = function () {
    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
      secScript.onload = secScript.onreadystatechange = null;
      if (callback && typeof callback == "function") {
        callback(jQuery);
      }
    }
  };
}
addScript("https://www.example.com/", function (jQuery) {
  let mode = viewModel.getParams().mode;
  var uploadhtml = `<button type="button" class="wui-button" onclick="window.onUploadBtnClick()" style="margin-left: 50px;margin-top: 10px;height: 36px;">上传文件</button>    
<input type="file" id="file" name="uploadFile" multiple" onchange="window.fileUpload()" style="display: none" />`;
  // 容器id拼接
  let uploadDom = document.getElementById("rc_voucher|item171la");
  uploadDom.innerHTML = uploadhtml;
});
viewModel.get("button18mg") &&
  viewModel.get("button18mg").on("click", function (data) {
    // 删除--单击 删除附件
    console.log(data);
    cb.utils.confirm(
      "确定要删除吗？",
      function () {
        //默认异步
        //获取选中行
        const gridModel = viewModel.getGridModel();
        const oldList = gridModel.getRows();
        oldList.splice(data.index, 1);
        gridModel.setDataSource([...oldList]);
      },
      function (args) {
      }
    );
  });
viewModel.get("button22df") &&
  viewModel.get("button22df").on("click", function (data) {
    // 查看--单击
    //触发弹窗
    viewModel.communication({
      //模态框类型-固定写死
      type: "modal",
      payload: {
        //扩展的组件名
        key: "yourkeyHere",
        data: {
          //把模型传递给组件内部，用于组件和MDF模型关联使用（比如组件内发布事件，把组件内的值传到MDF模型中）
          viewModel: viewModel,
          //传递给组件内部的数据（组件内部通过 this.props.myParam获取）
          myParam: {
            fileAddress: "https://www.example.com/"
          }
        }
      }
    });
  });
viewModel.get("button28ld") &&
  viewModel.get("button28ld").on("click", function (data) {
    // 下载--单击
  });