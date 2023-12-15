let gridModel = viewModel.getGridModel();
var commonVOs, reqCondition, permissions, alldata;
var alldata;
viewModel.on("beforeSearch", function (args) {
  //需要获取当前人的身份信息，确定默认的查询条件
  var promise = new cb.promise();
  setTimeout(function () {
    cb.rest.invokeFunction("3982d8d746054b3c801121253a4e5c7d", {}, function (err, res) {
      if (err != null) {
        cb.utils.alert("查询数据异常" + err.message);
        permissions = [];
        return false;
      } else {
        permissions = res.res;
        permissions = res.res;
        alldata = res.allData;
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
                          field: "zhidanren", //人员权限信息
                          op: "in",
                          value1: permissions
                        }
                      ]
                    }
                  ]
                }
              ];
            }
          }
        }
        promise.resolve();
      }
    });
  }, 10);
  return promise;
});