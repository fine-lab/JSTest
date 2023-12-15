viewModel.get("managementClass_name") &&
  viewModel.get("managementClass_name").on("afterValueChange", function (data) {
    // 物料分类--值改变后
    debugger;
    let managementClass_name = data.obj.value;
    cb.rest.invokeFunction(
      "6b6712f06de347729d33ac2e2f628fc8",
      {
        managementClass: managementClass_name
      },
      function (err, res) {
        console.log(res.data);
      }
    );
  });