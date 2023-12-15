viewModel.on("customInit", function (data) {
  //银行交易明细--页面初始化
  viewModel.on("beforeBatchaudit", (data) => {
    //待审核数组
    let beforedata = JSON.parse(data.data.data);
    let indexs = viewModel.getGridModel().getSelectedRowIndexes(); //获取当前页已选中行的行号
    //审核前校验待审核数据是否大于1条，并将待审核数据按照账号分组，校验其账号是否有已审核的余额表记录。
    //将校验后的数据存入缓存
    if (beforedata.length > 1) {
      //对银行账号是否全部都已经有初始化余额进行校验
      //银行账号数组
      let BankAccount_nos = [
        ...new Set(
          beforedata.map((item, index) => {
            return item.BankAccount_no;
          })
        )
      ];
      let result = cb.rest.invokeFunction("AT1833A66C08480009.BankAccBalance.InitializeOrNot", { BankAccount_nos: BankAccount_nos }, function (err, res) {}, viewModel, { async: false });
      //未初始化余额的账号
      let noInitialize = result.result.noInitialize;
      console.log("noInitialize", JSON.stringify(noInitialize));
      if (noInitialize.length > 0) {
        //取消勾选对应流水
        //需要取消勾选的行号
        let rowIndexes = [];
        for (let j = 0; j < beforedata.length; j++) {
          if (noInitialize.indexOf(beforedata[j].BankAccount_no) > -1) {
            rowIndexes.push(indexs[j]);
          }
        }
        if (rowIndexes.length > 0) {
          viewModel.getGridModel().unselect(rowIndexes); //取消勾选
          cb.utils.alert("您选中的数据中\n存在账号未初始化余额\n已为您取消勾选相关的流水\n请重新进行审核操作", "info");
          return false; //终止审核操作
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          //删除待审核数组中已审核的数据
          if (data[i].verifystate == 2) {
            beforedata.splice(i, 1);
          }
        }
        cb.cache.set("beforedata", beforedata); //将处理后的数据存入缓存
      }
    } else if ((beforedata.length = 1)) {
      let BankAccount_nos = [];
      BankAccount_nos.push(beforedata[0].BankAccount_no);
      let result = cb.rest.invokeFunction("AT1833A66C08480009.BankAccBalance.InitializeOrNot", { BankAccount_nos: BankAccount_nos }, function (err, res) {}, viewModel, { async: false });
      //未初始化余额的账号
      let noInitialize = result.result.noInitialize;
      if (noInitialize.length > 0) {
        cb.utils.alert("该流水的账号未初始化余额\n请为账号初始化余额后重新进行审核操作", "info");
        return false; //终止审核操作
      } else {
        for (let i = 0; i < data.length; i++) {
          //删除待审核数组中已审核的数据
          if (data[i].verifystate == 0) {
            beforedata.splice(i, 1);
          }
        }
        cb.cache.set("beforedata", beforedata); //将处理后的数据存入缓存
      }
    }
  });
  viewModel.on("afterBatchaudit", (data) => {
    //批量审批结束后，从缓存拿到本次审批的数据
    let beforedata = cb.cache.get("beforedata");
    if (beforedata !== undefined) {
      //有数据
      for (let i = 0; i < beforedata.length; i++) {
        if (beforedata[i].verifystate == 0) {
          let org_id = beforedata[i].org_id;
          let tran_amt_debit = beforedata[i].tran_amt_debit; //本条目借方金额
          //通过 org_id 从缓存拿到该组织对应的预警策略
          let earlyWarning = cb.cache.get(org_id);
          if (earlyWarning == undefined) {
            //缓存没有策略  --->     查询
            let result = cb.rest.invokeFunction("AT1833A66C08480009.PaymentAlertStrategy.YJCNandCSR", { org_id: org_id }, function (err, res) {}, viewModel, { async: false });
            earlyWarning = result.result.earlyWarning;
            if (earlyWarning.length == 0) {
              //说明没有设置策略，那这个对应的条目就不进行预警
            } else {
              //要进行预警
              //将这个条目的预警策略放入缓存
              cb.cache.set(org_id, earlyWarning);
              //遍历预警策略，可能不止一个组织在关注本条目的情况，一个组织可能存在多条预警策略
              for (let j = 0; j < earlyWarning.length; j++) {
                let SingleAmount = earlyWarning[j].SingleAmount; //策略的单笔额度
                //单笔预警
                if (tran_amt_debit >= SingleAmount && SingleAmount > 0) {
                  //需要预警
                  earlyWarning[j].tran_amt_debit = tran_amt_debit;
                  //企业银行账户
                  earlyWarning[j].BankAccount_name = beforedata[i].BankAccount_name;
                  //组织名称
                  earlyWarning[j].org_id_name = beforedata[i].org_id_name;
                  //对方户名
                  earlyWarning[j].to_acctName = beforedata[i].to_acctName;
                  //对方账号
                  earlyWarning[j].to_acct_no = beforedata[i].to_acct_no;
                  //账号
                  earlyWarning[j].BankAccount_no = beforedata[i].BankAccount_no;
                  //摘要
                  earlyWarning[j].remark = beforedata[i].remark;
                  //备注
                  earlyWarning[j].notes = beforedata[i].notes;
                  //交易时间
                  earlyWarning[j].tranTime = beforedata[i].tranTime;
                  //将预警策略和本条目金额发送到预警接口
                  result = cb.rest.invokeFunction("AT1833A66C08480009.PaymentAlertStrategy.Single", { earlyWarning: earlyWarning[j] }, function (err, res) {}, viewModel, { async: false });
                  console.log("result", result);
                }
              }
            }
          } else {
            for (let j = 0; j < earlyWarning.length; j++) {
              let SingleAmount = earlyWarning[j].SingleAmount; //策略的单笔额度
              if (tran_amt_debit >= SingleAmount) {
                //需要预警
                earlyWarning[j].tran_amt_debit = tran_amt_debit;
                //企业银行账户
                earlyWarning[j].BankAccount_name = beforedata[i].BankAccount_name;
                //组织名称
                earlyWarning[j].org_id_name = beforedata[i].org_id_name;
                //对方户名
                earlyWarning[j].to_acctName = beforedata[i].to_acctName;
                //对方账号
                earlyWarning[j].to_acct_no = beforedata[i].to_acct_no;
                //账号
                earlyWarning[j].BankAccount_no = beforedata[i].BankAccount_no;
                //摘要
                earlyWarning[j].remark = beforedata[i].remark;
                //备注
                earlyWarning[j].notes = beforedata[i].notes;
                //交易时间
                earlyWarning[j].tranTime = beforedata[i].tranTime;
                //将预警策略和本条目金额发送到预警接口
                result = cb.rest.invokeFunction("AT1833A66C08480009.PaymentAlertStrategy.Single", { earlyWarning: earlyWarning[j] }, function (err, res) {}, viewModel, { async: false });
                console.log("result", result);
              }
            }
          }
        }
        let tranDate = beforedata[i].tranDate; //交易日期
        let y = tranDate.substring(0, 4);
        let m = tranDate.substring(5, 7);
        let d = tranDate.substring(8, 10);
        let week = getWeekNumber(y, m, d);
        console.log(tranDate + "是" + y + "年第" + week + "周");
      }
      cb.cache.clear("beforedata");
    }
    //更新余额相关脚本
    if (beforedata !== undefined) {
      //按照账号分组后的结果
      var afterGroupBy = GroupBy(beforedata, ["BankAccount_no"]);
      console.log("afterGroupBy", afterGroupBy);
      //计算分组后每个账号的收支合计
      if (afterGroupBy.length > 0) {
        let aftersumarr = []; //计算每个账号收支合计后的对象数组
        for (let i = 0; i < afterGroupBy.length; i++) {
          let aftersumobj = {}; //计算每个账号收支合计后的结果对象
          let sum = 0; //收支合计
          let BankAccount_no = afterGroupBy[i].key.BankAccount_no; //这一组数据对应的账号
          let dataarr = afterGroupBy[i].data; //这一组数据
          let sumsumTran_amt_debit = 0;
          let sumsumTran_amt_credit = 0;
          for (let j = 0; j < dataarr.length; j++) {
            let tran_amt_credit = dataarr[j].tran_amt_credit; //贷方金额
            let tran_amt_debit = dataarr[j].tran_amt_debit; //借方金额
            sumsumTran_amt_debit = add(sumsumTran_amt_debit, tran_amt_debit);
            sumsumTran_amt_credit = add(sumsumTran_amt_credit, tran_amt_credit);
          }
          aftersumobj.BankAccount_no = BankAccount_no;
          aftersumobj.sum = add(-sumsumTran_amt_debit, sumsumTran_amt_credit);
          let dates = ReverseRankingDate(dataarr, "tranTime");
          aftersumobj.tranTime = dates[0].tranTime;
          aftersumobj.sumsumTran_amt_debit = sumsumTran_amt_debit;
          aftersumobj.sumsumTran_amt_credit = sumsumTran_amt_credit;
          aftersumarr.push(aftersumobj);
        }
        let result = cb.rest.invokeFunction("AT1833A66C08480009.BankAccBalance.updateBalance", { aftersumarr: aftersumarr }, function (err, res) {}, viewModel, { async: false });
        if (result.error !== undefined) {
          cb.utils.alert("审核成功但是更新余额失败！\n请联系开发人员！\nmessage：" + result.error.message, "error");
        }
        console.log("result", result);
      }
    }
  });
  viewModel.on("afterMount", function () {
    //查询区相关脚本
    let filterViewModelInfo = viewModel.getCache("FilterViewModel");
    filterViewModelInfo.on("afterInit", function (data) {
      let filterModelInfo = filterViewModelInfo.get("BankAccount");
      let realModelInfo = filterModelInfo.getFromModel();
      //企业银行账户参照打开前事件
      realModelInfo.on("beforeBrowse", function () {
        //赋予查询区字段初始值
        let org_ids = filterViewModelInfo.get("org_id").getFromModel().getValue();
        if (org_ids !== undefined && org_ids !== null) {
          var myFilter = { isExtend: true, simpleVOs: [] };
          myFilter.simpleVOs.push({
            field: "orgid",
            op: "in",
            value1: org_ids
          });
          realModelInfo.setFilter(myFilter);
        } else {
          cb.utils.alert("请先选择组织！", "info");
          return false;
        }
      });
      //组织值改变后清空账户信息
      let filterModelInfo_org_id = filterViewModelInfo.get("org_id");
      let realModelInfo_org_id = filterModelInfo_org_id.getFromModel();
      realModelInfo_org_id.on("afterValueChange", function (data) {
        filterViewModelInfo.get("BankAccount").getFromModel().clear();
        filterViewModelInfo.get("BankAccount_no").getFromModel().clear();
      });
      let BankAccount = filterViewModelInfo.get("BankAccount");
      let realModelInfo_BankAccount = BankAccount.getFromModel();
      realModelInfo_BankAccount.on("afterValueChange", function (data) {
        filterViewModelInfo.get("BankAccount_no").getFromModel().clear();
      });
    });
  });
  //精确计算加法
  function add(arg1, arg2) {
    (arg1 = arg1.toString()), (arg2 = arg2.toString()); // 将传入的数据转化为字符串
    var arg1Arr = arg1.split("."), // 将小数的数据从小数点的位置拆开
      arg2Arr = arg2.split("."),
      d1 = arg1Arr.length == 2 ? arg1Arr[1] : "", // 获取第一个数的小数点的长度
      d2 = arg2Arr.length == 2 ? arg2Arr[1] : ""; // 获取第二个数的小数点的长度
    var maxLen = Math.max(d1.length, d2.length); // 获取小数点长度较大的值
    var m = Math.pow(10, maxLen); // 这里表示10的小数点长度次方 也就是说如果小数点长度为2 m的值就是100 如果小数点长度是3 m的值就是1000如果不懂请自行查找api
    var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen)); // 将小数转化为整数后相加在除掉两个数乘过的倍数然后去小数点较长的长度的小数位数
    var d = arguments[2]; // 第三个参数用户可以自行决定是否要传递 用来定义要保留的小数长度
    return typeof d === "number" ? Number(result.toFixed(d)) : result;
  }
  //分组
  function GroupBy(datas, keys, callBack) {
    const list = datas || [];
    const groups = [];
    list.forEach((v) => {
      const key = {};
      const data = {};
      keys.forEach((k) => {
        key[k] = v[k];
      });
      let group = groups.find((v) => {
        return v._key === JSON.stringify(key);
      });
      if (!group) {
        group = {
          _key: JSON.stringify(key),
          key: key
        };
        groups.push(group);
      }
      group.data = group.data || [];
      group.data.push(v);
    });
    return groups;
  }
  //时间降序
  function ReverseRankingDate(data, p) {
    for (i = 0; i < data.length - 1; i++) {
      for (j = 0; j < data.length - 1 - i; j++) {
        if (Date.parse(data[j][p]) < Date.parse(data[j + 1][p])) {
          var temp = data[j];
          data[j] = data[j + 1];
          data[j + 1] = temp;
        }
      }
    }
    return data;
  }
  function getWeekNumber(y, m, d) {
    var targetDay = new Date(y, m - 1, d);
    var year = targetDay.getFullYear();
    var month = targetDay.getMonth();
    var days = targetDay.getDate();
    //那一天是那一年中的第多少天
    for (var i = 1; i < m; i++) {
      days += getMonthDays(year, i);
    }
    //那一年第一天是星期几
    var yearFirstDay = new Date(year, 0, 1).getDay();
    //计算是第几周
    days += yearFirstDay;
    var week = Math.ceil(days / 7);
    return week;
  }
  function isLeapYear(year) {
    return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
  }
  function getMonthDays(year, month) {
    return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  }
});