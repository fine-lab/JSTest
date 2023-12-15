viewModel.on("afterLoadData", function () {
  var tt = cb.rest.invokeFunction("GT102917AT3.API.queryCellphone", {}, function (err, res) {}, viewModel, { async: false });
  //获取当前用户姓名
  var data = tt.result.currentUser;
  var name = data.name;
  var options = {
    domainKey: "yourKeyHere",
    async: false
  };
  var proxy = cb.rest.DynamicProxy.create({
    settle: {
      url: "https://www.example.com/",
      method: "POST",
      options: options
    }
  });
  var reqParams = {
    page: {
      pageSize: 20,
      pageIndex: 1,
      totalCount: 1
    },
    billnum: "sys_authority",
    condition: {
      commonVOs: [
        {
          itemName: "schemeName",
          value1: "全部身份类型查询"
        },
        {
          itemName: "isDefault",
          value1: true
        },
        {
          itemName: "name",
          value1: name
        }
      ],
      filtersId: "yourIdHere",
      solutionId: 1102914164,
      bInit: true
    },
    bEmptyWithoutFilterTree: false,
    serviceCode: "u8c_GZTACT020",
    refimestamp: "1661398544688",
    ownDomain: "u8c-auth"
  };
  var def = proxy.settle(reqParams, function (err, result) {});
  if (def.err) {
    cb.utils.alert("未获得授权权限");
    return false;
  } else {
    var userDate = def.result.recordList;
    if (userDate.length > 0) {
      var userId = null;
      for (var i = 0; i < userDate.length; i++) {
        if (def.result.recordList[i].yhtUserId == data.id) {
          userId = userDate[i].id;
          break;
        }
      }
      if (userId == null) {
        cb.utils.alert("1111111");
        //表单字段进行隐藏、只读操作
      } else {
        var proxy1 = cb.rest.DynamicProxy.create({
          settle: {
            url: "https://www.example.com/" + userId,
            method: "GET",
            options: options
          }
        });
        var reqParams1 = { page: { pageSize: 20, pageIndex: 1, totalCount: 2 } };
        var gta = proxy1.settle(reqParams1, function (err1, result1) {});
        if (gta.err1) {
          cb.utils.alert("未获得授权权限");
          return false;
        } else {
        }
        //根据
      }
    }
  }
});