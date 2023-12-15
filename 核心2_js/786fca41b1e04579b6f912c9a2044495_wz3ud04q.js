// 供应商银行账户维护详情--页面初始化
viewModel.on("customInit", function (data) {
  let mode = viewModel.getParams().mode; //mode表示状态,写死的新增 编辑 详情
  if (mode.toLocaleLowerCase() == "add") {
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    };
    viewModel.get("org_id_name").on("afterValueChange", () => {
      viewModel.get("inputdate").setValue(formatDate(new Date()));
    });
  }
});
//改变状态，触发事件，mode可以自动识别，不需要通过viewModel.getParams().mode;
viewModel.on("modeChange", (mode) => {
  if (mode.toLocaleLowerCase() == "browse") {
    viewModel.get("dropdownbutton27ti").setDisabled(false);
  } else {
    viewModel.get("dropdownbutton27ti").setDisabled(true);
  }
});
//保存前校验
viewModel.on("beforeSave", function (args) {
  var inputdate = viewModel.get("inputdate").getValue();
  var opendate = viewModel.get("opendate").getValue();
  //判断A 是否大于 B
  const isAfterDate = (inputdate, opendate) => inputdate > opendate;
  if (!isAfterDate(inputdate, opendate)) {
    cb.utils.alert("登记日期必须>账户开立日期");
    return false;
  }
});
// 供应商档案--值改变后
viewModel.get("supplier_name") &&
  viewModel.get("supplier_name").on("afterValueChange", function (data) {
    viewModel.get("taxno").setValue("");
    //选择数据后，根据选择到的数据
    var supplier = viewModel.get("supplier").getValue(); //前端将数据塞到viewModel里的过程
    var supplier_name = viewModel.get("supplier_name").getValue();
    if (supplier != null && supplier != "") {
      //第一个参数是API函数，第2个参数是在后台request那里拿到的参数(当前的supplier是供应商档案的id)"supplier"是API函数的request.supplier，
      //第2个参数是传给后台的
      cb.rest.invokeFunction("7188d3cd2a7e4074930f594e6bdea477", { supplier: supplier }, function (err, res) {
        var id = res.id;
        if (id === "") {
          cb.utils.alert("供应商银行账户非启用状态，请检查");
          viewModel.get("supplier_name").setValue("");
          viewModel.get("supplier").setValue("");
        }
      });
    }
  });
viewModel.get("button19te") &&
  viewModel.get("button19te").on("click", function (e) {
    // 冻结--单击
    //获取页面全部数据
    const data = viewModel.getAllData();
    //获取组件的值：账户状态
    const custaccstatus = viewModel.get("custaccstatus").getValue();
    //校验
    if (custaccstatus != "1") {
      cb.utils.alert("只有状态为正常的单据才可以冻结");
    } else {
      //每调用一次，后端函数就会生成一个id，id为invokeFunction()里面第一个参数
      //第一个参数是API函数的ID
      //第二个是把数据传到后台"data":data，第一个data是后端可以调用的key，第二个data是这边要传给后端的值
      //第三个是回调函数，表示第一个参数(API函数)调用后的结果，有2种，处理数据200 OK进res，处理数据出错进err
      cb.rest.invokeFunction("AT15DCD4700808000A.custbank.freezebill", { data_request: data }, function (err, res) {
        var data = res.data_response; //把数据从结果集取出
        if (data != null) {
          viewModel.setData(data); //如果结果集为空，将整个数据做一下更新
        }
      });
    }
  });