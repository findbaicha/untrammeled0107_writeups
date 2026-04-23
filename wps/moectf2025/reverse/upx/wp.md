看到exe运行要输入flag
直接看反编译 看看文件资讯
运行Command
Markdown:
"
gdb ./moe.exe
"
"
info file
"
看看回显
"
Symbols from "/workspaces/untrammeled0107_writeups/test/moe.exe".
Local exec file:
        `/workspaces/untrammeled0107_writeups/test/moe.exe', file type pei-x86-64.
        Entry point: 0x14000a260
        0x0000000140001000 - 0x0000000140009000 is UPX0
        0x0000000140009000 - 0x000000014000a600 is UPX1
        0x000000014000b000 - 0x000000014000b600 is .rsrc
"
是upx套壳 那就解套壳
先输入exit出去
Markdown:
"
upx -d ./moe.exe -o ./moe_unpacked.exe
"
然后输入解套壳
Markdown:
"
upx -d ./moe.exe -o ./moe_unpacked.exe
"