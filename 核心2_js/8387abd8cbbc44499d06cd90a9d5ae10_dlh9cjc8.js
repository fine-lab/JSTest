cb.defineInner([], function () {
  var MyExternal = {
    //注册扩展公共函数
    getServeData(params) {
      return new Promise((resolve, reject) => {
        //创建获取服务端数据proxy对象
        const proxy = params.viewModel.setProxy({
          queryData: {
            url: params.url || "",
            method: params.method || "GET"
          }
        });
        //服务端上送数据
        const param = params.param || {};
        proxy.queryData(param, function (error, result) {
          if (error.msg) {
            //请求返回错误信息，返回错误信息出去
            reject(error);
          } else {
            //请求返回成功，返回成功数据出去
            resolve(result);
          }
        });
      });
    }
  };
  return MyExternal;
});