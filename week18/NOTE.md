学习笔记

## 工具链

- 准备 Linux 服务器环境
- 视企业的系统架构、团队分工、运维流程等情况不同，前端发布的实际过程也不同
- 课程中主要是把整个过程链路跑通
- 创建 express 项目，去掉不用的 router 和模板引擎，在 server 上启动，作为前端发布的目标服务器

### 发布系统

- publish-tool

  - 负责发送文件

- publish-server

  - 负责在服务器上接收文件，完成部署

- Node 里的 stream API

  - [Readable](https://nodejs.org/docs/latest/api/stream.html#stream_class_stream_readable)
    - 文档提示有三种 consume 模式，on('data'), on('readable'), pipe() ，不要混用
    - 课程中使用 on data / on close 模式
  - Writable
    - .write(chunk), .end(chunk)
    - 异步写入，Node 负责排队执行
    - 若 write() 返回 false，表示需要排队，写完成后发生 drain 事件
    - 调用 end() 后，完成后发生 finish 事件

- publish-tool 实现发送文件

  - fs.createReadStream() 读文件流
  - 写入 request 流

- publish-server 服务端接收文件

  - 读 request 流 (实际类型是 IncomingMessage )
  - 写入文件流，覆盖 server/public 目录下发布的文件

- 在 publish-server 和 server 项目文件中添加 publish 脚本，以便后续部署更新版本

- 多个文件压缩打包后发送

  - 压缩 [archiver](https://www.npmjs.com/package/archiver)
  - 解压 [unzipper](https://www.npmjs.com/package/unzipper)
  - 流 API: `readable.pipe(writable)`

具体实现详见代码 a4110f93
