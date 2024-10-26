This repository is a Monorepo workspace;

The two projects/packages included—"exprbuild" and "desmosinc"—are currently being developed together (for easier refactoring).

---

ExprBuild is a js(ts?) library to build expressions, plus the ability of exporting them to multiple forms — LaTeX, desmos state json, or render with our built-in Desmos development server!

Current in architecture-design phase. Drafts see:
- [design-draft.md](packages/ExprBuild/design-draft.md)
- [design-draft-v2.md](packages/ExprBuild/design-draft-v2.md)

"desmosinc" is a not yet started project, an incremental game powered by Desmos~

---

此仓库为一个Monorepo workspace; 

包含的两个项目/包——"exprbuild"和"desmosinc"现阶段联合开发（方便重构）。

---

ExprBuild是一个js(ts?)库，用于构建一系列数学表达式，同时将它们导出为多种形式——LaTeX、desmos state json、或者使用我们自带的 Desmos Dev Server 进行实时开发！

目前处于架构设计阶段。草稿见：
- [design-draft.md](packages/ExprBuild/design-draft.md)
- [design-draft-v2.md](packages/ExprBuild/design-draft-v2.md)

"desmosinc"是一个尚未开始的项目，一个Desmos增量游戏~

---

稍微记录一下各配置文件的含义和作用：

- `tsconfig.json`：全局ts配置文件，其中`path`字段需要包含两个包，是联合重构的必要条件之一。
- `package.json`：可配置由npm支持的monorepo。使两个包可以依赖彼此，并在运行npm指令/运行我们自己的程序时正确使用依赖。
- `packages/ExprBuild/`:
	- `tsconfig.json`: ts语言支持必需
	- `package.json`: 
		- `bin`字段可对外提供可执行命令，此处用于提供dev server cli. 因此在隔壁项目里install好后可以通过`npx exprbuild`运行这边提供的dev server。
		- 入口点暂时设在src目录里，（照理来说对于ts项目应该设置到dist之类的输出目录里的然后通过一次tsc构建来更新dist里的代码）
			
			跳过tsc转录/项目构建步骤，这样隔壁项目的import引用的就直接是这边的源码，这是联合重构的另一必要条件。
			
			反正ExprBuild只是一个library对吧（）

- 其他关于`package.json`的：
	- `main`字段其实只影响跨包依赖解析.
	- `scripts`属性里是辅助本包开发的一些(快捷)指令；比如
		```
  		"scripts": {
      		"build": "tsc",
  		},
		```
		那么可以运行`npm run build` 等于执行`tsc`指令.
