viewModel.get("button70wc") &&
  viewModel.get("button70wc").on("click", function (data) {
    // 执行--单击
    console.log(11111);
    console.log(data);
    const data2 = viewModel.getAllData();
    //附件的fileid
    var options = {
      domainKey: "yourKeyHere"
    };
    console.log(data2);
    let attach = "f3308480-5c22-11ed-86ab-c57bf91c9e54";
    let url2 = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/list/downloadurl?fileIds=6364bdcb1536e208b2ee1d55&downThumb=false&authId=`;
    let url = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/mdf/${attach}/files?includeChild=false&ts=1655781730750&pageSize=10`;
    let url3 = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/mdf/${attach}/files?authId=&pageSize=10000&groupId=&columnId=&pageNo=1&isGroupIncludeChild=false&fileName=`;
    let url4 = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/chunk/63646acbb9827d04024168d1/0/ocstream?downThumb=false&token=yonbip_esn_lightapp08f44b36fe512fb8cac8268c117d0aa4&isWaterMark=false&fileName=file`;
    let url5 = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/chunk/6364db26c30b652c8de66881/0/ocstream?downThumb=false&token=yonbip_esn_lightappa22044dd4ef7b3b461905ce4d548abc2&isWaterMark=false&fileName=file`;
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("get", url5, true);
    xmlHttp.setRequestHeader("Content-Type", "text/plain");
    xmlHttp.send();
    xmlHttp.onreadystatechange = doResult;
    function doResult() {
      console.log(xmlHttp.readyState);
      if (xmlHttp.readyState == 4) {
        console.log(xmlHttp.responseText);
      }
    }
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: url3,
        method: "GET",
        options: options
      }
    });
    var reqParams = {};
    proxy.settle(reqParams, function (err, result) {
      console.log("222", result);
      if (err) {
        cb.utils.alert(err.message, "error");
        return;
      } else {
        console.log(result);
      }
    });
  });