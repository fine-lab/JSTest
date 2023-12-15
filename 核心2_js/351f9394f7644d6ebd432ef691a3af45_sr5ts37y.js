viewModel.get("button75pd") &&
  viewModel.get("button75pd").on("click", function (data) {
    // 生成销售发票--单击
    if (viewModel.get("verifystate").getValue() != 2) {
      cb.utils.alert("请先审核再进行生成发票");
      return;
    }
    var gridAllData = viewModel.getGridModel().getAllData();
    //子表集合
    var bpmTaskActions = [];
    var m = new HashMap();
    for (let i = 0; i < gridAllData.length; i++) {
      f1(i);
    }
    cb.utils.alert("任务处理中请稍候");
    for (let j = 0; j < m.keySet().length; j++) {
      const arrays = m.get(m.keySet()[j]);
      for (const row of arrays) {
        var detail = {
          sourceid: m.keySet()[j],
          sourceautoid: row.split("+")[1],
          memo: viewModel.get("code").getValue() + "/" + gridAllData[row.split("+")[0]].fapiaohaoma + "/" + gridAllData[row.split("+")[0]].shijikaipiaoriqi,
          _status: "Insert"
        };
        bpmTaskActions.push(detail);
      }
      let body = {
        data: {
          resubmitCheckKey: new Date().valueOf(),
          transactionTypeId: "yourIdHere",
          vouchdate: new Date().format("yyyy-MM-dd hh:mm:ss"),
          invoiceAsynTaxMark: true,
          isNotSendTax: false,
          modifyInvoiceType: true,
          saleInvoiceDetails: bpmTaskActions,
          _status: "Insert"
        }
      };
      //拿销售出货单数据调用销售发票生成接口，生成发票
      saveForSale(body);
      //清空子表集合
      bpmTaskActions = [];
    }
    function f1(i) {
      if (m.containsKey(gridAllData[i].chukuId)) {
        gridAllData[i].chukuId;
        gridAllData[i].detaisId;
        let array = m.get(gridAllData[i].chukuId);
        m.put(gridAllData[i].chukuId, array.add(i + "+" + gridAllData[i].detaisId));
      } else {
        m.put(gridAllData[i].chukuId, new Set([i + "+" + gridAllData[i].detaisId]));
      }
    }
    //拿销售出货单数据调用销售发票生成接口，生成发票
    function saveForSale(body) {
      cb.rest.invokeFunction(
        "AT1665917408780003.openApi.saveForSalesOut",
        {
          body: body
        },
        function (err, res) {
          if (err) {
            cb.utils.alert(err);
          } else if (res) {
            var temp = JSON.parse(res.apiResponse);
            cb.utils.alert(temp);
          }
        }
      );
    }
    function HashMap() {
      //定义长度
      var length = 0;
      //创建一个对象
      var obj = new Object();
      this.isEmpty = function () {
        return length == 0;
      };
      this.containsKey = function (key) {
        return key in obj;
      };
      this.containsValue = function (value) {
        for (var key in obj) {
          if (obj[key] == value) {
            return true;
          }
        }
        return false;
      };
      this.put = function (key, value) {
        if (!this.containsKey(key)) {
          length++;
        }
        obj[key] = value;
      };
      this.get = function (key) {
        return this.containsKey(key) ? obj[key] : null;
      };
      this.remove = function (key) {
        if (this.containsKey(key) && delete obj[key]) {
          length--;
        }
      };
      this.values = function () {
        var _values = new Array();
        for (var key in obj) {
          _values.push(obj[key]);
        }
        return _values;
      };
      this.keySet = function () {
        var _keys = new Array();
        for (var key in obj) {
          _keys.push(key);
        }
        return _keys;
      };
      this.size = function () {
        return length;
      };
      this.clear = function () {
        length = 0;
        obj = new Object();
      };
    }
    //按格式获取当前时间
    function timestampToTime(times) {
      let time = times[1];
      let mdy = times[0];
      mdy = mdy.split("/");
      let month = parseInt(mdy[0]);
      let day = parseInt(mdy[1]);
      let year = parseInt(mdy[2]);
      return year + "-" + month + "-" + day + " " + time;
    }
  });