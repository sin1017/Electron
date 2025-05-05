local lastTime = 0

local eventTap = hs.eventtap.new({hs.eventtap.event.types.keyDown}, function(event)
  --[[
    event:getFlags() hammerspoon 官網的用法
    https://www.hammerspoon.org/docs/hs.eventtap.event.html#getFlags
  --]] 
  local flags = event:getFlags()
  local keyCode = event:getKeyCode()

  -- Cmd + C 的 keyCode 是 8（對應於 'c'）
  if flags.cmd and keyCode == 8 then
    local now = hs.timer.secondsSinceEpoch()
    if now - lastTime < 0.3 then
      -- 雙次觸發成功！
      hs.http.post("http://localhost:3030/open", "", {}, function(status)
        if status == 200 then
          hs.alert("開啟 Electron 視窗")
        else
          hs.alert("無法開啟 Electron")
        end
      end)
      lastTime = 0
    else
      lastTime = now
    end
  end
end)

eventTap:start()