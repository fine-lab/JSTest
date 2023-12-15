viewModel.on("customInit", function (data) {
  function log(msg) {
    let nmsg = msg;
    let bizFlowId = "yourIdHere";
    let bizFlowInstanceId = "yourIdHere";
    let queen = "";
    if (!!bizFlowId && !!bizFlowInstanceId) {
      queen += bizFlowId;
    } else {
      queen += "hellword";
    }
    let type = typeof msg;
    if (type == "string") {
      if (!!bizFlowInstanceId) {
        nmsg = "\n" + bizFlowInstanceId + ":\n" + nmsg;
      }
    } else {
      let outmsg = JSON.stringify(msg);
      if (!!bizFlowInstanceId) {
        nmsg = "\n" + bizFlowInstanceId + ":\n" + outmsg;
      } else {
        nmsg = outmsg;
      }
    }
    cb.rest.invokeFunction("GT9912AT31.common.logQueen", { msg: nmsg, queen }, function (err, res) {});
  }
  // 后台自动关联用户员工--页面初始化
  // 绑定用户方法
  function binduser(SysStaffNewCode, yhtuid) {
    let returnPromise = new cb.promise();
    var bindBody = {
      body: {
        staffCodeUserIdMap: {
          [SysStaffNewCode]: yhtuid
        }
      }
    };
    let yhtuid1 = yhtuid;
    cb.rest.invokeFunction("GT34544AT7.staff.bindUserByStaffCode", bindBody, function (err, res) {
      if (res) {
        returnPromise.resolve(res);
      } else {
        log("err:" + JSON.stringify(err));
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  // 修改已生成用户参数
  function changeSqlIsUser(mystaff) {
    let returnPromise = new cb.promise();
    let obj = {
      id: mystaff,
      LinkStaffFlag: "2"
    };
    // 修改生成用户状态
    cb.rest.invokeFunction(
      "GT34544AT7.common.updatesql",
      {
        table: "GT1559AT25.GT1559AT25.GxyUser",
        object: obj,
        billNum: "cfdec807"
      },
      function (err, res) {
        if (res) {
          returnPromise.resolve(res);
        } else {
          returnPromise.reject(err);
        }
      }
    );
    return returnPromise;
  }
  function refresh() {
    viewModel.execute("refresh");
  }
  var gridModel = viewModel.getGridModel();
  let mytime = setInterval(() => {
    refresh();
  }, 10000);
  gridModel.on("afterSetDataSource", (data) => {
    const rows = gridModel.getRows();
    if (rows.length > 0) {
      let index = 0;
      for (let rowindex in rows) {
        let row = rows[rowindex];
        setTimeout(function () {
          let SysStaffNewCode = row.SysStaffNewCode;
          let yhtuid = row.SysyhtUserId;
          let id = row.id;
          binduser(SysStaffNewCode, yhtuid).then((res, err) => {
            if (res) {
              changeSqlIsUser(id);
            }
          });
        }, index * 1000);
        index++;
      }
    }
  });
});