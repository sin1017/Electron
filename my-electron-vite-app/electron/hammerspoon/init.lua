local firstPress = false

hs.hotkey.bind({"cmd"},"c",function()
  if firstPress then
    hs.http.post("http://localhost:3030/open", "", {}, function(status, body, headers)
      if status == 200 then
        hs.alert("Electron 視窗已開啟")
      else
        hs.alert("無法開啟視窗")
      end
    end)
    firstPress = false
  else
    firstPress = true
    hs.timer.doAfter(0.3, function() firstPress = false end)
  end
end)