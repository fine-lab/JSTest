var gridmodel = viewModel.get("xqsq_1607339979660328966");
var default_num = 0;
viewModel.get("xqsq_1607339979660328966") &&
  viewModel.get("xqsq_1607339979660328966").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    if (default_num == 0) {
      cb.rest.invokeFunction(
        "GT879AT352.apiEnd.searchReqPage",
        { userid: cb.rest.AppContext.user.userId },
        function (err, res) {
          console.log("进来了------------------------------------111");
          console.log(res);
          console.log(err);
          console.log("进来了------------------------------------");
          var backlist = res.res;
          var datas = [];
          for (let i = 0; i < backlist.length; i++) {
            var detailmsg = {
              requestid: backlist[i].id + "",
              code: backlist[i].code,
              productName: backlist[i].subject,
              puorgname: backlist[i].reqOrgName,
              receivePersonName: backlist[i].reqContactsName
            };
            gridmodel.insertRow(i, detailmsg);
          }
          console.log("出去了------------------------------------");
        },
        viewModel,
        { async: true }
      );
      default_num++;
    }
  });
viewModel.get("button20be") &&
  viewModel.get("button20be").on("click", function (data) {
    // 检索--单击
    gridmodel.clear();
    var codeValue = viewModel.get("item35pj").getValue();
    var req = {
      userid: cb.rest.AppContext.user.userId,
      reqCode: codeValue
    };
    console.log(req);
    cb.rest.invokeFunction(
      "GT879AT352.apiEnd.searchReqPage",
      req,
      function (err, res) {
        console.log("进来了------------------------------------");
        var backlist = res.res;
        console.log(res.res);
        var datas = [];
        for (let i = 0; i < backlist.length; i++) {
          var detailmsg = {
            requestid: backlist[i].id + "",
            code: backlist[i].code,
            productName: backlist[i].subject,
            puorgname: backlist[i].reqOrgName,
            receivePersonName: backlist[i].reqContactsName
          };
          gridmodel.insertRow(i, detailmsg);
        }
        console.log("出去了------------------------------------");
      },
      viewModel,
      { async: true }
    );
  });
viewModel.get("button2sk") &&
  viewModel.get("button2sk").on("click", function (data) {
    // 确定--单击
    //获取父model
    var rows = gridmodel.getSelectedRows();
    if (rows.length == 0 || rows.length > 1) {
      cb.utils.alert("仅可以选择一条数据");
    } else {
      var parentViewModel = viewModel.getCache("parentViewModel");
      //获取到父model
      parentViewModel.get("defines!define20").setValue(rows[0].code);
      viewModel.communication({ type: "modal", payload: { data: false } });
    }
  });