viewModel.on("customInit", function (data) {
  // 省市区_pfy--页面初始化
  viewModel.on("afterMount", function (event) {
    //先获取查询区条件模型
    let filterViewModel = viewModel.getCache("FilterViewModel");
    //查询区模型DOM初始化后
    filterViewModel.on("afterInit", function () {
      //调用函数API
      cb.rest.invokeFunction("AT15B24E9C16C80002.backOpenApiFunction.getDistinctProc", { bintl: "N" }, function (err, res) {
        var provItems = [];
        if (res.res && res.res.length > 0) {
          let i = 1;
          for (let item of res.res) {
            provItems.push({ key: i, value: item.vprov });
            i++;
          }
        }
        //给省份控件赋值
        filterViewModel.get("vprov").getFromModel().setDataSource(provItems);
      });
      //获取省份模型
      let referModel = filterViewModel.get("vprov").getFromModel();
      //模型控件的值变化事件
      referModel.on("afterValueChange", function (data) {
        let prov = filterViewModel.get("vprov").getFromModel().getValue();
        cb.rest.invokeFunction("AT15B24E9C16C80002.backOpenApiFunction.getCityByProv", { prov: prov }, function (err, res) {
          var cityItems = [];
          if (res.res && res.res.length > 0) {
            let i = 1;
            for (let item of res.res) {
              cityItems.push({ key: i, value: item.vcity });
              i++;
            }
          }
          //设置市控件的值
          filterViewModel.get("vcity").getFromModel().setDataSource(cityItems);
        });
      });
      //获取市模型
      let cityModel = filterViewModel.get("vcity").getFromModel();
      //模型控件的值变化事件
      cityModel.on("afterValueChange", function (data) {
        //获取省份值
        let prov = filterViewModel.get("vprov").getFromModel().getValue();
        //获取城市值
        let vcity = filterViewModel.get("vcity").getFromModel().getValue();
        //调用函数并返回结果
        cb.rest.invokeFunction("AT15B24E9C16C80002.backOpenApiFunction.getCountyByprovAndCity", { prov: prov, city: vcity }, function (err, res) {
          var countyItems = [];
          if (res.res && res.res.length > 0) {
            let i = 1;
            for (let item of res.res) {
              countyItems.push({ key: i, value: item.vcounty });
              i++;
            }
          }
          //设置区控件的值
          filterViewModel.get("vcounty").getFromModel().setDataSource(countyItems);
        });
      });
      // 获取省市区
      viewModel.get("vprovcitycounty").on("afterValueChange", function (data) {
        //设置省控件的值
        viewModel.get("vprov").setValue(data.value["vprov"]);
        //设置市控件的值
        viewModel.get("vcity").setValue(data.value["vcity"]);
        //设置区控件的值
        viewModel.get("vcounty").setValue(data.value["vcounty"]);
        var provcitycounty = data.value["vprov"] + data.value["vcity"] + data.value["vcounty"];
        viewModel.get("vprovcitycounty").setValue(provcitycounty);
      });
    });
  });
});