import os
cnt=0
for f in os.listdir('./'):
    name,ext=f.split('.')
    if ext!='md':
        continue
    with open(f,encoding='utf-8') as file:
        cnt+=len(file.read())
print('Total number of chars:',cnt)