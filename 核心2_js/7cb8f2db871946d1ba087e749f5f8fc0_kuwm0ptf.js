viewModel.get("AttachmentList").on("cellJointQuery", function (args) {
  debugger;
  if (args.cellName == "lookfj") {
    //预览
    window.open(args.row.lookfj, "_blank", "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");
  }
  if (args.cellName == "DownUrl") {
    //下载
    const iframe = document.createElement("iframe");
    iframe.setAttribute("hidden", "hidden");
    document.body.appendChild(iframe);
    iframe.onload = () => {
      if (iframe) {
        iframe.setAttribute("src", "about:blank");
      }
    };
    let url = args.row.DownUrl;
    iframe.setAttribute("src", url);
  }
});
function executeDelayedTask() {
  var workerCode = `
        self.onmessage = function(event) {
          if (event.data === "start") {
            console.log("开始延时任务...");
            setTimeout(function() {
              console.log("延时任务完成！");
              self.postMessage("taskCompleted");
              self.close();
            }, 60000); // 7天的毫秒数
          }
        };
      `;
  var worker;
  function createWorker() {
    if (typeof Worker !== "undefined") {
      if (!worker) {
        worker = new Worker(URL.createObjectURL(new Blob([workerCode], { type: "application/javascript" })));
        worker.onmessage = function (event) {
          var message = event.data;
          if (message === "taskCompleted") {
            console.log("延时任务完成！");
            stopDelayedTask();
          }
        };
        console.log("开始延时任务...");
        worker.postMessage("start");
      } else {
        console.log("延时任务已经在执行中。");
      }
    } else {
      console.log("抱歉，您的浏览器不支持 Web Workers。");
    }
  }
  function stopDelayedTask() {
    if (worker) {
      worker.terminate();
      worker = null;
      console.log("延时任务已停止。");
    }
  }
  window.addEventListener("beforeunload", function () {
    stopDelayedTask();
  });
  createWorker();
}
const oneweekinmillis = 60000;
var Attachmentfa = "";
var DownUrl = ""; //下载地址
var prevUrl = ""; //预览地址
var fileName = ""; //文件名称
var fjflag = "";
viewModel.on("afterLoadData", function (args) {
  debugger;
  viewModel.get("isnoflag").setValue("1");
});
viewModel.get("Attachmentfa").on("afterFileUploadSuccess", function (data) {
  debugger;
  Attachmentfa = viewModel.get("Attachmentfa").getValue();
  window.YYCooperationBridge.ready(() => {
    //获取fileId
    window.YYCooperationBridge.YYGetFilesIncludeDelete({
      businessType: "iuap-yonbuilder-runtime",
      businessId: Attachmentfa
    }).then((fileRes) => {
      debugger;
      console.log(fileRes);
      fileName = fileRes.data[0].fileName;
      fjflag = fileRes.count;
      const fileId = fileRes.data[0].id; //这里获取到了fileId 多个文件自行处理
      const qzId = 0; //固定值
      const open = false; //固定值
      //获取下载地址
      DownUrl = window.YYCooperationBridge.YYGetDownloadUrl(fileId);
      console.log(DownUrl);
      //获取预览地址
      window.YYCooperationBridge.YYPreviewFileById(fileId, qzId, open).then((res) => {
        console.log(res);
        prevUrl = res;
      });
    });
  });
});
viewModel.get("button25ld") &&
  viewModel.get("button25ld").on("click", function (data) {
    // 提交--单击
    debugger;
    executeDelayedTask();
    var now = new Date();
    var year = now.getFullYear(); //获取完整的年份(4位,1970-????)
    var month = now.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var day = now.getDate(); //获取当前日(1-31)
    var hour = now.getHours(); //获取当前小时数(0-23)
    var minute = now.getMinutes(); //获取当前分钟数(0-59)
    var second = now.getSeconds(); //获取当前秒数(0-59)
    var time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    var ticket_id = viewModel.get("ticket_id").getValue();
    var isnoflag = viewModel.get("isnoflag").getValue();
    var rowid = viewModel.get("id").getValue();
    if (isnoflag == "1") {
      //工单转单
      debugger;
      var parms = {};
      var userName = cb.rest.AppContext.user.userName;
      var userid = viewModel.get("bipUser").getValue();
      var content = viewModel.get("content").getValue();
      var clrname = viewModel.get("clrname").getValue();
      var clremail = viewModel.get("clremail").getValue();
      var clripone = viewModel.get("clripone").getValue();
      if (fjflag == 1) {
        parms = {
          rowid: rowid,
          userid: userid,
          clrname: clrname,
          clremail: clremail,
          clripone: clripone,
          ticket_id: ticket_id,
          time: time,
          userName: userName,
          content: content,
          DownUrl: DownUrl,
          prevUrl: prevUrl,
          fileName: fileName,
          fjflag: fjflag
        };
      }
      if (fjflag == 0) {
        parms = { rowid: rowid, userid: userid, clrname: clrname, clremail: clremail, clripone: clripone, ticket_id: ticket_id, time: time, userName: userName, content: content, fjflag: fjflag };
      }
      if (userid == undefined) {
        cb.utils.alert({
          title: "分派给是必填项",
          type: "warning",
          duration: "3",
          mask: true,
          onClose: function () {}
        });
        return "";
      }
      cb.rest.invokeFunction("AT17FC00DA0848000A.api.zdupdata", parms, function (err, res) {
        console.log(res);
        cb.utils.alert({
          title: "提交成功!",
          type: "success",
          duration: "3",
          mask: true,
          onClose: function () {}
        });
        cb.rest.invokeFunction("AT17FC00DA0848000A.api.ykjsend", { userid: userid, userName: userName, ticket_id: ticket_id, isnoflag: isnoflag }, function (err, res) {
          console.log(res);
        });
        viewModel.communication({ type: "return" });
      });
    }
    if (isnoflag == "2") {
      //解决
      debugger;
      var parms = {};
      var submitter_id = viewModel.get("submitter_id").getValue();
      var userid = cb.context.getUserId();
      let result = cb.rest.invokeFunction("AT17FC00DA0848000A.api.getuser", { userid: userid }, function (err, res) {}, viewModel, { async: false });
      var user = result.result.res.res[0];
      var content = viewModel.get("content").getValue();
      var Attachmentfa = viewModel.get("Attachmentfa").getValue();
      var clremail = user.email;
      var clripone = user.mobile;
      var userName = user.name;
      if (fjflag == 1) {
        parms = {
          rowid: rowid,
          userid: userid,
          clrname: userName,
          clremail: clremail,
          clripone: clripone,
          ticket_id: ticket_id,
          time: time,
          content: content,
          DownUrl: DownUrl,
          prevUrl: prevUrl,
          fileName: fileName,
          fjflag: fjflag
        };
      }
      if (fjflag == 0) {
        parms = { rowid: rowid, userid: userid, clrname: userName, clremail: clremail, clripone: clripone, ticket_id: ticket_id, time: time, content: content, fjflag: fjflag };
      }
      if (content == undefined) {
        cb.utils.alert({
          title: "回复内容是必填项",
          type: "warning",
          duration: "3",
          mask: true,
          onClose: function () {}
        });
        return "";
      }
      cb.rest.invokeFunction("AT17FC00DA0848000A.api.solveupdata", parms, function (err, res) {
        console.log(res);
        cb.rest.invokeFunction("AT17FC00DA0848000A.api.ykjsend", { userid: submitter_id, userName: userName, ticket_id: ticket_id, isnoflag: isnoflag }, function (err, res) {
          console.log(res);
        });
        cb.utils.alert({
          title: "提交成功!",
          type: "success",
          duration: "3",
          mask: true,
          onClose: function () {}
        });
        viewModel.communication({ type: "return" });
      });
    }
    if (isnoflag == "3") {
      //撤回
      debugger;
      var submitter_id = viewModel.get("submitter_id").getValue();
      var userid = cb.context.getUserId();
      let result = cb.rest.invokeFunction("AT17FC00DA0848000A.api.getuser", { userid: userid }, function (err, res) {}, viewModel, { async: false });
      var user = result.result.res.res[0];
      var userName = user.name;
      var content = viewModel.get("content").getValue();
      var clremail = user.email;
      var clripone = user.mobile;
      if (content == undefined) {
        cb.utils.alert({
          title: "回复内容是必填项",
          type: "warning",
          duration: "3",
          mask: true,
          onClose: function () {}
        });
        return "";
      }
      cb.rest.invokeFunction(
        "AT17FC00DA0848000A.api.withdrawUpdata",
        { rowid: rowid, userid: userid, clrname: userName, clremail: clremail, clripone: clripone, ticket_id: ticket_id, time: time, content: content },
        function (err, res) {
          cb.rest.invokeFunction("AT17FC00DA0848000A.api.ykjsend", { userid: submitter_id, userName: userName, ticket_id: ticket_id, isnoflag: isnoflag }, function (err, res) {
            console.log(res);
          });
          cb.utils.alert({
            title: "撤回成功!",
            type: "success",
            duration: "3",
            mask: true,
            onClose: function () {}
          });
          viewModel.communication({ type: "return" });
        }
      );
    }
  });