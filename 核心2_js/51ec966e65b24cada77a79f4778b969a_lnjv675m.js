viewModel.get("button2ne") &&
  viewModel.get("button2ne").on("click", function (data) {
    //同步业务单元到自建表--单击
    //获取所有的系统组织和部门
    let getList = () => {
      let promise = new cb.promise();
      cb.rest.invokeFunction("GT34544AT7.org.seleceAllOrg", {}, function (err, res) {
        let list = res.res;
        let newList = [];
        for (let i = 0; i < list.length; i++) {
          let obj = list[i];
          if (obj.orgtype === 1 && obj.isbizunit === 1 && obj.enable === 1) {
            //过滤掉部门，只要业务单元
            newList.push(obj);
          }
        }
        list = newList;
        promise.resolve(list);
      });
      return promise;
    };
    let getxq = (list) => {
      let promise = new cb.promise();
      let neworgArr = [];
      let time = 0;
      for (let i = 0; i < list.length; i++) {
        time += 1;
        setTimeout(function () {
          cb.rest.invokeFunction("GT34544AT7.org.orgSearch", { id: list[i].id }, function (err, res) {
            if (err) {
              console.log("err", JSON.stringify(err));
            }
            if (res) {
              neworgArr.push(res.res.res.data);
            }
          });
        }, 800 * time);
      }
      setTimeout(
        function () {
          console.log("neworgArr", JSON.stringify(neworgArr));
          promise.resolve(neworgArr);
        },
        800 * list.length + 2000
      );
      return promise;
    };
    let batchSave = (neworgArr) => {
      let promise = new cb.promise();
      let time = 0;
      for (let i = 0; i < neworgArr.length; i++) {
        let obj = {};
        let data = neworgArr[i];
        obj.code = data.code;
        obj.sysparent = data.parent;
        obj.sysOrg = data.id;
        if (data.financeOrg !== undefined && data.financeOrg.enable === 1) {
          obj.financeOrg = 1;
        } else {
          obj.financeOrg = 0;
        }
        if (data.salesOrg !== undefined && data.salesOrg.enable === 1) {
          obj.salesOrg = 1;
        } else {
          obj.salesOrg = 0;
        }
        if (data.purchaseOrg !== undefined && data.purchaseOrg.enable === 1) {
          obj.purchaseOrg = 1;
        } else {
          obj.purchaseOrg = 0;
        }
        if (data.inventoryOrg !== undefined && data.inventoryOrg.enable === 1) {
          obj.inventoryOrg = 1;
        } else {
          obj.inventoryOrg = 0;
        }
        if (data.adminOrg !== undefined && data.adminOrg.enable === 1) {
          obj.adminOrg = 1;
        } else {
          obj.adminOrg = 0;
        }
        time += 1;
        setTimeout(function () {
          cb.rest.invokeFunction("GT3AT33.sysOrg.batchSave", { data: obj }, function (err, res) {
            if (err) {
              console.log("err", JSON.stringify(err));
            }
            if (res) {
              console.log("保存成功：", JSON.stringify(res.res));
            }
          });
        }, 300 * time);
      }
      setTimeout(
        function () {
          promise.resolve();
        },
        300 * neworgArr.length + 2000
      );
      return promise;
    };
    getList().then((list) => {
      getxq(list).then((neworgArr) => {
        batchSave(neworgArr).then(() => {
        });
      });
    });
  });
viewModel.get("button4fj") &&
  viewModel.get("button4fj").on("click", function (data) {
    // 设置组织管理期初--单击
    let getList = () => {
      let promise = new cb.promise();
      cb.rest.invokeFunction("GT3AT33.sysOrg.selectAll", {}, function (err, res) {
        let list = res.res;
        promise.resolve(list);
      });
      return promise;
    };
    //封装的业务函数
    let apipost = (params, reqParams, options, action) => {
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
    };
    let selectPeriod = (list) => {
      let promise = new cb.promise();
      let neworgArr = [];
      let time = 0;
      for (let i = 0; i < list.length; i++) {
        time += 1;
        setTimeout(function () {
          let action = "https://www.example.com/";
          let params = {
            terminalType: 1
          };
          let vbody = {
            billnum: "org_bpConflist",
            data: { itemName: "orgid", ownDomain: "ucf-org-center", page: { pageSize: 10000, pageIndex: 1, totalCount: 1 }, serviceCode: "GZTORG001", value1: list[i].sysOrg },
            externalData: { orgid: list[i].sysOrg }
          };
          let options = {
            domainKey: "yourKeyHere"
          };
          apipost(params, vbody, options, action).then((res, err) => {
            res.listID = list[i].id;
            neworgArr.push(res);
          });
        }, 500 * time);
      }
      setTimeout(
        function () {
          console.log("neworgArr", JSON.stringify(neworgArr));
          promise.resolve(neworgArr, list);
        },
        500 * list.length + 2000
      );
      return promise;
    };
    let update = (neworgArr) => {
      let promise = new cb.promise();
      let ress = [];
      let time = 0;
      for (let i = 0; i < neworgArr.length; i++) {
        time += 1;
        let arr = neworgArr[i].recordList;
        let data = { id: neworgArr[i].listID };
        for (let j = 0; j < arr.length; j++) {
          if (arr[j].id.length !== 3) {
            switch (arr[j].type_code) {
              case "generalLedger":
                data.generalLedger = arr[j].periodid;
                break;
              case "assets":
                data.assets = arr[j].periodid;
                break;
              case "receivables":
                data.receivables = arr[j].periodid;
                break;
              case "inventory":
                data.inventory = arr[j].periodid;
                break;
              case "pay":
                data.pay = arr[j].periodid;
                break;
              case "cashManagement":
                data.cashManagement = arr[j].periodid;
                break;
              case "stock":
                data.stock = arr[j].periodid;
            }
          }
        }
        setTimeout(function () {
          cb.rest.invokeFunction("GT3AT33.sysOrg.Update", { data }, function (err, res) {
            if (err) {
              console.log("err", JSON.stringify(err));
            }
            if (res) {
              ress.push(res.res);
            }
          });
        }, 300 * time);
      }
      setTimeout(
        function () {
          promise.resolve(ress);
        },
        300 * neworgArr.length + 2000
      );
      return promise;
    };
    getList().then((list) => {
      selectPeriod(list).then((neworgArr) => {
        update(neworgArr).then((ress) => {
          console.log("ress", JSON.stringify(ress));
        });
      });
    });
  });