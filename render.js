document.getElementById('openBtn').addEventListener('click', async () => {
  const content = await window.fileApi.openFile();
  if(content !== null){
    document.getElementById('content').textContent = content;
  } else {
    document.getElementById('content').textContent = '使用者取消了選取';
  }
});


