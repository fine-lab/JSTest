viewModel.on("customInit", function (data) {
  let deluser = "btnDelete";
  //封装的业务函数
  function apipost(params, reqParams, options, action) {
    let returnPromise = new cb.promise();
    var url = action;
    var suf = "?";
    let keys = Object.keys(params);
    let plen = keys.length;
    for (let num = 0; num < plen; num++) {
      let key = keys[num];
      let value = params[key];
      if (num < plen - 1) {
        suf += key + "=" + value + "&";
      } else {
        suf += key + "=" + value;
      }
    }
    var requrl = url + suf;
    console.log("requrl === ");
    console.log(requrl);
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: requrl,
        method: "POST",
        options: options
      }
    });
    proxy.settle(reqParams, function (err, result) {
      if (result) {
        console.log(JSON.stringify(result));
        returnPromise.resolve(result);
      } else {
        console.log(JSON.stringify(err));
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  function removeuser(uid) {
    let returnPromise = new cb.promise();
    let action = "https://www.example.com/";
    let params = {
      isAjax: 1
    };
    let body = { tenantId: "yourIdHere", sysId: "yourIdHere", users: ["" + uid] };
    let options = { isAjax: 1, tenantId: "yourIdHere" };
    apipost(params, body, options, action).then((res, err) => {
      if (err) {
        console.log(JSON.stringify(err));
        returnPromise.reject(err);
      } else {
        console.log(JSON.stringify(res));
        returnPromise.resolve(res);
      }
    });
    return returnPromise;
  }
  viewModel.on("afterMount", () => {
    let syncbtn = viewModel.get(deluser);
    syncbtn.on("click", function (args) {
      var currentRow = viewModel.getGridModel().getRow(args.index);
      let obj = { id: currentRow.id, isInSystem: "0" };
      cb.rest.invokeFunction("GT34544AT7.common.updatesql", { table: "GT1559AT25.GT1559AT25.GxyCustomerUser", object: obj, billNum: "3e244735" }, function (err, res) {
        removeuser(currentRow.SysyhtUserId).then((res, err) => {
          console.log("停用用户获取到");
          console.log(res);
          console.log(err);
          viewModel.execute("refresh");
        });
      });
    });
  });
});