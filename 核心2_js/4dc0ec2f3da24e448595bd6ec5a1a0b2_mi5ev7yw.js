run = function (event) {
  var viewModel = this;
  viewModel.on("beforeSave", function (data) {
    //判重
    let id = viewModel.get("id").getValue();
    let orgId = viewModel.get("org_id").getValue();
    let returnPromise = new cb.promise();
    validateUnique("ISY_2.ISY_2.SY01_gmpparams", id, orgId).then(
      (res) => {
        returnPromise.resolve();
      },
      (err) => {
        cb.utils.alert(err, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  let validateUnique = function (uri, id, orgId) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("ISY_2.backOpenApiFunction.fieldsUnique", { id: id, tableUri: uri, fields: { org_id: { value: orgId } } }, function (err, res) {
        if (typeof res !== "undefined") {
          if (res.repeat == true) {
            reject("此组织已有相关配置");
          } else {
            resolve();
          }
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
  viewModel.get("org_id_name").on("beforeBrowse", function (data) {
    debugger;
    let returnPromise = new cb.promise();
    selectOrg().then(
      (data) => {
        let orgId = [];
        if (data.length == 0) {
          orgId.push("-1");
        } else {
          for (let i = 0; i < data.length; i++) {
            orgId.push(data[i]);
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
  function selectOrg() {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("ISY_2.backOpenApiFunction.getOrgIdList", {}, function (err, res) {
        console.log(res);
        console.log(err);
        if (typeof res != "undefined") {
          let orgIdArr = res.orgId;
          resolve(orgIdArr);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  }
};