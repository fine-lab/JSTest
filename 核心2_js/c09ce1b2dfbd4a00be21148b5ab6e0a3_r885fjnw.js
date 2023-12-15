viewModel.get("email") &&
  viewModel.get("email").on("afterValueChange", function (data) {
    //邮箱--值改变后
    //获取邮箱
    const email = viewModel.get("email").getValue();
    const resemail = email.replace(/\s*/g, "");
    viewModel.get("email").setValue(resemail);
    const emailb = validateEmail(resemail);
    if (emailb) {
      cb.rest.invokeFunction("AT1832AE3609F80004.APIhanshu.apiEmail", { resemail: resemail }, function (err, res) {
        if (!res.bo) viewModel.get("email").setValue("");
      });
    }
  });