// Compatibility entry point; the supported package command includes the renderer build.
const {spawnSync}=require('node:child_process');
const result=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['run','package:win'],{cwd:require('node:path').resolve(__dirname,'..'),stdio:'inherit',shell:process.platform==='win32'});
process.exitCode=result.status??1;
