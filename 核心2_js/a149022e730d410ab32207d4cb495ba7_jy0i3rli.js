function filterPre(event) {
  let gridModel = viewModel.getGridModel();
  var commonVOs, reqCondition, permissions, alldata;
  viewModel.on("beforeSearch", function (args) {
    //需要获取当前人的身份信息，确定默认的查询条件
    var promise = new cb.promise();
    setTimeout(function () {
      debugger;
      cb.rest.invokeFunction("de7b223a0b16489489592a58f2e18bf9", {}, function (err, res) {
        console.log("err====>" + err);
        console.log("res=====>" + res);
        if (err !== null) {
          cb.utils.alert("查询数据异常");
          permissions = [];
          return false;
        } else {
          permissions = res.res;
          alldata = res.allData;
          //如果是员工不允许新增单据
          if (undefined === permissions || permissions.length === 0) {
            //将新增按钮隐藏btnAdd为按钮编码
            viewModel.get("btnAdd").setVisible(false);
          }
          args.isExtend = true;
          //请求数据的条件，获取统计信息的时候需要用到
          reqCondition = args.params.condition;
          commonVOs = args.params.condition.commonVOs;
          if (undefined === permissions) {
            //设置一个不可能查询出数据的条件
            cb.utils.alert("查询数据异常--获取人员失败");
            commonVOs.push({
              itemName: "id",
              op: "eq",
              value1: ""
            });
          } else {
            if (undefined === alldata) {
              if (permissions.length > 0) {
                var conditions = args.params.condition;
                conditions.simpleVOs = [
                  {
                    logicOp: "and",
                    conditions: [
                      {
                        logicOp: "or",
                        conditions: [
                          {
                            field: "matter_type_m", //设置事项类型为员工状态
                            op: "eq",
                            value1: "3"
                          },
                          {
                            field: "StaffNew", //人员权限信息
                            op: "in",
                            value1: permissions
                          }
                        ]
                      }
                    ]
                  }
                ];
              } else {
                commonVOs.push({
                  itemName: "matter_type_m", //设置事项类型为员工状态
                  op: "eq",
                  value1: "3"
                });
              }
            }
          }
          promise.resolve();
        }
      });
    }, 10);
    return promise;
  });
}