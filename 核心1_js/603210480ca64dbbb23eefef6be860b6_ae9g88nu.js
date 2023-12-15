run = function (event) {
  var viewModel = this;
  viewModel.on("beforeDelete", function (data) {
    let promiseArr = [];
    let relePlanRes = [];
    promiseArr.push(
      getRelePlanMater().then((res) => {
        relePlanRes = res;
      })
    );
    let returnPromise = new cb.promise();
    Promise.all(promiseArr).then((res) => {
      let orgId = viewModel.get("org_id").getValue();
      let mId = viewModel.get("id").getValue();
      let exist = false;
      if (relePlanRes.length > 0) {
        for (let i = 0; i < relePlanRes.length; i++) {
          if (relePlanRes[i].releasePlan == mId) {
            exist = true;
            break;
          }
        }
      }
      if (exist) {
        cb.utils.alert("该放行方案已被放行方案与物料对照表引用，无法删除", "error");
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    });
    return returnPromise;
  });
  //组织过滤
  viewModel.get("org_id_name").on("beforeBrowse", function (data) {
    debugger;
    let returnPromise = new cb.promise();
    selectParamOrg().then(
      (data) => {
        let orgId = [];
        if (data.length == 0) {
          orgId.push("-1");
        } else {
          for (let i = 0; i < data.length; i++) {
            orgId.push(data[i].org_id);
          }
        }
        let treeCondition = {
          isExtend: true,
          simpleVOs: []
        };
        if (orgId.length > 0) {
          treeCondition.simpleVOs.push({
            field: "id",
            op: "in",
            value1: orgId
          });
        }
        this.setTreeFilter(treeCondition);
        returnPromise.resolve();
      },
      (err) => {
        cb.utils.alert(err, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  let selectParamOrg = function () {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("ISY_2.public.getParamInfo", {}, function (err, res) {
        console.log(res);
        console.log(err);
        if (typeof res != "undefined") {
          let paramRres = res.paramRes;
          resolve(paramRres);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
  viewModel.on("beforeSave", function () {
    let orgId = viewModel.get("org_id").getValue();
    let promises = [];
    let orgRes = [];
    promises.push(
      selectParamOrg().then((res) => {
        orgRes = res;
      })
    );
    var returnPromise = new cb.promise();
    Promise.all(promises).then(() => {
      let orgIdList = [];
      for (let j = 0; j < orgRes.length; j++) {
        orgIdList.push(orgRes[j].org_id);
      }
      let index = orgIdList.indexOf(orgId);
      if (index == -1) {
        cb.utils.alert("该组织没有开启GMP参数,请检查", "error");
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    });
    return returnPromise;
  });
  function getRelePlanMater() {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("ISY_2.public.getRelePlanMater", {}, function (err, res) {
        console.log(res);
        console.log(err);
        if (typeof res != "undefined" && res != null) {
          let relePlanRes = res.res;
          resolve(relePlanRes);
        } else if (err != null) {
          reject();
        }
      });
    });
  }
};