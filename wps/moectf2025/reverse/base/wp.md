咱就是说有史以来最牛大的reverse非这题莫属
看到exe先运行一波 看到要求我输入flag
反手打开ida反编译看main
一进来就直接看main直接瞳孔地震
source code:
(markdown：)
"
int __fastcall main(int argc, const char **argv, const char **envp)
{
  FILE *v3; // rax
  __int64 v4; // rdx
  __int64 v5; // rax
  unsigned __int64 v6; // rax
  char *v7; // rbx
  int v8; // eax
  char *v9; // rcx
  char v11[16]; // [rsp+20h] [rbp-98h] BYREF
  char Buffer[112]; // [rsp+30h] [rbp-88h] BYREF

  sub_140001010(Format);
  sub_140001010((char *)&byte_1400032F0);
  v3 = _acrt_iob_func(0);
  fgets(Buffer, 100, v3);
  v4 = -1;
  v5 = -1;
  do
    ++v5;
  while ( Buffer[v5] );
  if ( v5 && v11[v5 + 15] == 10 )
  {
    v6 = v5 - 1;
    if ( v6 >= 0x64 )
      sub_140001448(Buffer);
    Buffer[v6] = 0;
  }
  do
    ++v4;
  while ( Buffer[v4] );
  v7 = (char *)sub_140001070(Buffer, v4, v11);
  v8 = strcmp(v7, "bW9lY3Rme1kwdV9DNG5fRzAwZF9BdF9CNDVlNjQhIX0=");
  v9 = (char *)&unk_140003300;
  if ( v8 )
    v9 = (char *)&byte_140003318;
  sub_140001010(v9);
  free(v7);
  return 0;
}
"
直接就是base64
直接打开hackbar的base64decode
反手解码拿到flag提交
flag:
(markdown:)
"
moectf{Y0u_C4n_G00d_At_B45e64!!}
"