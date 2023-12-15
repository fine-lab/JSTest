viewModel.get("button140nd") &&
  viewModel.get("button140nd").on("click", function (data) {
    // 填写部门自定义项三--单击
    let getID = () => {
      let promise = new cb.promise();
      cb.rest.invokeFunction("GT34544AT7.MyOrg.getAllSysDeptId", {}, function (err, res) {
        let deptIDArr = res.res;
        promise.resolve(deptIDArr);
      });
      return promise;
    };
    let getxq = (deptIDArr) => {
      let promise = new cb.promise();
      let newDeptArr = [];
      let time = 0;
      for (let i = 0; i < deptIDArr.length; i++) {
        time += 1;
        setTimeout(function () {
          cb.rest.invokeFunction("GT34544AT7.dept.deptSearchById", { id: deptIDArr[i].sysOrg }, function (err, res) {
            if (err) {
              console.log("err", JSON.stringify(err));
            }
            if (res) {
              res.res.res.data["deptdefines!define3"] = 0;
              console.log("详情：", JSON.stringify(res));
              newDeptArr.push(res.res.res.data);
            }
          });
        }, 800 * time);
      }
      setTimeout(
        function () {
          promise.resolve(newDeptArr);
        },
        800 * deptIDArr.length + 2000
      );
      return promise;
    };
    let Update = (newDeptArr) => {
      let promise = new cb.promise();
      let time = 0;
      let errArr = [];
      let resArr = [];
      for (let i = 0; i < newDeptArr.length; i++) {
        time += 1;
        setTimeout(function () {
          let data = [];
          let obj = newDeptArr[i];
          delete obj.pubts;
          if (obj.adminOrg !== undefined) {
            delete obj.adminOrg.pubts;
          }
          delete obj.parent_name;
          obj._status = "Update";
          obj.parent = "1502479727503867906";
          obj.parentorgid = "youridHere";
          obj.parentid = "youridHere";
          delete obj.adminOrg.porgid_name;
          delete obj.adminOrg.parentid_name;
          if (obj.adminOrg !== undefined) {
            obj.adminOrg._status = "Update";
          }
          let request = {};
          request.uri = "/yonbip/digitalModel/orgunit/save";
          let externalData = {};
          externalData = {
            typelist: ["adminorg"]
          };
          request.body = { data: obj, externalData: externalData };
          cb.rest.invokeFunction("GT34544AT7.org.newUptate", { request }, function (err, res) {
            if (res) {
              if (res.res.data) {
                resArr.push({ index: i, data: res.res.data });
              } else if (res.res.data === undefined) {
                errArr.push(request.body);
              }
            }
          });
        }, 1500 * time);
      }
      setTimeout(
        function () {
          let returnData = { resArr: resArr };
          promise.resolve(returnData);
        },
        1500 * newDeptArr.length + 1000
      );
      return promise;
    };
    getID().then((deptIDArr) => {
      getxq(deptIDArr).then((newDeptArr) => {
        Update(newDeptArr).then((returnData) => {
          console.log(JSON.stringify(returnData));
        });
      });
    });
  });
viewModel.get("button143af") &&
  viewModel.get("button143af").on("click", function (data) {
    // 修改系统编码--单击
    let getID = () => {
      let promise = new cb.promise();
      cb.rest.invokeFunction("GT34544AT7.MyOrg.getAllSysDeptId", {}, function (err, res) {
        let deptIDArr = res.res;
        promise.resolve(deptIDArr);
      });
      return promise;
    };
    let getxq = (deptIDArr) => {
      let promise = new cb.promise();
      let newDeptArr = [];
      let time = 0;
      for (let i = 0; i < deptIDArr.length; i++) {
        time += 1;
        setTimeout(function () {
          cb.rest.invokeFunction("GT34544AT7.org.orgSearch", { id: deptIDArr[i].sysOrg }, function (err, res) {
            if (err) {
              console.log("err", JSON.stringify(err));
            }
            if (res) {
              newDeptArr.push(res.res.res.data);
            }
          });
        }, 800 * time);
      }
      setTimeout(
        function () {
          promise.resolve(newDeptArr);
        },
        800 * deptIDArr.length + 2000
      );
      return promise;
    };
    let Update = (newDeptArr) => {
      let promise = new cb.promise();
      let time = 0;
      let errArr = [];
      let resArr = [];
      for (let i = 0; i < newDeptArr.length; i++) {
        time += 1;
        setTimeout(function () {
          let obj = newDeptArr[i];
          delete obj.pubts;
          if (obj.adminOrg !== undefined) {
            delete obj.adminOrg.pubts;
          }
          delete obj.parent_name;
          obj._status = "Update";
          obj.code = "D" + obj.code;
          if (obj.adminOrg !== undefined) {
            obj.adminOrg._status = "Update";
          }
          let request = {};
          request.uri = "/yonbip/digitalModel/orgunit/save";
          let externalData = {};
          externalData = {
            typelist: ["adminorg"]
          };
          request.body = { data: obj, externalData: externalData };
          cb.rest.invokeFunction("GT34544AT7.org.newUptate", { request }, function (err, res) {
            if (res) {
              if (res.res.data) {
                resArr.push({ data: res.res.data });
              }
            } else {
              errArr.push(res);
            }
          });
        }, 1500 * time);
      }
      setTimeout(
        function () {
          let returnData = { resArr: resArr };
          promise.resolve(returnData);
        },
        1500 * newDeptArr.length + 1000
      );
      return promise;
    };
    getID().then((deptIDArr) => {
      getxq(deptIDArr).then((newDeptArr) => {
        Update(newDeptArr).then((returnData) => {
          console.log("修改部门结果：", JSON.stringify(returnData));
        });
      });
    });
  });
viewModel.get("button155qd") &&
  viewModel.get("button155qd").on("click", function (data) {
    // 创建系统部门--单击
    let getID = () => {
      let promise = new cb.promise();
      cb.rest.invokeFunction("GT34544AT7.MyOrg.getAllSysDeptId", {}, function (err, res) {
        let deptIDArr = res.res;
        promise.resolve(deptIDArr);
      });
      return promise;
    };
    let getxq = (deptIDArr) => {
      let promise = new cb.promise();
      let newDeptArr = [];
      let time = 0;
      for (let i = 0; i < deptIDArr.length; i++) {
        time += 1;
        setTimeout(function () {
          cb.rest.invokeFunction("GT34544AT7.org.orgSearch", { id: deptIDArr[i].sysOrg }, function (err, res) {
            if (err) {
              console.log("err", JSON.stringify(err));
            }
            if (res) {
              newDeptArr.push(res.res.res.data);
            }
          });
        }, 800 * time);
      }
      setTimeout(
        function () {
          promise.resolve(newDeptArr);
        },
        800 * deptIDArr.length + 2000
      );
      return promise;
    };
    let Update = (newDeptArr) => {
      let promise = new cb.promise();
      let time = 0;
      let errArr = [];
      let resArr = [];
      for (let i = 0; i < newDeptArr.length; i++) {
        time += 1;
        setTimeout(function () {
          let obj = newDeptArr[i];
          let code = obj.code.substring(1);
          let data = {
            parentorgid: obj.parent,
            _status: "Insert",
            name: obj.name.zh_CN,
            code: code,
            enable: 1
          };
          if (obj.code.includes("Admin")) {
            data["deptdefines!define3"] = "1";
          } else {
            data["deptdefines!define3"] = "0";
          }
          let request = {};
          request.uri = "/yonbip/digitalModel/admindept/save";
          request.body = { data: data };
          cb.rest.invokeFunction("GT34544AT7.org.newUptate", { request }, function (err, res) {
            if (res) {
              if (res.res.data) {
                resArr.push({ index: i, data: res.res.data });
              } else if (res.res.data === undefined) {
                errArr.push(request.body);
              }
            }
          });
        }, 1500 * time);
      }
      setTimeout(
        function () {
          let returnData = { resArr: resArr };
          promise.resolve(returnData);
        },
        1500 * newDeptArr.length + 1000
      );
      return promise;
    };
    //修改自建员工任职、兼职表
    getID().then((deptIDArr) => {
      getxq(deptIDArr).then((newDeptArr) => {
        Update(newDeptArr).then((returnData) => {
          changeSysDeptID(deptIDArr, returnData).then((changeDept) => {
            console.log("新增部门结果：", JSON.stringify(changeDept));
          });
        });
      });
    });
  });
viewModel.get("button163jj") &&
  viewModel.get("button163jj").on("click", function (data) {
    // 修改兼任职表系统部门--单击
    cb.rest.invokeFunction("GT34544AT7.gxsStaffMainJob.changeSysDeptID", {}, function (err, res) {
      if (err) {
        console.log(JSON.stringify(err));
      }
      if (res) {
        console.log(JSON.stringify(res.res));
      }
    });
  });
viewModel.get("button173ja") &&
  viewModel.get("button173ja").on("click", function (data) {
    // 修改自建组织系统部门ID--单击
    let getID = () => {
      let promise = new cb.promise();
      cb.rest.invokeFunction("GT34544AT7.MyOrg.getAllSysDeptId", {}, function (err, res) {
        let deptIDArr = res.res;
        promise.resolve(deptIDArr);
      });
      return promise;
    };
    let getxq = (deptIDArr) => {
      let promise = new cb.promise();
      let newDeptArr = [];
      let time = 0;
      for (let i = 0; i < deptIDArr.length; i++) {
        time += 1;
        setTimeout(function () {
          cb.rest.invokeFunction("GT34544AT7.dept.deptSearchByCode", { code: deptIDArr[i].OrgCode }, function (err, res) {
            if (err) {
              console.log("err", JSON.stringify(err));
            }
            if (res.res.length > 0) {
              newDeptArr.push(res.res[0]);
            }
          });
        }, 500 * time);
      }
      setTimeout(
        function () {
          promise.resolve(newDeptArr);
        },
        500 * deptIDArr.length + 2000
      );
      return promise;
    };
    //更新自建组织表系统部门ID
    let changeSysDeptID = (deptIDArr, newDeptArr) => {
      let promise = new cb.promise();
      let object = [];
      let arr = [];
      let deptLength = newDeptArr.length;
      let deptIdLength = deptIDArr.length;
      for (let i = 0; i < deptLength; i++) {
        for (let k = 0; k < deptIdLength; k++) {
          if (newDeptArr[i].code === deptIDArr[k].OrgCode) {
            let data = {
              id: deptIDArr[k].id,
              sysOrg: newDeptArr[i].id
            };
            object.push(data);
          }
        }
        if (i % 49 === 0 && i !== 0) {
          arr.push(object);
          object = [];
        }
      }
      arr.push(object);
      let changeDept = [];
      let time = 0;
      for (let i = 0; i < arr.length; i++) {
        time += 1;
        setTimeout(function () {
          cb.rest.invokeFunction("GT34544AT7.ownOrg.changeSysDeptID", { object: arr[i] }, function (err, res) {
            changeDept.push(res.res);
            if (err) {
              changeDept.push(err);
            }
          });
        }, 8000 * time);
      }
      setTimeout(
        function () {
          promise.resolve(changeDept);
        },
        8000 * arr.length + 2000
      );
      return promise;
    };
    getID().then((deptIDArr) => {
      getxq(deptIDArr).then((newDeptArr) => {
        changeSysDeptID(deptIDArr, newDeptArr).then((changeDept) => {
          console.log("修改部门结果：", JSON.stringify(changeDept));
        });
      });
    });
  });
viewModel.get("button181hg") &&
  viewModel.get("button181hg").on("click", function (data) {
    // 修改管理区域表任职部门--单击
    cb.rest.invokeFunction("GT34544AT7.areaManager.changeSysDeptID", {}, function (err, res) {
      if (err) {
        console.log(JSON.stringify(err));
      }
      if (res) {
        console.log(JSON.stringify(res.res));
      }
    });
  });
viewModel.get("button191fi") &&
  viewModel.get("button191fi").on("click", function (data) {
    // 修改管理单位部门ID--单击
    cb.rest.invokeFunction("GT34544AT7.orgManager.changeSysDeptID", {}, function (err, res) {
      if (err) {
        console.log(JSON.stringify(err));
      }
      if (res) {
        console.log(JSON.stringify(res.res));
      }
    });
  });
viewModel.get("button203sk") &&
  viewModel.get("button203sk").on("click", function (data) {
    // 修改员工卡片主任职部门--单击
    let getID = () => {
      let promise = new cb.promise();
      cb.rest.invokeFunction("GT34544AT7.gxsStaffMainJob.getALL", {}, function (err, res) {
        let deptIDArr = res.res;
        promise.resolve(deptIDArr);
      });
      return promise;
    };
    let getxq = (deptIDArr) => {
      let promise = new cb.promise();
      let newDeptArr = [];
      let time = 0;
      for (let i = 0; i < deptIDArr.length; i++) {
        time += 1;
        setTimeout(function () {
          cb.rest.invokeFunction("GT34544AT7.staff.showStaffById", { id: deptIDArr[i].sysStaff }, function (err, res) {
            if (err) {
              console.log("err", JSON.stringify(err));
            }
            if (res.res.data) {
              let staff = res.res.data;
              let mainJobList = staff.mainJobList;
              staff._status = "Update";
              delete staff.pubts;
              if (staff.ptJobList !== undefined && staff.ptJobList.length > 0) {
                delete staff.ptJobList;
              }
              if (staff.bankAcctList !== undefined && staff.bankAcctList.length > 0) {
                delete staff.bankAcctList;
              }
              if (staff.mainJobList !== undefined && staff.mainJobList.length > 0) {
                for (let j = 0; j < mainJobList.length; j++) {
                  if (mainJobList[j].id === deptIDArr[i].sysMainJobId) {
                    mainJobList[j].dept_id = deptIDArr[i].sysDept;
                    mainJobList[j]._status = "Update";
                    delete mainJobList[j].pubts;
                  }
                }
              }
              newDeptArr.push(staff);
            }
          });
        }, 500 * time);
      }
      setTimeout(
        function () {
          promise.resolve(newDeptArr);
        },
        500 * deptIDArr.length + 2000
      );
      return promise;
    };
    let changeSysDeptID = (newDeptArr) => {
      let promise = new cb.promise();
      let time = 0;
      let errArr = [];
      let resArr = [];
      for (let i = 0; i < newDeptArr.length; i++) {
        time += 1;
        setTimeout(function () {
          let data = [];
          let staff = newDeptArr[i];
          cb.rest.invokeFunction("GT34544AT7.staff.createStaff", { body: { data: staff } }, function (err, res) {
            if (res) {
              if (res.res.res.data) {
                resArr.push({ data: res.res.res.data });
              }
            }
            if (err) {
              errArr.push(err);
            }
          });
        }, 1000 * time);
      }
      setTimeout(
        function () {
          let returnData = { resArr: resArr, errArr: errArr };
          promise.resolve(returnData);
        },
        1000 * newDeptArr.length + 1000
      );
      return promise;
    };
    getID().then((deptIDArr) => {
      getxq(deptIDArr).then((newDeptArr) => {
        changeSysDeptID(newDeptArr).then((returnData) => {
          console.log("更新员工卡片主任职部门结果：", JSON.stringify(returnData));
        });
      });
    });
  });
viewModel.get("button211bb") &&
  viewModel.get("button211bb").on("click", function (data) {
    // 修正系统兼职部门1--单击
    let getID = () => {
      let promise = new cb.promise();
      cb.rest.invokeFunction("GT34544AT7.areaManager.getAll", {}, function (err, res) {
        let deptIDArr = res.res;
        promise.resolve(deptIDArr);
      });
      return promise;
    };
    let getxq = (deptIDArr) => {
      let promise = new cb.promise();
      let newDeptArr = [];
      let time = 0;
      for (let i = 0; i < deptIDArr.length; i++) {
        time += 1;
        setTimeout(function () {
          cb.rest.invokeFunction("GT34544AT7.staff.showStaffById", { id: deptIDArr[i].StaffNew }, function (err, res) {
            if (err) {
              console.log("err", JSON.stringify(err));
            }
            if (res.res.data) {
              let staff = res.res.data;
              let ptJobList = staff.ptJobList;
              let mainJobList = staff.mainJobList;
              staff._status = "Update";
              delete staff.pubts;
              mainJobList[0]._status = "Update";
              delete mainJobList[0].pubts;
              if (staff.bankAcctList !== undefined && staff.bankAcctList.length > 0) {
                delete staff.bankAcctList;
              }
              if (ptJobList !== undefined && ptJobList.length > 0) {
                for (let j = 0; j < ptJobList.length; j++) {
                  if (ptJobList[j].org_id === deptIDArr[i].sysManagerOrg) {
                    ptJobList[j].dept_id = deptIDArr[i].AdminOrgVO;
                    ptJobList[j]._status = "Update";
                    delete ptJobList[j].pubts;
                  }
                }
              }
              newDeptArr.push(staff);
            }
          });
        }, 500 * time);
      }
      setTimeout(
        function () {
          promise.resolve(newDeptArr);
        },
        500 * deptIDArr.length + 2000
      );
      return promise;
    };
    let changeSysDeptID = (newDeptArr) => {
      let promise = new cb.promise();
      let time = 0;
      let errArr = [];
      let resArr = [];
      for (let i = 0; i < newDeptArr.length; i++) {
        time += 1;
        setTimeout(function () {
          let data = [];
          let staff = newDeptArr[i];
          cb.rest.invokeFunction("GT34544AT7.staff.createStaff", { body: { data: staff } }, function (err, res) {
            if (res) {
              if (res.res.res.data) {
                resArr.push({ data: res.res.res.data });
              }
            }
            if (err) {
              errArr.push(err);
            }
          });
        }, 1000 * time);
      }
      setTimeout(
        function () {
          let returnData = { resArr: resArr, errArr: errArr };
          promise.resolve(returnData);
        },
        1000 * newDeptArr.length + 1000
      );
      return promise;
    };
    getID().then((deptIDArr) => {
      getxq(deptIDArr).then((newDeptArr) => {
        changeSysDeptID(newDeptArr).then((returnData) => {
          console.log("根据管理区域更新员工卡片兼职部门结果：", JSON.stringify(returnData));
        });
      });
    });
  });
viewModel.get("button219yj") &&
  viewModel.get("button219yj").on("click", function (data) {
    // 修正系统兼职部门2--单击
    let getID = () => {
      let promise = new cb.promise();
      cb.rest.invokeFunction("GT34544AT7.orgManager.getAll", {}, function (err, res) {
        let deptIDArr = res.res;
        promise.resolve(deptIDArr);
      });
      return promise;
    };
    let getxq = (deptIDArr) => {
      let promise = new cb.promise();
      let newDeptArr = [];
      let time = 0;
      for (let i = 0; i < deptIDArr.length; i++) {
        time += 1;
        setTimeout(function () {
          cb.rest.invokeFunction("GT34544AT7.staff.showStaffById", { id: deptIDArr[i].StaffNew }, function (err, res) {
            if (err) {
              console.log("err", JSON.stringify(err));
            }
            if (res.res.data) {
              let staff = res.res.data;
              let ptJobList = staff.ptJobList;
              let mainJobList = staff.mainJobList[0];
              staff._status = "Update";
              delete staff.pubts;
              if (mainJobList !== undefined) {
                mainJobList._status = "Update";
                delete mainJobList.pubts;
              }
              if (staff.bankAcctList !== undefined && staff.bankAcctList.length > 0) {
                delete staff.bankAcctList;
              }
              if (ptJobList !== undefined && ptJobList.length > 0) {
                for (let j = 0; j < ptJobList.length; j++) {
                  if (ptJobList[j].org_id === deptIDArr[i].sysManagerOrg) {
                    ptJobList[j].dept_id = deptIDArr[i].AdminOrgVO;
                    ptJobList[j]._status = "Update";
                    delete ptJobList[j].pubts;
                  }
                }
              }
              newDeptArr.push(staff);
            }
          });
        }, 500 * time);
      }
      setTimeout(
        function () {
          promise.resolve(newDeptArr);
        },
        500 * deptIDArr.length + 2000
      );
      return promise;
    };
    let changeSysDeptID = (newDeptArr) => {
      let promise = new cb.promise();
      let time = 0;
      let errArr = [];
      let resArr = [];
      for (let i = 0; i < newDeptArr.length; i++) {
        time += 1;
        setTimeout(function () {
          let data = [];
          let staff = newDeptArr[i];
          cb.rest.invokeFunction("GT34544AT7.staff.createStaff", { body: { data: staff } }, function (err, res) {
            if (res) {
              if (res.res.res.data) {
                resArr.push({ data: res.res.res.data });
              }
            }
            if (err) {
              errArr.push(err);
            }
          });
        }, 1000 * time);
      }
      setTimeout(
        function () {
          let returnData = { resArr: resArr, errArr: errArr };
          promise.resolve(returnData);
        },
        1000 * newDeptArr.length + 1000
      );
      return promise;
    };
    getID().then((deptIDArr) => {
      getxq(deptIDArr).then((newDeptArr) => {
        changeSysDeptID(newDeptArr).then((returnData) => {
          console.log("根据管理单位更新员工卡片兼职部门结果：", JSON.stringify(returnData));
        });
      });
    });
  });
viewModel.get("button229wh") &&
  viewModel.get("button229wh").on("click", function (data) {
    // 批量停用业务单元--单击
    let getID = () => {
      let promise = new cb.promise();
      cb.rest.invokeFunction("GT34544AT7.MyOrg.getAllSysDeptId", {}, function (err, res) {
        let deptIDArr = res.res;
        promise.resolve(deptIDArr);
      });
      return promise;
    };
    let getxq = (deptIDArr) => {
      let promise = new cb.promise();
      let newDeptArr = [];
      let time = 0;
      for (let i = 0; i < deptIDArr.length; i++) {
        time += 1;
        setTimeout(function () {
          let OrgCode = "D" + deptIDArr[i].OrgCode;
          cb.rest.invokeFunction("GT34544AT7.org.searchOrgByCode", { code: OrgCode }, function (err, res) {
            if (err) {
              console.log("err", JSON.stringify(err));
            }
            if (res) {
              newDeptArr.push(res.res.data[0]);
            }
          });
        }, 800 * time);
      }
      setTimeout(
        function () {
          promise.resolve(newDeptArr);
        },
        800 * deptIDArr.length + 2000
      );
      return promise;
    };
    let Update = (newDeptArr) => {
      let promise = new cb.promise();
      let time = 0;
      let errArr = [];
      let resArr = [];
      for (let i = 0; i < newDeptArr.length; i++) {
        time += 1;
        setTimeout(function () {
          let obj = {
            id: newDeptArr[i].id,
            enable: 2
          };
          let request = {};
          request.uri = "/yonbip/digitalModel/orgunit/stop";
          request.body = { data: obj };
          cb.rest.invokeFunction("GT34544AT7.org.newUptate", { request }, function (err, res) {
            if (res) {
              if (res.res.data) {
                resArr.push({ data: res.res.data });
              }
            } else {
              errArr.push(res);
            }
          });
        }, 1000 * time);
      }
      setTimeout(
        function () {
          let returnData = { resArr: resArr };
          promise.resolve(returnData);
        },
        1000 * newDeptArr.length + 1000
      );
      return promise;
    };
    getID().then((deptIDArr) => {
      getxq(deptIDArr).then((newDeptArr) => {
        Update(newDeptArr).then((returnData) => {
          console.log("停用业务单元结果：", JSON.stringify(returnData));
        });
      });
    });
  });
viewModel.get("button241gg") &&
  viewModel.get("button241gg").on("click", function (data) {
    // 批量删除业务单元--单击
    let getID = () => {
      let promise = new cb.promise();
      cb.rest.invokeFunction("GT34544AT7.MyOrg.getAllSysDeptId", {}, function (err, res) {
        let deptIDArr = res.res;
        promise.resolve(deptIDArr);
      });
      return promise;
    };
    let getxq = (deptIDArr) => {
      let promise = new cb.promise();
      let newDeptArr = [];
      let time = 0;
      for (let i = 0; i < deptIDArr.length; i++) {
        time += 1;
        setTimeout(function () {
          let OrgCode = "D" + deptIDArr[i].OrgCode;
          cb.rest.invokeFunction("GT34544AT7.org.searchOrgByCode", { code: OrgCode }, function (err, res) {
            if (err) {
              console.log("err", JSON.stringify(err));
            }
            if (res) {
              newDeptArr.push(res.res.data[0]);
            }
          });
        }, 800 * time);
      }
      setTimeout(
        function () {
          promise.resolve(newDeptArr);
        },
        800 * deptIDArr.length + 2000
      );
      return promise;
    };
    let Update = (newDeptArr) => {
      let promise = new cb.promise();
      let time = 0;
      let errArr = [];
      let resArr = [];
      for (let i = 0; i < newDeptArr.length; i++) {
        time += 1;
        setTimeout(function () {
          let obj = {
            id: newDeptArr[i].id
          };
          let request = {};
          let data = [];
          data.push(obj);
          request.uri = "/yonbip/digitalModel/delete";
          request.body = { data: data };
          cb.rest.invokeFunction("GT34544AT7.org.newUptate", { request }, function (err, res) {
            if (res) {
              if (res.res.data) {
                resArr.push({ data: res.res.data });
              }
            } else {
              errArr.push(res);
            }
          });
        }, 1000 * time);
      }
      setTimeout(
        function () {
          let returnData = { resArr: resArr };
          promise.resolve(returnData);
        },
        1000 * newDeptArr.length + 1000
      );
      return promise;
    };
    getID().then((deptIDArr) => {
      getxq(deptIDArr).then((newDeptArr) => {
        Update(newDeptArr).then((returnData) => {
          console.log("删除业务单元结果：", JSON.stringify(returnData));
        });
      });
    });
  });
viewModel.get("button249ih") &&
  viewModel.get("button249ih").on("click", function (data) {
    // 用户计费角色数--单击
    cb.rest.invokeFunction("GT3AT33.role.chargeNumber", "1659318197854666755", function (err, res) {
      console.log("err", err);
      console.log("res", res);
    });
  });