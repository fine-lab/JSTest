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