from Crypto.Cipher import ARC4
cipher = ARC4.new(b"mylittlepony") #定义rc4加密对象密钥为"mylittlepony"
print(cipher.decrypt(bytes.fromhex("6091ef85e8b3f107894a46b0bc36d32ce17e914216c95fef56e3a4409d73")) .decode('utf-8')) #解密密文并输出明文