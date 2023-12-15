viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    // 生成--单击
    var tuihuiyuanyinValue = viewModel.get("yuanyin").getValue(); //原因
    if (tuihuiyuanyinValue == null) {
      cb.utils.alert("退回原因不可为空！", "error");
      return false;
    }
    var rows = viewModel.getParams().rows;
    var parentViewModel = viewModel.getCache("parentViewModel");
    for (var i = 0; i < rows.length; i++) {
      var selectData = rows[i];
      var yangbenbianhao = selectData.yangbenbianhao;
      var dataRes = cb.rest.invokeFunction("AT15F164F008080007.sampleRece.queryRecDetil", { idnum: selectData.id }, function (err, res) {}, viewModel, { async: false });
      if (dataRes.error) {
        cb.utils.confirm("样本【" + yangbenbianhao + "】查询数据异常：" + dataRes.error.message);
        //属性父model页面
        parentViewModel.execute("refresh");
        //关闭模态框
        viewModel.communication({ type: "modal", payload: { data: false } });
        return false;
      }
      var bodyData = dataRes.result.bodyRes[0];
      if ("20" != bodyData.zhuangtai) {
        //非待收样状态
        cb.utils.confirm("样本【" + yangbenbianhao + "】状态为非待收样!");
        //属性父model页面
        parentViewModel.execute("refresh");
        //关闭模态框
        viewModel.communication({ type: "modal", payload: { data: false } });
        return false;
      } else {
        var updateRes = cb.rest.invokeFunction(
          "AT15F164F008080007.sampleRece.updateRecDetil",
          { bodyId: bodyData.id, typeValue: "10", tuihuiyuanyinValue: tuihuiyuanyinValue },
          function (err, res) {},
          viewModel,
          { async: false }
        );
        if (updateRes.error) {
          cb.utils.confirm("【" + yangbenbianhao + "】退回失败:" + updateRes.error.message);
          //属性父model页面
          parentViewModel.execute("refresh");
          //关闭模态框
          viewModel.communication({ type: "modal", payload: { data: false } });
          return false;
        }
      }
    }
    cb.utils.alert("批量退回成功!");
    //属性父model页面
    parentViewModel.execute("refresh");
    //关闭模态框
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("btnAbandon") &&
  viewModel.get("btnAbandon").on("click", function (data) {
    // 取消--单击
    //关闭模态框
    viewModel.communication({ type: "modal", payload: { data: false } });
  });