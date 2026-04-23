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
markdown:
"
exit
"
然后输入解套壳指令
Markdown:
"
upx -d moe.exe -o moe_attack.exe
"
看回显
markdown:
"
untrammeled@laptop-fpsmp3t:/mnt/c/Users/HP/Downloads/moe$ upx -d moe.exe -o moe_attack.exe
                       Ultimate Packer for eXecutables
                          Copyright (C) 1996 - 2024
UPX 4.2.2       Markus Oberhumer, Laszlo Molnar & John Reiser    Jan 3rd 2024

        File size         Ratio      Format      Name
   --------------------   ------   -----------   -----------
     12288 <-      8192   66.67%    win64/pe     moe_attack.exe

Unpacked 1 file.
"
成功解开
那就上ida反编译
相信看完之前那么多次的wp可以直接熟能生巧直接看main了
markdown:
"
int __fastcall main(int argc, const char **argv, const char **envp)
{
  FILE *v3; // rax
  __int64 v4; // rcx
  __int64 v5; // rax
  int v6; // r9d
  __int64 v7; // r8
  char v8; // dl
  _OWORD v10[8]; // [rsp+20h] [rbp-148h]
  int v11; // [rsp+A0h] [rbp-C8h]
  int v12; // [rsp+A4h] [rbp-C4h]
  int v13; // [rsp+A8h] [rbp-C0h]
  char v14[48]; // [rsp+B0h] [rbp-B8h]
  char Buffer[112]; // [rsp+E0h] [rbp-88h] BYREF

  v10[0] = _mm_load_si128((const __m128i *)&xmmword_1400032E0);
  v10[1] = _mm_load_si128((const __m128i *)&xmmword_140003310);
  v10[2] = _mm_load_si128((const __m128i *)&xmmword_140003320);
  v10[3] = _mm_load_si128((const __m128i *)&xmmword_1400032F0);
  v10[4] = _mm_load_si128((const __m128i *)&xmmword_1400032D0);
  v10[5] = _mm_load_si128((const __m128i *)&xmmword_1400032B0);
  v10[6] = _mm_load_si128((const __m128i *)&xmmword_140003300);
  v10[7] = _mm_load_si128((const __m128i *)&xmmword_1400032C0);
  v11 = 41;
  v12 = 36;
  v13 = 86;
  sub_140001010("please input your flag: ");
  v3 = _acrt_iob_func(0);
  fgets(Buffer, 100, v3);
  v4 = -1;
  do
    ++v4;
  while ( Buffer[v4] );
  v5 = 0;
  v6 = 0;
  if ( (int)v4 > 0 )
  {
    v7 = 0;
    do
    {
      v8 = Buffer[v7] ^ 0x21;
      if ( v6 < (int)v4 - 1 )
        v8 ^= Buffer[v7 + 1];
      v14[v7] = v8;
      ++v6;
      ++v7;
    }
    while ( v7 < (int)v4 );
  }
  while ( v14[v5] == *((_DWORD *)v10 + v5) )
  {
    if ( ++v5 >= 35 )
      return 0;
  }
  sub_140001010("you will never get the flag!!!!\n");
  return 0;
}
"
重点看他的输出flag条件
markdown:
"
if ( (int)v4 > 0 )
{
v7 = 0;
do
{
v8 = Buffer[v7] ^ 0x21;
if ( v6 < (int)v4 - 1 )
v8 ^= Buffer[v7 + 1];
v14[v7] = v8;
++v6;
++v7;
}
while ( v7 < (int)v4 );
}
while ( v14[v5] == *((_DWORD *)v10 + v5) )
  {
    if ( ++v5 >= 35 )
      return 0;
  }
"
分析:
用户输入Buffer经过异或处理结果和硬编码的v10[]比较 完全相等输出flag
第 i 位：out[i] = in[i] ^ 0x21 ^ in[i+1]
最后一位：out[i] = in[i] ^ 0x21
那就从汇编里直接提取35字节正确密文
网上看有密文算法
markdown:
"
v10[0] = _mm_load_si128((const __m128i *)&xmmword_1400032E0);
v10[1] = _mm_load_si128((const __m128i *)&xmmword_140003310);
v10[2] = _mm_load_si128((const __m128i *)&xmmword_140003320);
v10[3] = _mm_load_si128((const __m128i *)&xmmword_1400032F0);
v10[4] = _mm_load_si128((const __m128i *)&xmmword_1400032D0);
v10[5] = _mm_load_si128((const __m128i *)&xmmword_1400032B0);
v10[6] = _mm_load_si128((const __m128i *)&xmmword_140003300);
v10[7] = _mm_load_si128((const __m128i *)&xmmword_1400032C0);
v11 = 41; #0x29
v12 = 36; #0x24
v13 = 86; #0x56
"
分析一下：
_mm_load_si128是一次性读 16 字节硬编码数据
v11、v12、v13是直接写死的 3 个数字
最后比较循环v5>=35

但是我们现在暂且只知道v11 v12 v13的地址 那就双击xmmword看看其他数据的地址
"
.rdata:00000001400032B0 xmmword_1400032B0 xmmword 0A0000001C0000003700000015h
.rdata:00000001400032B0                                         ; DATA XREF: main+60↑r
.rdata:00000001400032C0 xmmword_1400032C0 xmmword 240000000B000000160000003Dh
.rdata:00000001400032C0                                         ; DATA XREF: main+7C↑r
.rdata:00000001400032D0 xmmword_1400032D0 xmmword 2900000076000000650000003Fh
.rdata:00000001400032D0                                         ; DATA XREF: main+52↑r
.rdata:00000001400032E0 xmmword_1400032E0 xmmword 36000000270000002B00000023h
.rdata:00000001400032E0                                         ; DATA XREF: main+19↑r
.rdata:00000001400032F0 xmmword_1400032F0 xmmword 3A0000000B000000100000007Bh
.rdata:00000001400032F0                                         ; DATA XREF: main+44↑r
.rdata:0000000140003300 xmmword_140003300 xmmword 3C0000003E0000002100000008h
.rdata:0000000140003300                                         ; DATA XREF: main+6E↑r
.rdata:0000000140003310 xmmword_140003310 xmmword 48000000030000003C00000033h
.rdata:0000000140003310                                         ; DATA XREF: main+28↑r
.rdata:0000000140003320 xmmword_140003320 xmmword 760000001D0000000B00000064h
.rdata:0000000140003320                                         ; DATA XREF: main+36↑r
"
然后就是漫长的拆解
1. xmmword_1400032B0
0A0000001C0000003700000015h拆分 4 个 int：
15h → 0x15
37h → 0x37
1Ch → 0x1C
0Ah → 0x0A
得到：[0x15, 0x37, 0x1C, 0x0A]
2. xmmword_1400032C0
240000000B000000160000003Dh
3Dh → 0x3D
16h → 0x16
0Bh → 0x0B
24h → 0x24
得到：[0x3D, 0x16, 0x0B, 0x24]
3. xmmword_1400032D0
2900000076000000650000003Fh
3Fh → 0x3F
65h → 0x65
76h → 0x76
29h → 0x29
得到：[0x3F, 0x65, 0x76, 0x29]
4. xmmword_1400032E0
36000000270000002B00000023h
23h → 0x23
2Bh → 0x2B
27h → 0x27
36h → 0x36
得到：[0x23, 0x2B, 0x27, 0x36]
5. xmmword_1400032F0
3A0000000B000000100000007Bh
7Bh → 0x7B
10h → 0x10
0Bh → 0x0B
3Ah → 0x3A
得到：[0x7B, 0x10, 0x0B, 0x3A]
6. xmmword_140003300
3C0000003E0000002100000008h
08h → 0x08
21h → 0x21
3Eh → 0x3E
3Ch → 0x3C
得到：[0x08, 0x21, 0x3E, 0x3C]
7. xmmword_140003310
48000000030000003C00000033h
33h → 0x33
3Ch → 0x3C
03h → 0x03
48h → 0x48
得到：[0x33, 0x3C, 0x03, 0x48]
8. xmmword_140003320
760000001D0000000B00000064h
64h → 0x64
0Bh → 0x0B
1Dh → 0x1D
76h → 0x76
得到：[0x64, 0x0B, 0x1D, 0x76]

由于上述的顺序是按大小排列的
按照题目v10[i]的顺序重新排列一下
0x23,0x2B,0x27,0x36,  # 32E0  v10[0]
0x33,0x3C,0x03,0x48,  # 3310  v10[1]
0x64,0x0B,0x1D,0x76,  # 3320  v10[2]
0x7B,0x10,0x0B,0x3A,  # 32F0  v10[3]
0x3F,0x65,0x76,0x29,  # 32D0  v10[4]
0x15,0x37,0x1C,0x0A,  # 32B0  v10[5]
0x08,0x21,0x3E,0x3C,  # 3300  v10[6]
0x3D,0x16,0x0B,0x24   # 32C0  v10[7]
0x29,0x24,0x56 #已知
那就直接上python解flag
第一步：全体异或0x21
第二步：从后往前逆异或
markdown:
"
enc=[
    0x23, 0x2b, 0x27, 0x36, 0x33, 0x3c, 0x03, 0x48,
    0x64, 0x0b, 0x1d, 0x76, 0x7b, 0x10, 0x0b, 0x3a,
    0x3f, 0x65, 0x76, 0x29, 0x15, 0x37, 0x1c, 0x0a,
    0x08, 0x21, 0x3e, 0x3c, 0x3d, 0x16, 0x0b, 0x24,
    0x29, 0x24, 0x56, 43			
]
xored=[]
for i in range(len(enc)):
    xored.append(enc[i]^0x21)
#print(xored)
for i in range(len(xored)-2,-1,-1):
    xored[i]=xored[i]^xored[i+1]
flag=''.join(chr(i) for i in xored)
print(flag)
"
拿到flag
markdown:
"
moectf{Y0u_c4n_unp4ck_It_vvith_upx}
"