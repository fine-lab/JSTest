viewModel.get("button5lf") &&
  viewModel.get("button5lf").on("click", function (data) {
    // 调用公共--单击
    cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/GT23196AT14/publictest?domainKey=developplatform"], function (a) {
      const validateEmail = (str) => /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
      var id = validateEmail("https://www.example.com/");
      a.fuc1(id);
    });
  });