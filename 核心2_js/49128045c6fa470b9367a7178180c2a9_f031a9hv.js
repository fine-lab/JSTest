viewModel.get("businessprofile_name") &&
  viewModel.get("businessprofile_name").on("afterValueChange", function (data) {
    // 规则档案--值改变后
    let merchantApplyRangeId = viewModel.get("merchantApplyRangeId").getValue();
    let pricing_policyInfo = viewModel.get("pricing_policy").getValue();
    if (merchantApplyRangeId == undefined || pricing_policyInfo == undefined) {
      cb.utils.alert("请选择对应经销商，价格政策不能为空！", "error");
      viewModel.get("businessprofile_name").setValue(null);
      viewModel.get("businessprofile").setValue(null);
      return;
    }
    const storeprofilelist = viewModel.getGridModel("storeprofile_bList");
    let specialid = data.value.id;
    let specialcode = data.value.code;
    cb.rest.invokeFunction("GT80750AT4.specialProduct.querySpecial", { specialid: specialid }, function (err, res) {
      let result = res.result;
      debugger;
      if (result !== undefined) {
        storeprofilelist.deleteAllRows();
        for (var i = 0; i < result.length; i++) {
          let pricing_policy = result[i].pricing_policy;
          if (pricing_policy != undefined && pricing_policy != "" && pricing_policy === pricing_policyInfo) {
            storeprofilelist.appendRow({
              product_name_name: result[i].productname,
              product_name: result[i].product_id,
              usenum: 0,
              leftnum: result[i].num,
              specilnum: result[i].num
            });
          }
        }
      }
      console.log(res);
    });
  });
viewModel.get("distributor_name") &&
  viewModel.get("distributor_name").on("afterValueChange", function (data) {
    //所属分销商--值改变后
    if (data.value == null || data.value == "undefined") {
      return;
    }
    let _this = viewModel;
    let distributor = viewModel.get("distributor").getValue();
    let merchantApplyRangeId = viewModel.get("merchantApplyRangeId").getValue();
    let hostUrl = parent.document.location.origin;
    let url =
      hostUrl +
      `/mdf-node/uniform/bill/detail?terminalType=1&serviceCode=aa_merchant&billnum=aa_merchant&pageDetail=true&isCreator=false&isApplied=true&id=${distributor}&merchantApplyRangeId=${merchantApplyRangeId}`;
    let proxy = cb.rest.DynamicProxy.create({
      ensure: {
        url,
        method: "post",
        mask: true
      }
    });
    let options = {
      requestHeaders: { "domain-key": "productcenter" }
    };
    proxy.ensure(options, function (err, result) {
      if (err) {
        cb.utils.alert(err.message, "error");
        return;
      }
      if (result) {
        let customerSonName = result["customerDefine!customerDefine3"];
        if (customerSonName) {
          let url = hostUrl + `/mdf-node/uniform/bill/list?serviceCode=aa_merchant&locale=zh_CN&terminalType=1`;
          var proxy = cb.rest.DynamicProxy.create({
            ensure: {
              url: url,
              method: "POST",
              options: { async: false, domainKey: "yourKeyHere" }
            }
          });
          var params = {
            page: {
              pageSize: 20,
              pageIndex: 1,
              totalCount: 1
            },
            billnum: "aa_merchantlist",
            condition: {
              commonVOs: [
                {
                  itemName: "schemeName",
                  value1: "启用的客户"
                },
                {
                  itemName: "isDefault",
                  value1: true
                },
                {
                  value1: customerSonName,
                  itemName: "customerDefine.customerDefine3"
                }
              ],
              filtersId: "yourIdHere",
              solutionId: 1002191491
            },
            bClick: true,
            bEmptyWithoutFilterTree: false,
            serviceCode: "aa_merchant",
            locale: "zh_CN",
            ownDomain: "productcenter"
          };
          let myres = proxy.ensure(params, function (err, result) {});
          if (myres) {
            if (myres.result.recordList) {
              myres.result.recordList.forEach((data) => {
                let customerType = data["merchantAppliedDetail!customerType"];
                let customerType_Name = data["merchantAppliedDetail!customerType_Name"];
                if (customerType) {
                  viewModel.get("pricing_policy").setValue(customerType);
                  viewModel.get("pricing_policy_name").setValue(customerType_Name);
                  viewModel.get("pricing_policy_ref_name").setValue(customerType_Name);
                }
              });
            }
          }
        }
      }
    });
  });