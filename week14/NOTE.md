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

## 鼠标和触屏拖拽事件处理代码

### 初步框架

- 触摸拖拽相关的原生事件
  - touchstart - 开始触摸屏幕
  - touchmove - 移动手指
  - touchend - 结束拖拽离开屏幕
  - touchcancel - 被打断

对鼠标拖拽和触摸拖拽统一抽象成 4 个响应函数来处理。

commit: 2ed1b80

### 根据事件时序判断发生的动作

- start 后 .5s 手指未离开，则触发 pressstart
- 移动距离超过阈值，判定为 panstart，并取消开启 press 的 timeout
- 增加状态变量，在 end 事件中，若未发生 pan 或 press ，则发出 tap，且取消开启 press 的 timeout；若发生 pan 或 press 的情况，则发出对应的 end 事件
- 发生 cancel 事件也取消开启 press 的 timeout

commit: bc1fcbb

### 支持多点触摸，和鼠标多个键同时按下

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

commit: dbd35e5

### 加入 dispatchEvent

- [Event 类](https://developer.mozilla.org/en-US/docs/Web/API/Event)
- [CustomEvent 类](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) - 增加 detail 属性，约定用此对象传入补充信息

  ```javascript
  let event = new CustomEvent('cat', {
    detail: {
      hazcheeseburger: true,
    },
  });
  obj.dispatchEvent(event);
  ```

- [EventTarget.dispatchEvent()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent) - 向目标 element 派发事件

commit: cc166ef

### 实现 flick 动作

- end 时，计算最近一段时间的移动速度
  - 每次 move 记录一个位置坐标，且只保留最近 500ms 内的点
  - end 时，计算现存最早的点 与 当前位置 之间的距离，除以两者发生时间的间隔，得到速度
  - end 前 .5s 内未发生移动的情况下，点数组为空，不计算速度
  - 若得到的速度大于预设的阈值，发出 flick 事件

commit: 31145a6

### 封装重构

- 主体结构分析

  - listen - 监听原生事件
  - recognize - 识别用户动作
  - dispatch - 派发自定义事件

- 把各部分拆分重组成类，变量、函数移入适当的作用域

- 完成自定义事件信息对象的内容和 dispatch 调用
