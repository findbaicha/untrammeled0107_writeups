看到elf直接上ida反编译看main怎么出flag
markdown:
"
int __fastcall main(int argc, const char **argv, const char **envp)
{
  char v3; // bl
  bool v4; // r12
  __int64 v5; // rbx
  __int64 v6; // rax
  char v8; // [rsp+Fh] [rbp-71h] BYREF
  __int64 v9; // [rsp+10h] [rbp-70h] BYREF
  __int64 v10; // [rsp+18h] [rbp-68h] BYREF
  _BYTE v11[32]; // [rsp+20h] [rbp-60h] BYREF
  _BYTE v12[40]; // [rsp+40h] [rbp-40h] BYREF
  unsigned __int64 v13; // [rsp+68h] [rbp-18h]

  v13 = __readfsqword(0x28u);
  IO_printf((unsigned int)"Input your flag:\n> ", (_DWORD)argv, (_DWORD)envp);
  IO_fflush(stdout);
  std::string::basic_string(v11);
  std::operator>><char>((std::istream *)&std::cin);
  if ( std::string::length(v11, v11) == 42 )
  {
    v3 = 0;
    v4 = 1;
    if ( (unsigned __int64)std::string::length(v11, v11) > 7 )
    {
      std::string::substr(v12, v11, 0, 7);
      v3 = 1;
      if ( !(unsigned __int8)std::operator!=<char>(v12, "moectf{") && *(_BYTE *)std::string::back(v11) == 125 )
        v4 = 0;
    }
    if ( v3 )
      std::string::~string(v12);
    if ( v4 )
    {
      IO_puts("FORMAT ERROR!");
    }
    else
    {
      std::allocator<char>::allocator(&v8);
      v10 = std::string::end(v11);
      v5 = __gnu_cxx::__normal_iterator<char *,std::string>::operator-(&v10, 1);
      v9 = std::string::begin(v11);
      v6 = __gnu_cxx::__normal_iterator<char *,std::string>::operator+(&v9, 7);
      std::string::basic_string<__gnu_cxx::__normal_iterator<char *,std::string>,void>(v12, v6, v5, &v8);
      std::string::operator=(v11, v12);
      std::string::~string(v12);
      std::allocator<char>::~allocator(&v8);
      std::string::basic_string(v12, v11);
      LOBYTE(v5) = check(v12);
      std::string::~string(v12);
      if ( (_BYTE)v5 )
      {
        IO_puts("OK");
        IO_puts("But I don't know what the true flag is");
      }
      else
      {
        IO_puts("try again~");
      }
    }
  }
  else
  {
    IO_puts("Length error!");
  }
  std::string::~string(v11);
  return 0;
}
"

算法基本分析：
1. 总长度必须 = 42
    markdown:
    "
    if ( std::string::length(v11) == 42 )
    "
2. 必须以 moectf{ 开头 ; 以 } 结尾（ASCII 125）否则format error
    markdown:
    "
    if ( !(unsigned __int8)std::operator!=<char>(v12, "moectf{") && *(_BYTE *)std::string::back(v11) == 125 )
    "
3. 最终验证靠一个函数：check(v12)
    返回 1 → 输出 OK
    返回 0 → 输出 try again~
    markdown:
    "
    LOBYTE(v5) = check(v12);
    "
4. check在main的传入值
    s[0..33] = flag[7..40]   （去掉 moectf{ 和 }）
    markdown:
    "
    v6 = begin + 7;
    v5 = end - 1;
    std::string(v12, v6, v5);
    "

那就双击过去看看check的算法反编译
markdown:
"
__int64 __fastcall check(__int64 a1)
{
  int i; // [rsp+1Ch] [rbp-4h]

  for ( i = 0; i <= 33; ++i )
  {
    check(std::string)::b[i] = 47806 * (*(char *)std::string::operator[](a1, i) + i);
    if ( i )
      check(std::string)::b[i] ^= check(std::string)::b[i - 1] ^ 0x114514;
    check(std::string)::b[i] %= 51966;
    if ( check(std::string)::b[i] != a[i] )
      return 0;
  }
  return 1;
}
"

算法分析：
这是正向加密逻辑，我们要反向解密：
已知条件
输入：34 个字符（记为 s[i]，i=0~33）
公式：
markdown:
"
temp = 47806 * (s[i] + i);
if (i != 0)
    temp ^= b[i-1] ^ 0x114514;
b[i] = temp % 51966;
"
最终必须等于 常量数组 a[i]
而且不能直接“除回来”，因为：
有 % 51966
有 ^（异或链）
必须逐位爆破 s[i]

markdown:
"
if (b[i] != a[i]) return 0;
"
数组 a 是写死在程序里的正确结果，正是flag
但是问题来了 那a[o]-a[33]分别是什么呢 那就双击a[i]过去看看数组
markdown:
"
.data:00000000005D9140                 public a
.data:00000000005D9140 ; _DWORD a[34]
.data:00000000005D9140 a               dd 0B1B0h, 5678h, 7FF2h, 0A332h, 0A0E8h, 364Ch, 2BD4h
.data:00000000005D9140                                         ; DATA XREF: check(std::string)+125↑o
.data:00000000005D915C                 dd 0C8FEh, 4A7Ch, 18h, 2BE4h, 4144h, 3BA6h, 0BE8Ch, 8F7Eh
.data:00000000005D917C                 dd 35F8h, 61AAh, 2B4Ah, 6828h, 0B39Eh, 0B542h, 33ECh, 0C7D8h
.data:00000000005D919C                 dd 448Ch, 9310h, 8808h, 0ADD4h, 3CC2h, 796h, 0C940h, 4E32h
.data:00000000005D91BC                 dd 4E2Eh, 924Ah, 5B5Ch
"
拿到十六进制数组 那就直接上脚本吧
markdown:
"
from z3 import *

a = [
0xB1B0, 0x5678, 0x7FF2, 0xA332, 0xA0E8, 0x364C, 0x2BD4,
0xC8FE, 0x4A7C, 0x18,   0x2BE4, 0x4144, 0x3BA6, 0xBE8C,
0x8F7E, 0x35F8, 0x61AA, 0x2B4A, 0x6828, 0xB39E, 0xB542,
0x33EC, 0xC7D8, 0x448C, 0x9310, 0x8808, 0xADD4, 0x3CC2,
0x796,  0xC940, 0x4E32, 0x4E2E, 0x924A, 0x5B5C
]

# ===== 基本信息 =====
prefix = "moectf{"
prefix_len = len(prefix)

n = 34  # check only part

s = [BitVec(f's{i}', 8) for i in range(prefix_len + n + 1)]
b = [BitVec(f'b{i}', 32) for i in range(n)]

solver = Solver()

MOD = 51966
MASK32 = 0xffffffff

# ===== 固定前缀 =====
for i, c in enumerate(prefix):
    solver.add(s[i] == ord(c))

# ===== 固定结尾 =====
solver.add(s[prefix_len + n] == ord('}'))

# ===== 可打印字符约束 =====
for i in range(prefix_len, prefix_len + n):
    solver.add(s[i] >= 32, s[i] <= 126)

# ===== 核心 check =====
for i in range(n):
    idx = prefix_len + i

    t = 47806 * (ZeroExt(24, s[idx]) + i)

    if i > 0:
        t = t ^ (b[i-1] ^ 0x114514)

    solver.add(b[i] == URem(t, BitVecVal(MOD, 32)))
    solver.add(b[i] == a[i])

# ===== solve =====
if solver.check() == sat:
    m = solver.model()
    res = ''.join(chr(m[s[i]].as_long()) for i in range(prefix_len, prefix_len + n))
    print("FLAG:", prefix + res + "}")
else:
    print("unsat")
"
输出flag
markdown:
"
FLAG: moectf{Y0u_Kn0w_z3_S0Iv3r_N0w_a1f2bdce4a9}
"
Flag:
markdown:
"
moectf{Y0u_Kn0w_z3_S0Iv3r_N0w_a1f2bdce4a9}
"
提交跑路
