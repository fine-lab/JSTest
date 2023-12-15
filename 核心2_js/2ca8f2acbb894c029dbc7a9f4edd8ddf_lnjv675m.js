viewModel.get("button19og") &&
  viewModel.get("button19og").on("click", function (data) {
    // 弃审--单击
  });
viewModel.get("button24ed") &&
  viewModel.get("button24ed").on("click", function (data) {
    // 按钮--单击
    let mobile = "+86-18398494783";
    let sql = "select * from GT1559AT25.GT1559AT25.GxyUser where UserMobile='" + mobile + "'";
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      console.log(res);
    });
  });