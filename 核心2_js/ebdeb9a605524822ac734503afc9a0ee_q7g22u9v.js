function ChangeOfQualificationFile(event) {
  var viewModel = this;
  var gridModels = viewModel.getGridModels();
  //原供应商经营范围(子表)
  var oldNOBModel = gridModels[0];
  //新供应商经营范围(子表)
  var newNOBModel = gridModels[1];
  //企业编码 路径->viewModel.__data.enterpriseCode_code
  let enterpriseCodeModel = viewModel.get("enterpriseCode_code");
  //类型名称 路径->viewModel.__data.qualificationCode_code
  let qualificationCodeModel = viewModel.get("qualificationCode_code");
  //通过企业编码和类型名称调用后端api查询供应商资质档案
  //设置企业编码默认值为null
  let enterpriseCode = null;
  //设置类型编码默认值为null
  let qualificationCode = null;
  //企业编码事件
  enterpriseCodeModel.on("beforeValueChange", function (event) {
    const enterpriseCodeModel = this;
    enterpriseCode === null;
    //对value进行判断,如果value有值,则将值赋给'enterpriseCode'
    if (typeof event.value == "undefined" || event.value === null) {
      return;
    } else {
      enterpriseCode = event.value.code;
    }
    // 调用后端API函数
    if (qualificationCode && enterpriseCode && qualificationCodeModel.get("value")) {
      let respResult = cb.rest.invokeFunction("0d412b7b08ea4727b393316c503eebdf", { enterpriseCode: enterpriseCode, typeCode: qualificationCode }, null, viewModel, { async: false });
      cb.utils.alert(respResult);
    }
  });
  //类型编码事件
  qualificationCodeModel.on("beforeValueChange", function (event) {
    const qualificationCodeModel = this;
    const qualificationValueCode = event.value.code;
    qualificationCode === null;
    //对value进行判断,如果value有值,则将值赋给'qualificationCode'
    if (typeof event.value == "undefined" || event.value === null) {
      return;
    } else {
      qualificationCode = event.value.code;
    }
    // 调用后端API函数
    if (qualificationCode && enterpriseCode && enterpriseCodeModel.get("value")) {
      let respResult = cb.rest.invokeFunction("0d412b7b08ea4727b393316c503eebdf", { enterpriseCode: enterpriseCode, typeCode: qualificationCode }, null, viewModel, { async: false });
      cb.utils.alert(respResult);
    }
  });
}