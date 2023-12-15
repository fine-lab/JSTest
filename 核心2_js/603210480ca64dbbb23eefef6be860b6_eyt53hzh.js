run = function (event) {
  var viewModel = this;
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
};