viewModel.on("customInit", function (data) {
  // 测试-会员详情--页面初始化
  viewModel.get("btnSave") &&
    viewModel.get("btnSave").on("beforeclick", function () {
      const data = viewModel.getAllData();
      let code = data.code;
      let name = data.name;
      let phone = data.phone;
      debugger;
      console.log("-----客开代码-------");
      console.log(data);
      var proxy2 = cb.rest.DynamicProxy.create({
        ensure: {
          url: "https://www.example.com/",
          method: "GET",
          options: {
            domainKey: "uhy",
            async: false
          }
        }
      });
      proxy2.ensure(params, function (err, result) {
        console.log(err);
      });
      var dataObj = {
        iMemberProperty: "1",
        cCountryCode: "86",
        cPhone: phone,
        cRealName: name,
        iBirthdayType: "0",
        iSourceType: 0,
        memberattach: [
          {
            hasDefaultInit: true,
            _id: "youridHere",
            bCorporateMember: false,
            _status: "Insert"
          }
        ],
        _status: "Insert",
        dRegisterDate: "2023-02-22",
        dRegisterTime: 1676995200,
        dReceiveDate: "2023-02-22",
        dReceiveTime: 1676995200,
        bStorageExemptPwd: 0,
        cUserName: phone
      };
      var proxy = cb.rest.DynamicProxy.create({
        ensure: {
          url: "/bill/save?terminalType=1&serviceCode=SDMB020101",
          method: "POST",
          options: {
            domainKey: "uhy",
            async: false
          }
        }
      });
      var param = {
        billnum: "mm_memberinput",
        data: JSON.stringify(dataObj)
      };
      var _res = proxy.ensure(param);
      console.log("-----客开代码1-------");
      console.log(_res);
      console.log("-----客开代码2-------");
    });
});