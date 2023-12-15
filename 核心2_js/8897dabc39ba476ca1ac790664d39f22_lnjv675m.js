viewModel.on("customInit", function (data) {
  // 我的银行账户--页面初始化
  viewModel.on("beforeSearch", function (args) {
    var promise = new cb.promise();
    cb.rest.invokeFunction("GT34544AT7.authManager.getAllDeptJoin", {}, function (err, res) {
      let deptId = res.deptId;
      args.isExtend = true;
      //通用检查查询条件
      args.params.condition.simpleVOs = [];
      args.params.condition.simpleVOs.push({
        field: "ManageDept",
        op: "in",
        value1: res.deptArr
      });
      promise.resolve();
    });
    return promise;
  });
});
viewModel.get("button30zb") &&
  viewModel.get("button30zb").on("click", function (data) {
    // 期初设置--单击
    //封装的业务函数
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
          method: "POST",
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
    let returnPromise = new cb.promise();
    let action = "https://www.example.com/";
    let params = {
      terminalType: 1
    };
    let vbody = {
      billnum: "org_bpConflist",
      data: {
        org_bpConflist: [
          {
            periodid: 2106239278725376,
            periodid_enddate: "2015-03-31 00:00:00",
            enable: 1,
            type_code_name: "固定资产",
            id: "youridHere",
            pubts: "2022-09-14 11:36:02",
            periodid_name: "2015-02",
            type_code_isperiod: 1,
            orgid: "youridHere",
            type_code: "assets",
            _tableDisplayOutlineAll: false,
            _status: "Update"
          }
        ],
        _status: "Update"
      },
      externalData: { orgid: "youridHere" }
    };
    let options = {
      domainKey: "yourKeyHere"
    };
    apipost(params, vbody, options, action).then((res, err) => {
      console.log(JSON.stringify(res));
      returnPromise.resolve(res);
    });
    return returnPromise;
  });