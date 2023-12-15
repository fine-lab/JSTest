viewModel.on("customInit", function (data) {
  // 终端费用促销申请表详情--页面初始化
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