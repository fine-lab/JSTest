cb.defineInner([], function () {
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
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
        const param = params.param || {};
        console.log(param);
        proxy.queryData(param, function (error, result) {
          if (error.msg) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    }
  };
  return MyExternal;
});