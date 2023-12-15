cb.defineInner([], function () {
  var MyExternal = {
    // 获取应用配置
    getAppConfig: function () {
      return {};
    },
    // 获取当前登录用户信息
    getLoginUserInfo: function () {
      let promise = new cb.promise();
      cb.rest.invokeFunction("AT17AF3C4816B00004.frontDesignerFunction.getUserInfo", {}, function (err, res) {
        if (err) {
          cb.utils.alert("用户信息异常，请重新登录", "error");
          promise.reject();
          return false;
        }
        if (res) {
          promise.resolve(res);
        }
      });
      return promise;
    },
    getSysUserInfo: function (param) {
      if (!param) return;
      const { serviceCode, orgId, userId, orgRelId } = param;
      var url = `${cb.utils.getServiceUrl()}/uniform/bill/detail?terminalType=1&serviceCode=${serviceCode}&orgId=${orgId}&billnum=mdd_staff_card&tplid=1653370630463029253&id=${userId}&orgRelId=${orgRelId}&spanTrace=undefined`;
      var proxy = viewModel.setProxy({
        ensure: {
          url: url,
          method: "GET",
          options: {
            // 选填，系统会自动添加
            domainKey: "yourKeyHere", //viewModel.getParams().domainKey, // 选填，系统会自动添加,在URL中添加domainKey无效时，可在此处添加
            async: true
          }
        }
      });
      //拼接接口入参
      var params = {
        terminalType: 1,
        billnum: "fa06ca73",
        id: id,
        spanTrace: undefined
      };
      //调用接口后执行的操作
      proxy.ensure(params, function (err, result) {
        if (result.error) {
          cb.utils.alert(result.message, "error");
          return;
        } else {
          viewModel.setData(result); // 给卡片页设置数据
        }
      });
    }
  };
  return MyExternal;
});