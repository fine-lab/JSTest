viewModel.get("button98ke") &&
  viewModel.get("button98ke").on("click", function (data) {
    //按钮--单击
    let orgs = [];
    let pageIndex = 1;
    let pageSize = 5000;
    let params = "*";
    let condition = "creationtime between '2023-06-24 17:36:48' and '2023-06-24 19:36:48' and orgtype=2 and dr=0 ORDER BY creationtime ASC";
    let result = cb.rest.invokeFunction("GT34544AT7.org.orgCenterApi", { pageIndex, pageSize, params, condition }, function (err, res) {}, viewModel, { async: false });
    console.log(result.result.res);
    let obj = result.result.res;
    let max = obj.length;
    let timeout = 3000;
    let uridelete = "/yonbip/digitalModel/admindept/delete";
    let uristop = "/yonbip/digitalModel/admindept/stop";
    for (let i in obj) {
      let o = obj[i];
      let uri = uridelete;
      if (o.enable == 0 || o.enable == 2) {
        setTimeout(() => {
          let body = {
            data: {
              id: o.id
            }
          };
          let deleteacc = cb.rest.invokeFunction("GT34544AT7.common.baseOpenApi", { uri, body }, function (err, res) {}, viewModel, { async: false });
          console.log("删除  " + i + "/" + max);
          console.log(deleteacc);
        }, i * timeout);
      } else {
        let uri = uristop;
        setTimeout(() => {
          let body = {
            data: {
              id: o.id
            }
          };
          console.log("停用删除  " + i + "/" + max);
          let stopacc = cb.rest.invokeFunction("GT34544AT7.common.baseOpenApi", { uri, body }, function (err, res) {}, viewModel, { async: false });
          console.log(stopacc);
          uri = uridelete;
          let deleteacc = cb.rest.invokeFunction("GT34544AT7.common.baseOpenApi", { uri, body }, function (err, res) {}, viewModel, { async: false });
          console.log(deleteacc);
        }, i * timeout);
      }
    }
  });