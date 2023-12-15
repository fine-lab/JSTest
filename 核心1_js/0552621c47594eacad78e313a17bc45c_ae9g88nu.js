let gridModelInfo = viewModel.getGridModel("SY01_shebusemxList");
gridModelInfo
  .getEditRowModel()
  .get("equipment_code_code")
  .on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let promises = [];
    let deviceFiles = [];
    promises.push(
      getDeviceFiles(orgId).then((res) => {
        deviceFiles = res;
      })
    );
    let promise = new cb.promise();
    Promise.all(promises).then(() => {
      if (deviceFiles.length < 1) {
        promise.reject();
        return false;
      }
      let ids = [];
      for (let i = 0; i < deviceFiles.length; i++) {
        ids.push(deviceFiles[i].id);
      }
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "id",
        op: "in",
        value1: ids
      });
      this.setFilter(condition);
      promise.resolve();
    });
    return promise;
  });
gridModelInfo
  .getEditRowModel()
  .get("use_department_name")
  .on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let promises = [];
    let deviceFiles = [];
    promises.push(
      getDeviceFiles(orgId).then((res) => {
        deviceFiles = res;
      })
    );
    let promise = new cb.promise();
    Promise.all(promises).then(() => {
      if (deviceFiles.length < 1) {
        promise.reject();
        return false;
      }
      let ids = [];
      for (let i = 0; i < deviceFiles.length; i++) {
        ids.push(deviceFiles[i].id);
      }
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "id",
        op: "in",
        value1: ids
      });
      this.setFilter(condition);
      promise.resolve();
    });
    return promise;
  });
function getDeviceFiles(orgId) {
  return new Promise((resolve, reject) => {
    cb.rest.invokeFunction(
      "GT22176AT10.frontPublicFunction.getDeviceFiles",
      {
        orgId: orgId
      },
      function (err, res) {
        console.log(res);
        console.log(err);
        if (typeof res != "undefined") {
          let deviceFilesRes = res.deviceFilesRes;
          if (typeof deviceFilesRes != "undefined" && deviceFilesRes != null) {
            resolve(deviceFilesRes);
          } else {
            reject();
          }
        } else if (typeof err != "undefined") {
          reject();
        }
      }
    );
  });
}
viewModel.on("customInit", function (data) {
  // 仪器设备使用记录--页面初始化
});