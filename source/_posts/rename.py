import os
for f in os.listdir('.'):
    name,ext=f.split('.')
    # if ext=='md':
    #     with open(f,encoding='utf-8') as file:
    #         inner=file.readlines()
    #     dl=None
    #     for l in inner:
    #         # print(l)
    #         if 'date' in l:
    #             dl=l
    #             break
    #     if not dl:
    #         continue
    #     d=dl.split(' ')[1]
    #     print(f,d+'-'+name+'.md')
    #     os.rename(f,d+'-'+name+'.md')
    if ext=='ext':
        os.rename(f,name+'.md')