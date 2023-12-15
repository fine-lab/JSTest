viewModel.get("button24jc") &&
  viewModel.get("button24jc").on("click", function (data) {
    // 查看详情--单击
    var customerinfo = viewModel.get("customerinfo").getValue();
    var customerinfo_name = viewModel.get("customerinfo_name").getValue();
    if (customerinfo != null && customerinfo != "") {
      cb.rest.invokeFunction("AT15E7206608080004.backDesignerFunction.getPersonnalInfo", { data_request: customerinfo }, function (err, res) {
        var data_response = res.data_response;
        console.log(data_response);
        console.log(data_response.phone);
        viewModel.get("item64og").setValue(data_response.phone);
        viewModel.get("item97re").setValue(data_response.gender);
      });
    }
  });
viewModel.get("button34ch") &&
  viewModel.get("button34ch").on("click", function (data) {
    // 查看详情2--单击--ObjectStore
    var customerinfo = viewModel.get("customerinfo").getValue();
    var customerinfo_name = viewModel.get("customerinfo_name").getValue();
    if (customerinfo != null && customerinfo != "") {
      cb.rest.invokeFunction("AT15E7206608080004.backDesignerFunction.getOSapiscript", { data_request: customerinfo }, function (err, res) {
        console.log(customerinfo, "---", customerinfo_name, "---", err, "---", res);
        console.log(res.res);
        console.log(res.res.res);
        console.log(res.res.res.phone);
        viewModel.get("item64og").setValue(res.res.res.phone);
        viewModel.get("item97re").setValue(res.res.res.gender);
      });
    }
  });
viewModel.get("button51ee") &&
  viewModel.get("button51ee").on("click", function (data) {
    // 查看详情3--单击--YQL
    var customerinfo = viewModel.get("customerinfo").getValue();
    var customerinfo_name = viewModel.get("customerinfo_name").getValue();
    if (customerinfo != null && customerinfo != "") {
      cb.rest.invokeFunction("AT15E7206608080004.backDesignerFunction.getapiscript", { data_request: customerinfo }, function (err, res) {
        console.log(err, "-", res);
        console.log(res.res);
        console.log(res.res.res);
        console.log(res.res.res.phone);
        var data_response = res.res.res[0];
        console.log(data_response);
        console.log(data_response.phone);
        viewModel.get("item64og").setValue(data_response.phone);
        viewModel.get("item97re").setValue(data_response.gender);
      });
    }
  });