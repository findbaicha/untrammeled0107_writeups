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