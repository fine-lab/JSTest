viewModel.get("button64ab") &&
  viewModel.get("button64ab").on("click", function (data) {
    // 调用公共--单击
    cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/SCMSA/publictest?domainKey=developplatform"], function (a) {
      const validateEmail = (str) => /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
      var id = validateEmail("https://www.example.com/"); //验证邮箱格式返回布尔值
      a.fuc1(id); //调用公共函数传入id值
    });
  });
viewModel.get("button134yd") &&
  viewModel.get("button134yd").on("click", function (data) {
    // 调用租户级api--单击
    cb.rest.invokeFunction("SCMSA.zjml02.pubilcAPI", {}, function (err, res) {
      cb.utils.alert(res.s);
    });
  });