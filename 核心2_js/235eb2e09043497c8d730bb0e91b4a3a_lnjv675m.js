viewModel.get("button21gh") &&
  viewModel.get("button21gh").on("click", function (data) {
    // 查询有效时间--单击
    var rows = viewModel.getGridModel().getSelectedRows();
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var { Org_UserRole_AuthOrg } = row;
      if (!!Org_UserRole_AuthOrg) {
        var sql =
          "select id Org_UserRole_AuthOrg,tos.enddate from GT3AT33.GT3AT33.test_Org_UserRole_AuthOrg " +
          "left join GT3AT33.GT3AT33.test_Org_UserRole as tour on tour.id=test_Org_UserRole_id " +
          "left join GT3AT33.GT3AT33.test_OrderServiceUseOrg as tosur on tosur.id=tour.test_OrderServiceUseOrg " +
          "left join GT3AT33.GT3AT33.test_OrderService as tos on tos.id=tosur.test_OrderService_id " +
          "where id='" +
          Org_UserRole_AuthOrg +
          "' and tour.test_OrderServiceUseOrg is not null ";
        cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
          console.log(res.recordList[0]);
        });
      }
    }
  });