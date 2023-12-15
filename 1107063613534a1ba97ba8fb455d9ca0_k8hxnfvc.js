viewModel.on("customInit", function (data) {
  //录用办理--页面初始化
});
var promise = new cb.promise();
viewModel.on("beforeSave", function (data) {
  let param = [
    {
      _md: "staff",
      birthdate: viewModel.get("birthdate").getValue(),
      education: viewModel.get("highestqualification").getValue(), //"HI300000000000007104",
      shortname: "yb",
      joinworkdate: viewModel.get("joinworkdate").getValue(), //1685289600000,
      org_id: viewModel.get("orgid").getValue(), //"2650675555979523",
      name: viewModel.get("name").getValue(),
      cert_type: viewModel.get("certtype").getValue(), //"0001-5130-48de-ae28-4233a47e3797",
      selfemail: viewModel.get("selfemail").getValue(), //"https://www.example.com/",
      cert_no: viewModel.get("certno").getValue(),
      sex: viewModel.get("sex").getValue(), //1,
      mobile: viewModel.get("mobile").getValue(), //"13466502360",
      deptId: viewModel.get("deptid").getValue(), //"2650675555979523",
      dr: 0,
      entityFullName: "com.yonyou.hrcloud.staff.model.Staff",
      entityMetaDefinedName: "staff",
      entityNameSpace: "hrcloud",
      es: 0,
      integrity: 0,
      psnclId: viewModel.get("psnclid").getValue(), //"0e1678de3fdc450a904758221382a94c",
      unitId: viewModel.get("orgid").getValue() //"ab756309feca4c708af760ca14b34a91"
    }
  ];
  debugger;
  let res = cb.rest.invokeFunction("HREM.backDesignerFunction.checkBlackList", { param }, function (err, res) {}, viewModel, { async: false });
  console.log("测试返回结果", res);
  let msg = JSON.parse(JSON.parse(res.result.strResponse).data).msg;
  cb.utils.confirm(
    msg,
    function () {
      //点击确认  放行
      promise.resolve();
    },
    function () {
      return false;
    }
  );
  return promise;
});