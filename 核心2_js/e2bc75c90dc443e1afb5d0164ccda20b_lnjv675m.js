viewModel.get("button25yb") &&
  viewModel.get("button25yb").on("click", function (data) {
    // 按钮--单击
    var gridModel = viewModel.getGridModel("YearDistributionDetailedList");
    var gridModelData = gridModel.getRows();
    //成员编码是否相同---校验
    for (let i = 0; i < gridModelData.length - 1; i++) {
      let tishi = i + 1 + "、";
      let deleteArr = [];
      for (let j = i + 1; j < gridModelData.length; j++) {
        if (gridModelData[i].AccCode === gridModelData[j].AccCode) {
          tishi += j + 1 + "、";
          deleteArr.push(j);
        }
      }
      tishi = tishi.substring(0, tishi.length - 1);
      if (deleteArr.length > 0) {
        cb.utils.confirm(
          "第" + tishi + "行社员账户编码相同，无法保存",
          function () {},
          function () {}
        );
        return false;
      } else if (deleteArr.length === 0) {
      }
    }
    let Surplus_ReturnType = viewModel.get("Surplus_ReturnType").getValue(); //盈余返还方式
    let Surplus_RemainderType = viewModel.get("Surplus_RemainderType").getValue(); //剩余盈余返还方式
    if (Surplus_ReturnType !== "9") {
      let item2288gg = viewModel.get("item2288gg").getValue(); //自动计算
      if (item2288gg == "1") {
        let item2452ac = viewModel.get("item2452ac").getValue(); //子表小计1
        let Surplus_Return = viewModel.get("Surplus_Return").getValue(); //返还盈余总额
        //计算差了多少
        let Number1 = Surplus_Return - item2452ac;
        if (Number1 < 1) {
          let Number3 = gridModelData[0].Surplus_Return;
          //把差了的补起
          let a = Number3 + Number1;
          viewModel.getGridModel("YearDistributionDetailedList").setCellValue(0, "Surplus_Return", a + "");
        } else {
          cb.utils.alert("已返还盈余总额和待返还盈余总额尾差过大，请重新自动计算", "error");
          return false;
        }
      } else {
        cb.utils.alert("盈余返还方式非其他，请先自动计算！", "error");
        return false;
      }
    }
    if (Surplus_RemainderType !== "9") {
      let item2288gg = viewModel.get("item2288gg").getValue(); //自动计算
      if (item2288gg == "1") {
        let item2584tb = viewModel.get("item2584tb").getValue(); //子表小计2
        let Surplus_Remainder = viewModel.get("Surplus_Remainder").getValue(); //剩余盈余返还总额
        let Number2 = Surplus_Remainder - item2584tb;
        if (Number2 < 1) {
          let Number4 = gridModelData[0].Surplus_Remainder;
          let b = Number4 + Number2;
          viewModel.getGridModel("YearDistributionDetailedList").setCellValue(0, "Surplus_Remainder", b + "");
        } else {
          cb.utils.alert("分配后剩返还余盈余和预计剩余返还盈余相差过大，请重新自动计算", "error");
          return false;
        }
      } else {
        cb.utils.alert("剩余盈余返还方式非其他，请先自动计算！", "error");
        return false;
      }
    }
    viewModel.get("btnSave").execute("click");
  });
//删行后给自动计算赋值=0
viewModel.get("btnBatchDeleteRowYearDistributionDetailed").on("click", function () {
  viewModel.get("item2288gg").setValue("0"); //自动计算
});
viewModel.get("button26pa") &&
  viewModel.get("button26pa").on("click", function (data) {
    // 生成凭证--单击
    data = viewModel.getData();
    if (cb.utils.isEmpty(data.voucherID)) {
      cb.rest.invokeFunction("GT104180AT23.Voucher.YearDistribution", data, function (err, res) {
        if (res.Voucher.code == "200") {
          cb.utils.alert("凭证生成成功！", "success");
        } else {
          cb.utils.alert("凭证生成失败！", "error");
          cb.utils.alert(res.Voucher.message, "error");
        }
        console.log("err", JSON.stringify(err));
        console.log("res", JSON.stringify(res));
      });
    } else {
      cb.utils.alert("凭证生成成功！", "success");
    }
  });