viewModel.get("test_history_authorg_1804500195699326980") &&
  viewModel.get("test_history_authorg_1804500195699326980").on("afterSetDataSource", function (data) {
    //表格--设置数据源后
  });
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
  logs("requrl === ");
  logs(requrl);
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
let paramsFactory = (rows) => {
  let promise = new cb.promise();
  let newParams = [];
  let param = {};
  for (let i = 0; i < rows.length; i++) {
    param.action = "https://www.example.com/";
    param.params = {
      serviceCode: "u8c_GZTACT020",
      terminalType: 1
    };
    param.options = {
      domainKey: "yourKeyHere"
    };
    param.body = {
      resources: [
        {
          add: [],
          del: [],
          isLazyLoad: false,
          resourceFunction: "orgunit",
          resourcetypecode: "orgdept"
        }
      ],
      roleId: rows[i].role,
      userId: rows[i].SysyhtUserId,
      yxyUserId: rows[i].SysUser
    };
    if (rows[i].ContainSubFlag == "1") {
      param.body.resources[0].add.push("child://" + rows[i].UserManageOrg);
    } else {
      param.body.resources[0].add.push(rows[i].UserManageOrg);
    }
    param.id = rows[i].id;
    newParams.push(param);
  }
  promise.resolve(newParams);
  return promise;
};
let orgAuthorize = (newParams) => {
  let promise = new cb.promise();
  let errs = [];
  let sucs = [];
  let ress = {};
  let time = 0;
  for (let i = 0; i < newParams.length; i++) {
    time += 1;
    setTimeout(function () {
      let param = newParams[i];
      apipost(param.params, param.body, param.options, param.action).then((res, err) => {
        if (err) {
          errs.push(param.id);
          errs.push(err);
        } else {
          sucs.push(param.id);
        }
      });
    }, 300 * time);
  }
  setTimeout(
    function () {
      promise.resolve(ress);
    },
    300 * newParams.length + 1000
  );
  return promise;
};
viewModel.get("button21td") &&
  viewModel.get("button21td").on("click", function (data) {
  });