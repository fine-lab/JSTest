viewModel.get("button24ak") &&
  viewModel.get("button24ak").on("click", function (data) {
    // 生成凭证--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let tongjiyuefen = filtervm.get("tongjiyuefen").getFromModel().getValue();
    if (isEmpty(tongjiyuefen)) {
      cb.utils.alert("请选择统计月份", "error");
      return false;
    } else {
      var rst = cb.rest.invokeFunction("GT62472AT6.backDefaultGroup.sendPZ", { dateparam: tongjiyuefen }, function (err, res) {}, viewModel, { async: false });
      let bgList = rst.result.result;
      let messages = [];
      if (bgList.length > 0) {
        for (var i = 0; i < bgList.length; i++) {
          var bg = bgList[i];
          messages.push(bg.message);
        }
      }
      cb.utils.alert(messages);
      viewModel.execute("refresh");
    }
    function isEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    }
  });