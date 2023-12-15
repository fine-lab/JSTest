viewModel.get("button19ff") &&
  viewModel.get("button19ff").on("click", function (data) {
    var rows = viewModel.getGridModel().getSelectedRows();
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var { role_code, yhtUser } = row;
      unbinduserrole(role_code, yhtUser);
      console.log(row);
    }
    // 按钮--单击
    function unbinduserrole(roleCode, userId) {
      let returnPromise = new cb.promise();
      let req = { roleCode, userId };
      cb.rest.invokeFunction("GT34544AT7.roles.unBindRole", req, function (err, res) {
        if (res) {
          console.log(res);
          let success = res.res.data;
          console.log(success);
        } else {
          returnPromise.reject(err);
        }
      });
      return returnPromise;
    }
  });