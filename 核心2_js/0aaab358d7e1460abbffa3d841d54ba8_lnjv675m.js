//删行后给自动计算赋值=0
viewModel.get("btnBatchDeleteRowSurplusAccrualDetailed").on("click", function () {
  viewModel.get("item817gh").setValue("0"); //自动计算
});
viewModel.get("button17ve") &&
  viewModel.get("button17ve").on("click", function (data) {
    var gridModel = viewModel.getGridModel("SurplusAccrualDetailedList");
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
    let Surplus_AccrualType = viewModel.get("Surplus_AccrualType").getValue(); //本年计提盈余公积分配方式
    if (Surplus_AccrualType !== "9") {
      let item817gh = viewModel.get("item817gh").getValue(); //自动计算
      if (item817gh == "1") {
        let item1681nh = viewModel.get("item1681nh").getValue(); //子表小计1
        let Surplus_NowYear = viewModel.get("Surplus_Accrual").getValue(); //本年盈余
        //计算差了多少
        let Number1 = Surplus_NowYear - item1681nh;
        if (Number1 < 1) {
          let Number3 = parseFloat(gridModelData[0].Surplus_NowYear);
          //把差了的补起
          let a = Number3 + Number1;
          viewModel.getGridModel("SurplusAccrualDetailedList").setCellValue(0, "Surplus_NowYear", a + "");
        } else {
          cb.utils.alert("本年盈余尾差过大，请重新自动计算", "error");
          return false;
        }
      } else {
        cb.utils.alert("本年计提盈余公积分配方式非其他，请先自动计算！", "error");
        return false;
      }
    }
    viewModel.get("btnSave").execute("click");
  });
viewModel.get("button18xe") &&
  viewModel.get("button18xe").on("click", function (data) {
    // 生成凭证--单击
    data = viewModel.getData();
    if (cb.utils.isEmpty(data.voucherID)) {
      cb.rest.invokeFunction("GT104180AT23.Voucher.SurplusAccrual", data, function (err, res) {
        if (res.Voucher.code == "200") {
          cb.utils.alert("凭证生成成功！", "success");
        } else {
          cb.utils.alert("凭证生成失败！", "error");
          cb.utils.alert(res.Voucher.message, "error");
        }
      });
    } else {
      cb.utils.alert("凭证生成成功！", "success");
    }
  });