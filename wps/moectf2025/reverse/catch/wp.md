Catch 难度很小 但比刚刚那个牛大的比起正常了许多
一个双击秒闪的exe
直接开ida反编译看main
"
int __fastcall main(int argc, const char **argv, const char **envp)
{
  _main(argc, argv, envp);
  solve();
  return 0;
}
"
看得到主要函数其实是solve 被main套住了
那就直接双击过去
"
void __fastcall __noreturn solve()
{
  std::logic_error *exception; // rbx

  printf("my flag is hidden in this program. Can you find it?\n");
  sub_114514();
  exception = (std::logic_error *)_cxa_allocate_exception(0x10u);
  std::logic_error::logic_error(exception, "nothing but error");
  _cxa_throw(exception, (struct type_info *)&`typeinfo for'std::logic_error, refptr__ZNSt11logic_errorD1Ev);
}
"
看到他闪的那一刻只是print了一句话
主逻辑在sub_114514 - 一个很臭的function
双击看看有多臭
"
__int64 __fastcall sub_114514()
{
  __int64 result; // rax
  int v1; // [rsp+28h] [rbp-8h]
  unsigned int i; // [rsp+2Ch] [rbp-4h]

  printf("try to catch me\n");
  v1 = strlen(_data_start__);
  for ( i = 0; ; ++i )
  {
    result = i;
    if ( (int)i >= v1 )
      break;
    _data_start__[i] = enc(_data_start__[i]);
  }
  return result;
}
"
他最后解密完了 但是程序不输出，直接崩溃
但是v1这个可以看到他的加密数据在_data_start__
还有看到他是靠enc编译flag的
那就直接看enc的对称加密
去看看他的加密数据
"
.data:0000000140027000 ; char _data_start__[]
.data:0000000140027000 __data_start__  db 'geoi~lq~bcyUcyUkUlkaoUlfkmw',0
"
拿到加密数据"geoi~lq~bcyUcyUkUlkaoUlfkmw"
再去enc看看伪代码
"
__int64 __fastcall enc(char a1)
{
  return (unsigned int)(a1 ^ 0x11);
}
"
可以看到异或0x11
那就直接开始写exp
用python来运行exe来进行异或解密运算
"
encrypt="geoi~lq~bcyUcyUkUlkaoUlfkmw"
print(''.join([chr(c ^ 0x22) for c in encrypt.encode('utf-8)]))
"
然后就炸了 输出乱码
回头看看题目说明
"
IDA pro 9.0 推出了针对 C++ exception 的优化
但是这并不意味着所有的 try catch 都能被正确反编译
"
合着他编译错误了？？？
看看string有没有料
看到"zbrpgs{F4z3_Ge1px_jvgu_@sybjre_qrfhjn}“格式很像flag
放到解码软件解码
"
Rot13解码:		★  moectf{S4m3_Tr1ck_with_@flower_desuwa}
Rot18解码:		★  moectf{S9m8_Tr6ck_with_@flower_desuwa}
"
发现是是rot13/18......无语住了
尝试后发现是"moectf{S4m3_Tr1ck_with_@flower_desuwa}"是正确的

事实上跟base差不多 但是。。。。被他fake了
