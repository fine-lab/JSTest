viewModel.get("button9ni") &&
  viewModel.get("button9ni").on("click", async function (args) {
    // 执行--
    var gridModel = viewModel.getGridModel();
    // 获取行数据
    const rowData = gridModel.getRow(args.index);
    function readTxtFile(fileId) {
      return new Promise((resolve, reject) => {
        let proxy1 = viewModel.setProxy({
          queryData: {
            url: `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/iuap-yonbuilder-runtime+mdf/${fileId}/files?authId=&pageSize=10000&groupId=&columnId=&pageNo=1&isGroupIncludeChild=false&fileName=`,
            method: "GET"
          }
        });
        const result1 = proxy1.queryDataSync();
        const file1Url = result1.data[0]["filePath"];
        if (!file1Url) {
          reject(new Error("获取文件路径失败"));
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
    try {
      // 读取txt文件内容
      const file1Content = await readTxtFile(rowData.file1);
      const file2Content = await readTxtFile(rowData.file2);
      const file3Content = await readTxtFile(rowData.file3);
      // 获取access_token
      cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/AT16313F9E09880006/baseConfig?domainKey=developplatform"], function (a) {
        const tokenParams = a.getAccessToken();
        let access_token = "";
        const fatchAccessToken = viewModel.setProxy({
          queryData: tokenParams
        });
        const access_token_result = fatchAccessToken.queryDataSync();
        console.log("access_token_result:", access_token_result);
        if ("00000" == access_token_result.error.code) {
          access_token = access_token_result.error.data.access_token;
        }
        console.log("access_token:", access_token);
        // 保存收款单
        const saveReceiveUrl = `https://c2.yonyoucloud.com/iuap-api-gateway/yonbip/fi/receivebill/save?access_token=${access_token}`;
        const params = {
          resubmitCheckKey: Date.now(),
          accentity_code: "1",
          vouchdate: "2022-12-05",
          customer_code: "00000000000032",
          tradetype_code: "arap_receipt_other",
          currency: "CNY",
          exchangeRateType_code: "01",
          exchRate: "1",
          oriSum: 100,
          natSum: 100,
          _status: "Insert",
          ReceiveBill_b: {
            quickType_code: "2",
            oriSum: 100,
            natSum: 100,
            _status: "Insert"
          }
        };
        let fatchSaveReceiveOrder = viewModel.setProxy({
          queryData: {
            url: saveReceiveUrl,
            method: "POST"
          }
        });
        const saveResult = fatchSaveReceiveOrder.queryDataSync(params);
        console.log("saveResult::", saveResult);
      });
    } catch (err) {
      console.log(err);
    }
  });
viewModel.get("button9ni") &&
  viewModel.get("button9ni").on("click", function (data) {
    // 执行--单击
  });