viewModel.on("customInit", function (data) {
  // 终端费用厂家主表子表--页面初始化
  viewModel.on("beforeSearch", function (args) {
    //确定是厂家还是业务员
    //查询用户员工信息
    let userId = cb.rest.AppContext.user.userId;
    let res = cb.rest.invokeFunction("GT9037AT11.after.isYwyOrFactory", {}, function (err, res) {}, viewModel, { async: false });
    let staffInfo = res.result.resultJSON.data[userId];
    //员工id和组织id
    if (staffInfo) {
      let staffId = staffInfo.id;
      let orgId = staffInfo.orgId;
      //如果员工组织是厂家人员的 添加过滤
      if (orgId && orgId == "1512512341613740038") {
        args.isExtend = true;
        var conditions = args.params.condition;
        conditions.simpleVOs = [
          {
            logicOp: "or",
            conditions: [
              {
                field: "changjiashenpirenyuan1",
                op: "eq",
                value1: staffId
              },
              {
                field: "changjiashenpirenyuan2",
                op: "eq",
                value1: staffId
              }
            ]
          }
        ];
      }
    }
  });
  viewModel.on("afterMount", function (params) {
    var billnum = viewModel.getParams().billNo;
    cb.rest.invokeFunction("GT9037AT11.after.isHasLimi", { billnum: billnum }, function (err, res) {
      if (err != null) {
        cb.utils.alert("权限控制异常");
        return false;
      } else {
        // 返回具体数据
        if (res.res.length > 0) {
          //说明当前登录人在权限控制范围内
          let data = res.res;
          for (let i in data) {
            let isMain = data[i].isMain; //判断是否是主表
            let isList = data[i].isList; //判断是否是列表
            let cItemName = data[i].cItemName; //字段别名
            let childrenField = data[i].childrenField; //子表集合属性或者主表别名
            if (isMain == "1") {
              if (isList == "1") {
                //是
                viewModel.get(childrenField).setColumnState(cItemName, "bShowIt", false);
              } else {
                //否
                viewModel.get(cItemName).setVisible(false);
              }
            } else {
              //说明是子表
              viewModel.get(childrenField).setColumnState(cItemName, "bShowIt", false);
            }
          }
        }
      }
    });
  });
});