viewModel.get("button17ub") &&
  viewModel.get("button17ub").on("click", async function (args) {
    // 执行--单击
    var gridModel = viewModel.getGridModel();
    // 获取本行数据
    const rowData = gridModel.getRow(args.index);
    if (rowData.status == "1") {
      cb.utils.alert("该条记录已全部执行成功", "waring");
      return;
    }
    if (rowData.status == "4") {
      cb.utils.alert("该条记录正在执行", "waring");
      return;
    }
    function Loading() {
      var hook = React.useState(true);
      stop = hook[1];
      return React.createElement(TinperNext.Spin, { spinning: hook[0] });
    }
    cb.utils.alert("执行中，请勿刷新浏览器", "info");
    //开启进度条
    ReactDOM.render(React.createElement(Loading), document.createElement("div"));
    // 更新本行数据
    await proxyUpdateRow({
      id: rowData.id,
      status: "4", // "1" 全部执行成功  "2" 执行失败  "3" 未执行 "4"执行中 "5" 部分执行成功
      msg: "",
      execute_time: formatDate(new Date())
    });
    gridModel.setCellValue(args.index, "status", "4");
    // 读取txt文件内容
    function readTxtFile(fileId, access_token) {
      return new Promise((resolve, reject) => {
        let proxy1 = viewModel.setProxy({
          queryData: {
            url: `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/iuap-yonbuilder-runtime+mdf/${fileId}/files?authId=&pageSize=10000&groupId=&columnId=&pageNo=1&isGroupIncludeChild=false&fileName=`,
            method: "GET"
          }
        });
        const result1 = proxy1.queryDataSync();
        const resultId = result1.data[0]["id"];
        let proxy2 = viewModel.setProxy({
          queryData: {
            url: `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/${resultId}/getDownloadUrlWithFileId?authId=`,
            method: "GET"
          }
        });
        const result2 = proxy2.queryDataSync();
        const file1Url = result2.result.result;
        if (!file1Url) {
          reject("获取文件路径失败");
        }
        const suffix = file1Url.substring(file1Url.length - 3);
        if (suffix !== "txt") {
          reject("请上传txt格式的文件");
        }
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("get", file1Url, true);
        xmlHttp.setRequestHeader("Content-Type", "text/plain");
        xmlHttp.send();
        xmlHttp.onreadystatechange = doResult;
        function doResult() {
          if (xmlHttp.readyState == 4) {
            resolve(xmlHttp.responseText);
          }
        }
      });
    }
    // 获取E102文件中总金额
    function getE102FileAmount(colList) {
      return new Promise((resolve, reject) => {
        if (!colList || !colList.length) {
          reject("读取E102文档失败");
        }
        colList.pop(); //删除末尾
        let lastRow = colList[colList.length - 1];
        let amountStr = lastRow[lastRow.length - 1];
        let amount = parseFloat(amountStr.replace("\r"));
        return resolve(amount);
      });
    }
    //格式化时间
    function formatDate(dat) {
      //获取年月日，时间
      var year = dat.getFullYear();
      var mon = dat.getMonth() + 1 < 10 ? "0" + (dat.getMonth() + 1) : dat.getMonth() + 1;
      var data = dat.getDate() < 10 ? "0" + dat.getDate() : dat.getDate();
      var hour = dat.getHours() < 10 ? "0" + dat.getHours() : dat.getHours();
      var min = dat.getMinutes() < 10 ? "0" + dat.getMinutes() : dat.getMinutes();
      var seon = dat.getSeconds() < 10 ? "0" + dat.getSeconds() : dat.getSeconds();
      var newDate = year + "-" + mon + "-" + data + " " + hour + ":" + min + ":" + seon;
      return newDate;
    }
    // 获取access_token
    function queryAccessToken() {
      return new Promise((resolve, reject) => {
        cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/AT165FE49C09000006/getAccessToken?domainKey=developplatform"], function (a) {
          const tokenParams = a.getAccessToken();
          let access_token = "";
          const fatchAccessToken = viewModel.setProxy({
            queryData: tokenParams
          });
          const access_token_result = fatchAccessToken.queryDataSync();
          if ("00000" == access_token_result.error.code) {
            access_token = access_token_result.error.data.access_token;
            resolve(access_token);
          } else {
            reject("获取access_token失败");
          }
        });
      });
    }
    // 更新某行数据
    function proxyUpdateRow(row) {
      return new Promise((resolve, reject) => {
        cb.rest.invokeFunction(
          "AT165FE49C09000006.frontDesignerFunction.updateRecord",
          {
            id: row.id,
            status: row.status,
            msg: row.msg,
            execute_time: row.execute_time,
            _status: "Update"
          },
          function (err, res) {
            if (err) {
              reject(err || "更新行数据失败");
            }
            if (res && res.obj) {
              resolve(res.obj);
            } else {
              reject("更新行数据失败");
            }
          }
        );
      });
    }
    // 是否是收款单
    function isReceiveBill(trxCode) {
      return ["9000", "90711", "92701", "92708", "92709", "92710", "92711"].includes(trxCode);
    }
    // 获取随机唯一字符串
    function getRandom() {
      return new Promise((resolve, reject) => {
        cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/AT165FE49C09000006/randomStr?domainKey=developplatform"], function (a) {
          const str = `NO${a.random(15)}`;
          resolve(str);
        });
      });
    }
    function needCommission(trxCode) {
      return ["93701", "93702", "93710", "93709", "93708", "93711"].includes(trxCode);
    }
    try {
      // 获取access_token
      const access_token = await queryAccessToken();
      // 读取txt2文件内容
      // 读取txt1文件内容
      const file1Content = await readTxtFile(rowData.file1, access_token);
      let rList = file1Content.split("\n");
      let colList = rList.map((str) => str.split("\t"));
      console.log("colList:", colList);
      let recordList = [];
      colList.shift(); // 删除表头
      colList.pop(); // 删除末尾
      const lastRow = colList[colList.length - 1];
      const readE102Res = lastRow ? lastRow[39] : 0; // 取索引为39列的金额【CF_BALANCE_TODAY】
      colList = colList.filter((v) => v[1] === "PAYMENT");
      for (let col of colList) {
        if (col.length === 30) {
          recordList.push(col);
        } else {
          break;
        }
      }
      const monthMap = {
        JAN: "01",
        FEB: "02",
        MAR: "03",
        APR: "04",
        MAY: "05",
        JUN: "06",
        JUL: "07",
        AUG: "08",
        SEPT: "09",
        OCT: "10",
        NOV: "11",
        DEC: "12"
      };
      const custCodeMap = {
        // 收款单
        90711: "0207",
        92701: "0208",
        92708: "0208",
        92709: "0209",
        92710: "0210",
        92711: "0211",
        // 应收事项
        94701: "0208",
        94710: "0210",
        94709: "0209",
        94708: "0208",
        90300: "0207",
        94711: "0211",
        94703: "0208",
        90715: "0208",
        93702: "0212",
        93710: "0210",
        93709: "0209",
        93708: "0208",
        93711: "0213",
        90709: "0208",
        92703: "0208",
        94702: "0208",
        92702: "0208",
        93701: "0212",
        // 以下不取值，过滤使用
        90000: "0000",
        90708: "0000",
        90707: "0000",
        90360: "0215",
        92000: "0214",
        92712: "0215"
      };
      // 生成请求参数
      // 收款单参数
      let receiveBillData = [];
      // 应收事项参数
      let oarBillData = [];
      let currentVouchDate = "";
      let auditDate = formatDate(new Date());
      for (let row of recordList) {
        // 获取随机唯一字符串
        const code = await getRandom();
        // 处理单据日期
        let dateArr = row[9].split("-");
        dateArr[1] = monthMap[dateArr[1]];
        const vouchdate = `20${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
        if (!currentVouchDate) {
          currentVouchDate = vouchdate;
        }
        // 处理客户编码
        console.log("trx_code:", row[6]);
        const customer_code = custCodeMap[row[6]];
        console.log("customer_code:", customer_code);
        // 处理金额
        const oriSum = Math.abs(parseFloat(row[8]));
        let paramsRow = null;
        // 收款单参数
        if (isReceiveBill(row[6])) {
          paramsRow = {
            code, // 随机唯一字符串
            accentity_code: rowData.org_id, // 会计主体编码（取数据行）
            vouchdate, // 单据日期
            customer_code, // 客户编码
            tradetype_code: "arap_receipt_other", // 交易类型 （固定值：其他收款）
            currency: "1606357067817811989", // 币种（固定值）
            exchangeRateType_code: "01", // 汇率类型 （固定值'01'）
            exchRate: 1, // 汇率（固定值 1）
            oriSum, // 收款金额
            natSum: oriSum, // 本币金额
            _status: "Insert",
            ReceiveBill_b: {
              quickType_code: "2", // 款项类型（固定值'2'）
              oriSum, // 收款金额
              natSum: oriSum, // 本币金额
              _status: "Insert"
            }
          };
          // 处理结算方式
          if (["90709", "90715", "90711", "92701", "92708", "92709", "92710", "92711"].includes(row[6])) {
            paramsRow.settlemode_code = "system_0001"; //结算方式编码
            console.log("rowData.org_id:", rowData.org_id);
            //收款银行账户编码
            if (rowData.org_id == "1607317731723968520") {
              paramsRow.enterprisebankaccount_code = "100210";
            } else if (rowData.org_id == "1607317199142780931") {
              paramsRow.enterprisebankaccount_code = "100207";
            } else if (rowData.org_id == "1607305774548123655") {
              paramsRow.enterprisebankaccount_code = "100211";
            } else if (rowData.org_id == "1607303936282722313") {
              if (["90709", "90715", "92701", "92708"].includes(row[6])) {
                paramsRow.enterprisebankaccount_code = "100204";
              }
              if (["90711", "92709", "92710", "92711"].includes(row[6])) {
                paramsRow.enterprisebankaccount_code = "100201";
              }
            }
          } else if (["9000"].includes(row[6])) {
            paramsRow.settlemode_code = "system_0002"; //结算方式编码
          }
          receiveBillData.push(paramsRow);
        } else {
          const taxRate = 6; //税率(%) 固定值：6
          let oriMoney = parseFloat(oriSum / (1 + taxRate / 100)).toFixed(2);
          // 应收事项参数
          console.log("code:", code);
          paramsRow = {
            accentity_code: rowData.org_id, // 会计主体编码（取数据行）
            vouchdate, // 单据日期
            billtype: 2, //收付事项类型 固定值
            basebilltype_code: "arap_oar",
            customer_code, // 客户编码
            tradetype_code: "arap_oar_other", //交易类型（固定值）
            currency: "1606357067817811989", // 币种（固定值）
            exchangeRateType_code: "01", // 汇率类型 （固定值'01'）
            exchRate: 1, // 汇率（固定值 1）
            oriSum, // 应收事项金额
            natSum: oriSum, // 本币金额
            auditDate,
            auditTime: auditDate,
            _status: "Insert",
            oarDetail: {
              taxRate, //税率(%) 固定值：6
              oriSum: oriSum, //含税金额
              natSum: oriSum, //本币含税金额
              oriMoney: oriMoney, //无税金额
              natMoney: oriMoney, //本币无税金额
              _status: "Insert"
            }
          };
          // 如果需要有手续费
          if (needCommission(row[6])) {
            paramsRow.headItem = {
              define1: oriSum,
              define4: "1684334045900046341"
            };
          } else {
            paramsRow.headItem = {
              define4: "1684334234875461636"
            };
          }
          oarBillData.push(paramsRow);
        }
      }
      // 如果读取E102有总金额
      if (readE102Res) {
        const taxRate = 6; //税率(%) 固定值：6
        let oriMoneyE102 = parseFloat(readE102Res / (1 + taxRate / 100)).toFixed(2);
        oarBillData.push({
          accentity_code: rowData.org_id, // 会计主体编码（取数据行）
          vouchdate: currentVouchDate, // 单据日期
          billtype: 2, //收付事项类型 固定值
          basebilltype_code: "arap_oar",
          customer_code: "0299", // 客户编码 固定取O299(其他)
          tradetype_code: "arap_oar_other", //交易类型（固定值）
          currency: "1606357067817811989", // 币种（固定值）
          exchangeRateType_code: "01", // 汇率类型 （固定值'01'）
          exchRate: 1, // 汇率（固定值 1）
          oriSum: readE102Res, // 应收事项金额
          natSum: readE102Res, // 本币金额
          _status: "Insert",
          headItem: {
            define4: "1684334234875461636"
          },
          oarDetail: {
            taxRate, //税率(%) 固定值：6
            oriSum: readE102Res, //含税金额
            natSum: readE102Res, //本币含税金额
            oriMoney: oriMoneyE102, //无税金额
            natMoney: oriMoneyE102, //本币无税金额
            _status: "Insert"
          }
        });
      }
      receiveBillData = receiveBillData.filter((v) => v.customer_code !== "0000");
      oarBillData = oarBillData.filter((v) => v.customer_code !== "0000");
      console.log("receiveBillData:", receiveBillData);
      console.log("oarBillData:", oarBillData);
      let execute_status = 2;
      let execute_msg = "";
      let receiveTotalCount = 0;
      let receiveSuccessCount = 0;
      let receiveFailCount = 0;
      let oarBillTotalCount = 0;
      let oarBillSuccessCount = 0;
      let oarBillFailCount = 0;
      cb.utils.alert("执行中，请勿刷新浏览器", "info");
      if (receiveBillData.length) {
        // 保存收款单
        const saveReceiveBillUrl = `https://c2.yonyoucloud.com/iuap-api-gateway/yonbip/fi/receivebill/save?access_token=${access_token}`;
        let fatchSaveReceiveOrder = viewModel.setProxy({
          queryData: {
            url: saveReceiveBillUrl,
            method: "POST"
          }
        });
        const saveResult = fatchSaveReceiveOrder.queryDataSync({ data: receiveBillData });
        console.log("saveReceiveResult:", saveResult);
        receiveTotalCount = saveResult.result.count;
        receiveSuccessCount = saveResult.result.sucessCount;
        receiveFailCount = saveResult.result.failCount;
        const infos = saveResult.result.infos;
        const successInfosStr = infos.map((v) => v.code).join("、");
        execute_msg += `读取到${receiveTotalCount}条收款单数据，成功${receiveSuccessCount}条，单号是：${successInfosStr}；失败${receiveFailCount}条。`;
        if (receiveFailCount > 0) {
          execute_msg += `失败原因：${saveResult.result.messages.join("、")}。`;
        }
      }
      if (oarBillData.length) {
        // 保存应收事项
        const saveOarUrl = `https://c2.yonyoucloud.com/iuap-api-gateway/yonbip/fi/oar/save?access_token=${access_token}`;
        let fatchSaveOar = viewModel.setProxy({
          queryData: {
            url: saveOarUrl,
            method: "POST"
          }
        });
        const saveOarResult = fatchSaveOar.queryDataSync({ data: oarBillData });
        console.log("saveOarResult:", saveOarResult);
        oarBillTotalCount = saveOarResult.result.count;
        oarBillSuccessCount = saveOarResult.result.sucessCount;
        oarBillFailCount = saveOarResult.result.failCount;
        const infos = saveOarResult.result.infos;
        const successInfosStr = infos.map((v) => v.code).join("、");
        execute_msg += `读取到${oarBillTotalCount}条应收事项数据，成功${oarBillSuccessCount}条，单号是：${successInfosStr}；失败${oarBillFailCount}条。`;
        if (oarBillFailCount > 0) {
          execute_msg += `失败原因：${saveOarResult.result.messages.join("、")}。`;
        }
      }
      if (receiveTotalCount + oarBillTotalCount === receiveFailCount + oarBillFailCount) {
        execute_status = "2";
      } else if (receiveTotalCount + oarBillTotalCount === receiveSuccessCount + oarBillSuccessCount) {
        execute_status = "1";
      } else {
        execute_status = "5";
      }
      // 更新本行数据
      await proxyUpdateRow({
        id: rowData.id,
        status: String(execute_status), // "1" 全部成功  "2" 失败  "3" 未执行 "5" 部分成功
        msg: receiveFailCount + oarBillFailCount > 0 ? execute_msg + "失败操作方法：请先删除所有收款单和应收事项的成功单据，修改txt中错误信息后重新上传执行。" : execute_msg,
        execute_time: formatDate(new Date())
      });
      cb.utils.alert("执行完成", "success");
      let filterViewModelInfo = viewModel.getCache("FilterViewModel");
      filterViewModelInfo.get("reset").fireEvent("click");
      //结束进度条
      stop();
      // 关闭loading
    } catch (err) {
      console.log("err:", err);
      // 更新本行数据
      await proxyUpdateRow({
        id: rowData.id,
        status: "2", // "1" 成功  "2" 失败  "3" 未执行
        msg: err,
        execute_time: formatDate(new Date())
      });
      //结束进度条
      stop();
      cb.utils.alert("执行完成", "success");
      let filterViewModelInfo = viewModel.getCache("FilterViewModel");
      filterViewModelInfo.get("reset").fireEvent("click");
      // 关闭loading
    }
  });
viewModel.get("button17ub") &&
  viewModel.get("button17ub").on("click", function (data) {
    // 执行--单击
  });
viewModel.get("button22af") &&
  viewModel.get("button22af").on("click", function (data) {
    // 按钮--单击
  });