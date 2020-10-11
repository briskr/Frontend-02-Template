学习笔记

## 触屏操作基本概念

触摸动作位置不如鼠标稳定

- 单指触摸事件顺序分支
  - start 手指开始接触屏幕，可能产生不同的动作
    - -> tap - 手指接触后短时间离开
    - -> pan-start - 接触后未离开，且开始滑动(距离超过门限，例如 10px)
      - -> pan - 保持在屏幕上移动，可多次发生
        - -> pen-end - 手指离开屏幕
        - -> flick - 手指离开屏幕且滑动速度较快
    - -> press-start - 手指长按屏幕
      - -> pan-start - 长按期间发生移动
      - -> press-end - 长按结束，离开屏幕

### 鼠标和触屏拖拽事件处理代码框架

- 触摸拖拽相关的原生事件
  - touchstart - 开始触摸屏幕
  - touchmove - 移动手指
  - touchend - 结束拖拽离开屏幕
  - touchcancel - 被打断

对鼠标拖拽和触摸拖拽统一抽象成 4 个响应函数来处理。至此对应的代码: 2ed1b80

- 分析事件时序，处理不同类型的动作
  - start 后 .5s 手指未离开，则触发 pressstart
  - 移动距离超过阈值，判定为 panstart，并取消开启 press 的 timeout
  - 增加状态变量，在 end 事件中，若未发生 pan 或 press ，则发出 tap，且取消开启 press 的 timeout；若发生 pan 或 press 的情况，则发出对应的 end 事件
  - 发生 cancel 事件也取消开启 press 的 timeout

至此对应的代码: bc1fcbb

- 状态信息装入 context 对象

  - 多个 context 对象以 touch.identifier 为 key 分别保留在内存集合(可支持多点触摸)
  - 完成 end 或 cancel 后从集合中删除

- 鼠标事件对应增加 context 对象

  - mousedown 事件响应中创建 context 对象，标识由 event.button 决定
    - button 值 - 0 左键(primary), 1 中键(auxiliary), 2 右键(secondary), 3 返回, 4 前进
    - mousemove 事件中需要根据 buttons 属性判断移动期间哪些键被按下，以二进制位掩码形式表示 - 1 左键, 2 右键, 4 中键, 8 返回, 16 前进
    - 对调右键和中键数值后，以左移表达式把 0~4 的 button 值转为 2 \*\* button 作为 context 的 key
  - 两个以上的按键先后按下，mousedown 时需要判断是否已经添加过 move 和 up 的响应函数，避免重复添加 - 添加 isListeningMouse 变量
    - mouseup 响应时，增加判断 buttons 值，只有当所有按键都松开后才移除 move 和 up 响应函数

至此对应的代码 dbd35e5
