viewModel.get("button52df") &&
  viewModel.get("button52df").on("click", function (data) {
    // 关闭--单击
    var queryId = viewModel.get("id").getValue();
    var codeValue = viewModel.get("code").getValue();
    var queryRes = cb.rest.invokeFunction("GT83441AT1.backDefaultGroup.queryXSYDD", { id: queryId }, function (err, res) {}, viewModel, { async: false });
    if (queryRes.error) {
      cb.utils.alert("单据编号为【" + codeValue + "】查询数据异常！" + queryRes.error.message);
      viewModel.execute("refresh");
      return false;
    } else if (JSON.stringify(queryRes.result.returnData) == "{}") {
      cb.utils.alert("单据编号为【" + codeValue + "】未查询出数据，请刷新后重试！");
      viewModel.execute("refresh");
      return false;
    } else {
      var billdata = queryRes.result.returnData;
      if (billdata.isclose == "true" || billdata.verifystate != 2 || billdata.pushdown != "true") {
        cb.utils.alert("单据编号为【" + codeValue + "】不符合关闭要求，需【已】下推、【未】关闭且【已审核】！");
        viewModel.execute("refresh");
        return false;
      } else {
        let data = {
          billtype: "Voucher", // 单据类型
          billno: "bddb766c", // 单据号
          params: {
            mode: "edit",
            billId: billdata.id
          }
        };
        //打开一个单据，并在当前页面显示
        cb.loader.runCommandLine("bill", data, viewModel);
      }
    }
  });
viewModel.get("button64ke") &&
  viewModel.get("button64ke").on("click", function (data) {
    // 打开--单击
    var queryId = viewModel.get("id").getValue();
    var codeValue = viewModel.get("code").getValue();
    var queryRes = cb.rest.invokeFunction("GT83441AT1.backDefaultGroup.queryXSYDD", { id: queryId }, function (err, res) {}, viewModel, { async: false });
    if (queryRes.error) {
      cb.utils.alert("单据编号为【" + codeValue + "】查询数据异常！" + queryRes.error.message);
      viewModel.execute("refresh");
      return false;
    } else if (JSON.stringify(queryRes.result.returnData) == "{}") {
      cb.utils.alert("单据编号为【" + codeValue + "】未查询出数据，请刷新后重试！");
      viewModel.execute("refresh");
      return false;
    } else {
      var billdata = queryRes.result.returnData;
      if (billdata.isclose != "true") {
        cb.utils.alert("单据编号为【" + codeValue + "】不符合打开要求，需【已】关闭数据！");
        viewModel.execute("refresh");
        return false;
      } else {
        var updateRes = cb.rest.invokeFunction("GT83441AT1.backDefaultGroup.openUpdateAPI", { billId: billdata.id }, function (err, res) {}, viewModel, { async: false });
        if (updateRes.error) {
          cb.utils.alert("打开失败！" + updateRes.error.meaager);
          return false;
        } else {
          cb.utils.alert("打开成功！");
          viewModel.execute("refresh");
        }
      }
    }
  });