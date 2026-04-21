打开elf直接用objdump看main主函数
markdown:
"objdump -d attachment | sed -n '/<main>:/,/^$/p'"
Output:
"
0000000000404605 <main>:
  404605:       f3 0f 1e fa             endbr64
  404609:       55                      push   %rbp
  40460a:       48 89 e5                mov    %rsp,%rbp
  40460d:       53                      push   %rbx
  40460e:       48 81 ec 00 10 00 00    sub    $0x1000,%rsp
  404615:       48 83 0c 24 00          orq    $0x0,(%rsp)
  40461a:       48 81 ec 00 10 00 00    sub    $0x1000,%rsp
  404621:       48 83 0c 24 00          orq    $0x0,(%rsp)
  404626:       48 81 ec 38 07 00 00    sub    $0x738,%rsp
  40462d:       64 48 8b 04 25 28 00    mov    %fs:0x28,%rax
  404634:       00 00 
  404636:       48 89 45 e8             mov    %rax,-0x18(%rbp)
  40463a:       31 c0                   xor    %eax,%eax
  40463c:       bf 00 00 00 00          mov    $0x0,%edi
  404641:       e8 ba 24 00 00          call   406b00 <_ZNSt8ios_base15sync_with_stdioEb>
  404646:       be 00 00 00 00          mov    $0x0,%esi
  40464b:       48 8d 05 1e 6f 1d 00    lea    0x1d6f1e(%rip),%rax        # 5db570 <_ZSt3cin+0x10>
  404652:       48 89 c7                mov    %rax,%rdi
  404655:       e8 46 b9 04 00          call   44ffa0 <_ZNSt9basic_iosIcSt11char_traitsIcEE3tieEPSo>
  40465a:       48 8d 05 f7 29 17 00    lea    0x1729f7(%rip),%rax        # 577058 <_ZNSt8__detailL19_S_invalid_state_idE+0x8>
  404661:       48 89 c6                mov    %rax,%rsi
  404664:       48 8d 05 d5 6d 1d 00    lea    0x1d6dd5(%rip),%rax        # 5db440 <_ZSt4cout>
  40466b:       48 89 c7                mov    %rax,%rdi
  40466e:       e8 fd ae 06 00          call   46f570 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc>
  404673:       48 8d 05 f7 29 17 00    lea    0x1729f7(%rip),%rax        # 577071 <_ZNSt8__detailL19_S_invalid_state_idE+0x21>
  40467a:       48 89 c6                mov    %rax,%rsi
  40467d:       48 8d 05 bc 6d 1d 00    lea    0x1d6dbc(%rip),%rax        # 5db440 <_ZSt4cout>
  404684:       48 89 c7                mov    %rax,%rdi
  404687:       e8 e4 ae 06 00          call   46f570 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc>
  40468c:       48 8d 05 f5 29 17 00    lea    0x1729f5(%rip),%rax        # 577088 <_ZNSt8__detailL19_S_invalid_state_idE+0x38>
  404693:       48 89 c6                mov    %rax,%rsi
  404696:       48 8d 05 a3 6d 1d 00    lea    0x1d6da3(%rip),%rax        # 5db440 <_ZSt4cout>
  40469d:       48 89 c7                mov    %rax,%rdi
  4046a0:       e8 cb ae 06 00          call   46f570 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc>
  4046a5:       48 8d 05 2c 2a 17 00    lea    0x172a2c(%rip),%rax        # 5770d8 <_ZNSt8__detailL19_S_invalid_state_idE+0x88>
  4046ac:       48 89 c6                mov    %rax,%rsi
  4046af:       48 8d 05 8a 6d 1d 00    lea    0x1d6d8a(%rip),%rax        # 5db440 <_ZSt4cout>
  4046b6:       48 89 c7                mov    %rax,%rdi
  4046b9:       e8 b2 ae 06 00          call   46f570 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc>
  4046be:       48 c7 c2 50 ee 46 00    mov    $0x46ee50,%rdx
  4046c5:       48 89 d6                mov    %rdx,%rsi
  4046c8:       48 89 c7                mov    %rax,%rdi
  4046cb:       e8 90 99 06 00          call   46e060 <_ZNSolsEPFRSoS_E>
  4046d0:       48 8d 85 60 ec ff ff    lea    -0x13a0(%rbp),%rax
  4046d7:       48 89 c7                mov    %rax,%rdi
  4046da:       e8 2d 03 00 00          call   404a0c <_ZNSt13random_deviceC1Ev>
  4046df:       48 8d 85 60 ec ff ff    lea    -0x13a0(%rbp),%rax
  4046e6:       48 89 c7                mov    %rax,%rdi
  4046e9:       e8 00 04 00 00          call   404aee <_ZNSt13random_deviceclEv>
  4046ee:       89 c2                   mov    %eax,%edx
  4046f0:       48 8d 85 d0 d8 ff ff    lea    -0x2730(%rbp),%rax
  4046f7:       48 89 d6                mov    %rdx,%rsi
  4046fa:       48 89 c7                mov    %rax,%rdi
  4046fd:       e8 82 05 00 00          call   404c84 <_ZNSt23mersenne_twister_engineImLm32ELm624ELm397ELm31ELm2567483615ELm11ELm4294967295ELm7ELm2636928640ELm15ELm4022730752ELm18ELm1812433253EEC1Em>
  404702:       48 8d 85 60 ec ff ff    lea    -0x13a0(%rbp),%rax
  404709:       48 89 c7                mov    %rax,%rdi
  40470c:       e8 bd 03 00 00          call   404ace <_ZNSt13random_deviceD1Ev>
  404711:       48 8d 85 d0 d8 ff ff    lea    -0x2730(%rbp),%rax
  404718:       48 89 c7                mov    %rax,%rdi
  40471b:       e8 8e 05 00 00          call   404cae <_ZNSt23mersenne_twister_engineImLm32ELm624ELm397ELm31ELm2567483615ELm11ELm4294967295ELm7ELm2636928640ELm15ELm4022730752ELm18ELm1812433253EEclEv>
  404720:       48 89 c1                mov    %rax,%rcx
  404723:       48 89 c8                mov    %rcx,%rax
  404726:       48 c1 e8 02             shr    $0x2,%rax
  40472a:       48 ba c3 f5 28 5c 8f    movabs $0x28f5c28f5c28f5c3,%rdx
  404731:       c2 f5 28 
  404734:       48 f7 e2                mul    %rdx
  404737:       48 c1 ea 02             shr    $0x2,%rdx
  40473b:       48 89 d0                mov    %rdx,%rax
  40473e:       48 c1 e0 02             shl    $0x2,%rax
  404742:       48 01 d0                add    %rdx,%rax
  404745:       48 8d 14 85 00 00 00    lea    0x0(,%rax,4),%rdx
  40474c:       00 
  40474d:       48 01 d0                add    %rdx,%rax
  404750:       48 c1 e0 02             shl    $0x2,%rax
  404754:       48 29 c1                sub    %rax,%rcx
  404757:       48 89 ca                mov    %rcx,%rdx
  40475a:       89 95 cc d8 ff ff       mov    %edx,-0x2734(%rbp)
  404760:       c7 85 c8 d8 ff ff 00    movl   $0x0,-0x2738(%rbp)
  404767:       00 00 00 
  40476a:       e9 62 01 00 00          jmp    4048d1 <main+0x2cc>
  40476f:       48 8d 05 99 29 17 00    lea    0x172999(%rip),%rax        # 57710f <_ZNSt8__detailL19_S_invalid_state_idE+0xbf>
  404776:       48 89 c6                mov    %rax,%rsi
  404779:       48 8d 05 c0 6c 1d 00    lea    0x1d6cc0(%rip),%rax        # 5db440 <_ZSt4cout>
  404780:       48 89 c7                mov    %rax,%rdi
  404783:       e8 e8 ad 06 00          call   46f570 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc>
  404788:       48 8d 05 b1 6c 1d 00    lea    0x1d6cb1(%rip),%rax        # 5db440 <_ZSt4cout>
  40478f:       48 89 c7                mov    %rax,%rdi
  404792:       e8 79 99 06 00          call   46e110 <_ZNSo5flushEv>
  404797:       48 8d 85 c4 d8 ff ff    lea    -0x273c(%rbp),%rax
  40479e:       48 89 c6                mov    %rax,%rsi
  4047a1:       48 8d 05 b8 6d 1d 00    lea    0x1d6db8(%rip),%rax        # 5db560 <_ZSt3cin>
  4047a8:       48 89 c7                mov    %rax,%rdi
  4047ab:       e8 90 ef 04 00          call   453740 <_ZNSirsERi>
  4047b0:       48 8b 10                mov    (%rax),%rdx
  4047b3:       48 83 ea 18             sub    $0x18,%rdx
  4047b7:       48 8b 12                mov    (%rdx),%rdx
  4047ba:       48 01 d0                add    %rdx,%rax
  4047bd:       48 89 c7                mov    %rax,%rdi
  4047c0:       e8 db b6 04 00          call   44fea0 <_ZNKSt9basic_iosIcSt11char_traitsIcEEntEv>
  4047c5:       84 c0                   test   %al,%al
  4047c7:       75 15                   jne    4047de <main+0x1d9>
  4047c9:       8b 85 c4 d8 ff ff       mov    -0x273c(%rbp),%eax
  4047cf:       85 c0                   test   %eax,%eax
  4047d1:       78 0b                   js     4047de <main+0x1d9>
  4047d3:       8b 85 c4 d8 ff ff       mov    -0x273c(%rbp),%eax
  4047d9:       83 f8 63                cmp    $0x63,%eax
  4047dc:       7e 07                   jle    4047e5 <main+0x1e0>
  4047de:       b8 01 00 00 00          mov    $0x1,%eax
  4047e3:       eb 05                   jmp    4047ea <main+0x1e5>
  4047e5:       b8 00 00 00 00          mov    $0x0,%eax
  4047ea:       84 c0                   test   %al,%al
  4047ec:       74 5d                   je     40484b <main+0x246>
  4047ee:       48 8d 05 35 29 17 00    lea    0x172935(%rip),%rax        # 57712a <_ZNSt8__detailL19_S_invalid_state_idE+0xda>
  4047f5:       48 89 c6                mov    %rax,%rsi
  4047f8:       48 8d 05 41 6c 1d 00    lea    0x1d6c41(%rip),%rax        # 5db440 <_ZSt4cout>
  4047ff:       48 89 c7                mov    %rax,%rdi
  404802:       e8 69 ad 06 00          call   46f570 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc>
  404807:       48 c7 c2 50 ee 46 00    mov    $0x46ee50,%rdx
  40480e:       48 89 d6                mov    %rdx,%rsi
  404811:       48 89 c7                mov    %rax,%rdi
  404814:       e8 47 98 06 00          call   46e060 <_ZNSolsEPFRSoS_E>
  404819:       be 00 00 00 00          mov    $0x0,%esi
  40481e:       48 8d 05 4b 6d 1d 00    lea    0x1d6d4b(%rip),%rax        # 5db570 <_ZSt3cin+0x10>
  404825:       48 89 c7                mov    %rax,%rdi
  404828:       e8 93 b6 04 00          call   44fec0 <_ZNSt9basic_iosIcSt11char_traitsIcEE5clearESt12_Ios_Iostate>
  40482d:       e8 88 01 00 00          call   4049ba <_ZNSt14numeric_limitsIlE3maxEv>
  404832:       ba 0a 00 00 00          mov    $0xa,%edx
  404837:       48 89 c6                mov    %rax,%rsi
  40483a:       48 8d 05 1f 6d 1d 00    lea    0x1d6d1f(%rip),%rax        # 5db560 <_ZSt3cin>
  404841:       48 89 c7                mov    %rax,%rdi
  404844:       e8 17 29 00 00          call   407160 <_ZNSi6ignoreEli>
  404849:       eb 7f                   jmp    4048ca <main+0x2c5>
  40484b:       8b 85 c4 d8 ff ff       mov    -0x273c(%rbp),%eax
  404851:       39 85 cc d8 ff ff       cmp    %eax,-0x2734(%rbp)
  404857:       75 46                   jne    40489f <main+0x29a>
  404859:       48 8d 05 d8 28 17 00    lea    0x1728d8(%rip),%rax        # 577138 <_ZNSt8__detailL19_S_invalid_state_idE+0xe8>
  404860:       48 89 c6                mov    %rax,%rsi
  404863:       48 8d 05 d6 6b 1d 00    lea    0x1d6bd6(%rip),%rax        # 5db440 <_ZSt4cout>
  40486a:       48 89 c7                mov    %rax,%rdi
  40486d:       e8 fe ac 06 00          call   46f570 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc>
  404872:       48 8d 05 cf 28 17 00    lea    0x1728cf(%rip),%rax        # 577148 <_ZNSt8__detailL19_S_invalid_state_idE+0xf8>
  404879:       48 89 c6                mov    %rax,%rsi
  40487c:       48 8d 05 bd 6b 1d 00    lea    0x1d6bbd(%rip),%rax        # 5db440 <_ZSt4cout>
  404883:       48 89 c7                mov    %rax,%rdi
  404886:       e8 e5 ac 06 00          call   46f570 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc>
  40488b:       48 c7 c2 50 ee 46 00    mov    $0x46ee50,%rdx
  404892:       48 89 d6                mov    %rdx,%rsi
  404895:       48 89 c7                mov    %rax,%rdi
  404898:       e8 c3 97 06 00          call   46e060 <_ZNSolsEPFRSoS_E>
  40489d:       eb 3f                   jmp    4048de <main+0x2d9>
  40489f:       48 8d 05 e5 28 17 00    lea    0x1728e5(%rip),%rax        # 57718b <_ZNSt8__detailL19_S_invalid_state_idE+0x13b>
  4048a6:       48 89 c6                mov    %rax,%rsi
  4048a9:       48 8d 05 90 6b 1d 00    lea    0x1d6b90(%rip),%rax        # 5db440 <_ZSt4cout>
  4048b0:       48 89 c7                mov    %rax,%rdi
  4048b3:       e8 b8 ac 06 00          call   46f570 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc>
  4048b8:       48 c7 c2 50 ee 46 00    mov    $0x46ee50,%rdx
  4048bf:       48 89 d6                mov    %rdx,%rsi
  4048c2:       48 89 c7                mov    %rax,%rdi
  4048c5:       e8 96 97 06 00          call   46e060 <_ZNSolsEPFRSoS_E>
  4048ca:       83 85 c8 d8 ff ff 01    addl   $0x1,-0x2738(%rbp)
  4048d1:       83 bd c8 d8 ff ff 09    cmpl   $0x9,-0x2738(%rbp)
  4048d8:       0f 8e 91 fe ff ff       jle    40476f <main+0x16a>
  4048de:       48 8d 05 ba 28 17 00    lea    0x1728ba(%rip),%rax        # 57719f <_ZNSt8__detailL19_S_invalid_state_idE+0x14f>
  4048e5:       48 89 c6                mov    %rax,%rsi
  4048e8:       48 8d 05 51 6b 1d 00    lea    0x1d6b51(%rip),%rax        # 5db440 <_ZSt4cout>
  4048ef:       48 89 c7                mov    %rax,%rdi
  4048f2:       e8 79 ac 06 00          call   46f570 <_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc>
  4048f7:       48 c7 c2 50 ee 46 00    mov    $0x46ee50,%rdx
  4048fe:       48 89 d6                mov    %rdx,%rsi
  404901:       48 89 c7                mov    %rax,%rdi
  404904:       e8 57 97 06 00          call   46e060 <_ZNSolsEPFRSoS_E>
  404909:       b8 00 00 00 00          mov    $0x0,%eax
  40490e:       48 8b 55 e8             mov    -0x18(%rbp),%rdx
  404912:       64 48 2b 14 25 28 00    sub    %fs:0x28,%rdx
  404919:       00 00 
  40491b:       74 28                   je     404945 <main+0x340>
  40491d:       eb 21                   jmp    404940 <main+0x33b>
  40491f:       f3 0f 1e fa             endbr64
  404923:       48 89 c3                mov    %rax,%rbx
  404926:       48 8d 85 60 ec ff ff    lea    -0x13a0(%rbp),%rax
  40492d:       48 89 c7                mov    %rax,%rdi
  404930:       e8 99 01 00 00          call   404ace <_ZNSt13random_deviceD1Ev>
  404935:       48 89 d8                mov    %rbx,%rax
  404938:       48 89 c7                mov    %rax,%rdi
  40493b:       e8 40 14 0a 00          call   4a5d80 <_Unwind_Resume>
  404940:       e8 1b a5 12 00          call   52ee60 <__stack_chk_fail>
  404945:       48 8b 5d f8             mov    -0x8(%rbp),%rbx
  404949:       c9                      leave
  40494a:       c3                      ret
"
经分析重点在这几行
markdown:
"
40484b:  mov -0x273c(%rbp), %eax  # 获取用户输入
404851:  cmp %eax, -0x2734(%rbp)  # 与内存中的随机数比较
404857:  jne 40489f               # 如果不等，跳到错误提示并增加循环计数
"
那就开始gdb调试
设置 Intel 汇编格式并下断点：
#markdown
"
(gdb) set disassembly-flavor intel
(gdb) b *0x404851
"
然后输入run运行
markdown:
"
run
"
回显:
"
Starting program: /workspaces/ctf_server/attachment 
Downloading separate debug info for system-supplied DSO at 0x7ffff7ffd000
Welcome to MoeCTF 2025!                                                                                                             
Let's play a game!
I have a secret number between 0 and 99, and you can guess it 10 times.
If you successly guessed it, I will give you the flag!
Please input your number:
"
随便输入一个数
然后可以看到回显看到程序被Breakpoint卡住了
markdown:
"
Breakpoint 1, 0x0000000000404851 in main ()
"
那就看看正确答案有没有被勾引出来
markdown:
"
x/wd $rbp-0x2734
"
回显:
markdown:
"
0x7fffffffa6dc: 73
"
那就知道了答案是73
这一步发现了确实可以勾引出来
然后利用command编写自动化脚本
在命中比较指令时，强行将我们的输入（eax）修改为内存中的正确答案（[rbp-0x2734]）
不是73是因为他是随机的 每次的数字都不一样 所以每次都要勾引
从刚刚的调试可以知道答案在rbp-0x2734
那就可以直接叫用里面的答案改输入值
连续10次直接爆flag
markdown:
"
(gdb) command 1
Type commands for breakpoint(1), one per line.
End with a line saying just "end".
> set $eax = *(int*)($rbp - 0x2734)
> silent
> printf ">> Hooked! Correct value was: %d\n", $eax
> continue
> end
"
脚本逻辑：
输入 run 开始程序 每当提示 Please input your number: 时 随便输入一个数字（如 0）并回车
由于 GDB 脚本会自动修正你的输入 连续“猜对” 10 次后 程序将跳出循环并触发打印 Flag 的逻辑
然后输入c运行
看输出
markdown:
"
Continuing.
You are right!
The flag is moectf{open_your_IDA_and_start_reverse_engineering!!}.
Thanks for your playing!
[Inferior 1 (process 6677) exited normally]
"
Flag:
moectf{open_your_IDA_and_start_reverse_engineering!!}