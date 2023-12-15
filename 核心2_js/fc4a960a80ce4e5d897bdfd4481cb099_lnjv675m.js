viewModel.get("button2dg") &&
  viewModel.get("button2dg").on("click", function (data) {
    // 根据路径获取图片对象--单击
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
          method: "get",
          options: options
        }
      });
      proxy.settle(reqParams, function (err, result) {
        if (err) {
          returnPromise.reject(err);
        } else {
          returnPromise.resolve(result);
        }
      });
      return returnPromise;
    }
    let action = "https://www.example.com/";
    let params = {
      terminalType: 1
    };
    let options = {
    };
    apipost(params, data, options, action).then((res, err) => {
      if (res) {
        let data = res.data[0];
        console.log("res", JSON.stringify(data));
      }
      if (err) {
        console.log("err", JSON.stringify(err));
      }
    });
  });